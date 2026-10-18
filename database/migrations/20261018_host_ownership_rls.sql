-- Preserve the deliberately shared, name-only guest model.
-- This migration protects hosts; it does not authenticate individual guests.
-- Apply atomically. No existing records are updated or deleted.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testing ENABLE ROW LEVEL SECURITY;

-- RLS does not govern TRUNCATE; remove unnecessary table privileges too.
REVOKE ALL ON public.hosts, public.events, public.guests, public.contributions,
  public.page_visits, public.testing FROM anon, authenticated;
GRANT SELECT ON public.hosts, public.events, public.guests,
  public.contributions, public.page_visits TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hosts, public.events TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.guests, public.contributions TO anon, authenticated;
GRANT INSERT ON public.page_visits TO anon, authenticated;
GRANT DELETE ON public.page_visits TO authenticated;

-- Profiles contain public display names and photo URLs, not email addresses.
CREATE POLICY gts_hosts_read ON public.hosts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY gts_hosts_insert ON public.hosts FOR INSERT TO authenticated
  WITH CHECK (host_id = (SELECT auth.uid()));
CREATE POLICY gts_hosts_update ON public.hosts FOR UPDATE TO authenticated
  USING (host_id = (SELECT auth.uid())) WITH CHECK (host_id = (SELECT auth.uid()));
CREATE POLICY gts_hosts_delete ON public.hosts FOR DELETE TO authenticated
  USING (host_id = (SELECT auth.uid()));

-- Public event reads retain the existing all-time statistics contract.
-- The app filters deleted events; guest writes below require an active event.
CREATE POLICY gts_events_read ON public.events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY gts_events_insert ON public.events FOR INSERT TO authenticated
  WITH CHECK (host_id = (SELECT auth.uid()));
CREATE POLICY gts_events_update ON public.events FOR UPDATE TO authenticated
  USING (host_id = (SELECT auth.uid())) WITH CHECK (host_id = (SELECT auth.uid()));
CREATE POLICY gts_events_delete ON public.events FOR DELETE TO authenticated
  USING (host_id = (SELECT auth.uid()));

-- Guest identities remain a shared list, as explicitly requested.
CREATE POLICY gts_guests_read ON public.guests FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY gts_guests_insert ON public.guests FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e
    WHERE e.event_id = guests.event_id AND e.deleted_by_host IS FALSE));
CREATE POLICY gts_guests_update ON public.guests FOR UPDATE TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.events e
    WHERE e.event_id = guests.event_id AND e.deleted_by_host IS FALSE))
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e
    WHERE e.event_id = guests.event_id AND e.deleted_by_host IS FALSE));
CREATE POLICY gts_guests_delete ON public.guests FOR DELETE TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.event_id = guests.event_id
    AND (e.deleted_by_host IS FALSE OR e.host_id = (SELECT auth.uid()))));

CREATE POLICY gts_contributions_read ON public.contributions
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY gts_contributions_host ON public.contributions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.event_id = contributions.event_id
    AND e.host_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.event_id = contributions.event_id
    AND e.host_id = (SELECT auth.uid())) AND
    (contributor_id IS NULL OR EXISTS (SELECT 1 FROM public.guests g
      WHERE g.guest_id = contributions.contributor_id AND g.event_id = contributions.event_id)));
CREATE POLICY gts_contributions_guest_insert ON public.contributions
  FOR INSERT TO anon, authenticated
  WITH CHECK (NOT requested AND contributor_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.events e WHERE e.event_id = contributions.event_id
      AND e.deleted_by_host IS FALSE AND e.contributions_enabled AND NOT e.contributions_frozen)
    AND EXISTS (SELECT 1 FROM public.guests g WHERE g.guest_id = contributions.contributor_id
      AND g.event_id = contributions.event_id));
CREATE POLICY gts_contributions_guest_update ON public.contributions
  FOR UPDATE TO anon, authenticated
  USING ((requested OR contributor_id IS NOT NULL)
    AND EXISTS (SELECT 1 FROM public.events e WHERE e.event_id = contributions.event_id
      AND e.deleted_by_host IS FALSE
      AND (e.contributions_enabled OR (requested AND contributor_id IS NOT NULL))))
  WITH CHECK ((requested OR contributor_id IS NOT NULL)
    AND EXISTS (SELECT 1 FROM public.events e WHERE e.event_id = contributions.event_id
      AND e.deleted_by_host IS FALSE
      AND (e.contributions_enabled OR (requested AND contributor_id IS NULL)))
    AND (contributor_id IS NULL OR EXISTS (SELECT 1 FROM public.guests g
      WHERE g.guest_id = contributions.contributor_id AND g.event_id = contributions.event_id)));
-- Removing a guest's own shared-list items remains possible when new entries are frozen.
CREATE POLICY gts_contributions_guest_delete ON public.contributions
  FOR DELETE TO anon, authenticated
  USING (NOT requested AND contributor_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.events e WHERE e.event_id = contributions.event_id
      AND e.deleted_by_host IS FALSE));

CREATE POLICY gts_visits_read ON public.page_visits FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY gts_visits_insert ON public.page_visits FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.event_id = page_visits.event_id
    AND e.deleted_by_host IS FALSE
    AND (NOT page_visits.user_is_host OR e.host_id = (SELECT auth.uid()))));
CREATE POLICY gts_visits_delete ON public.page_visits FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.event_id = page_visits.event_id
    AND e.host_id = (SELECT auth.uid())));
-- No policies/grants for the unused testing table: browser access is denied.

-- WITH CHECK can validate the new row but cannot compare OLD and NEW.
-- Guard identity columns and prevent guests rewriting host-created request content.
CREATE FUNCTION public.gts_guard_identity() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF current_user NOT IN ('anon', 'authenticated') THEN RETURN NEW; END IF;
  IF TG_TABLE_NAME = 'events' THEN
    IF (NEW.event_id, NEW.host_id, NEW.created_at, NEW.url_code)
      IS DISTINCT FROM (OLD.event_id, OLD.host_id, OLD.created_at, OLD.url_code) THEN
      RAISE EXCEPTION 'Event identity and ownership cannot be changed' USING ERRCODE = '42501';
    END IF;
  ELSIF TG_TABLE_NAME = 'guests' THEN
    IF (NEW.guest_id, NEW.event_id, NEW.created_at)
      IS DISTINCT FROM (OLD.guest_id, OLD.event_id, OLD.created_at) THEN
      RAISE EXCEPTION 'Guest identity and event cannot be changed' USING ERRCODE = '42501';
    END IF;
  ELSIF TG_TABLE_NAME = 'contributions' THEN
    IF (NEW.contribution_id, NEW.event_id, NEW.created_at)
      IS DISTINCT FROM (OLD.contribution_id, OLD.event_id, OLD.created_at) THEN
      RAISE EXCEPTION 'Contribution identity and event cannot be changed' USING ERRCODE = '42501';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.events e WHERE e.event_id = OLD.event_id
      AND e.host_id = (SELECT auth.uid())) THEN
      IF NEW.requested IS DISTINCT FROM OLD.requested
        OR (OLD.requested AND NEW.description IS DISTINCT FROM OLD.description)
        OR (NOT OLD.requested AND NEW.contributor_id IS DISTINCT FROM OLD.contributor_id) THEN
        RAISE EXCEPTION 'Only the host can change request details or item ownership' USING ERRCODE = '42501';
      END IF;
      IF OLD.requested AND OLD.contributor_id IS NOT NULL AND NEW.contributor_id IS NOT NULL
        AND NEW.contributor_id IS DISTINCT FROM OLD.contributor_id THEN
        RAISE EXCEPTION 'This request is already claimed' USING ERRCODE = '42501';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.gts_guard_identity() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER gts_events_identity BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.gts_guard_identity();
CREATE TRIGGER gts_guests_identity BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION public.gts_guard_identity();
CREATE TRIGGER gts_contributions_identity BEFORE UPDATE ON public.contributions
  FOR EACH ROW EXECUTE FUNCTION public.gts_guard_identity();

-- The previous ALL policy allowed every signed-in user to replace/delete all photos.
-- Public bucket delivery remains public. Storage API mutations/listing require ownership.
DROP POLICY "Enable insert for authenticated users only" ON storage.objects;
CREATE POLICY gts_storage_owner ON storage.objects FOR ALL TO authenticated
  USING (split_part(name, '/', 1) = 'avatars' AND (
    (bucket_id = 'hosts' AND split_part(name, '/', 2) = (SELECT auth.uid())::text)
    OR (bucket_id = 'events' AND EXISTS (SELECT 1 FROM public.events e
      WHERE e.event_id::text = split_part(name, '/', 2) AND e.host_id = (SELECT auth.uid())))
  ))
  WITH CHECK (split_part(name, '/', 1) = 'avatars' AND (
    (bucket_id = 'hosts' AND split_part(name, '/', 2) = (SELECT auth.uid())::text)
    OR (bucket_id = 'events' AND EXISTS (SELECT 1 FROM public.events e
      WHERE e.event_id::text = split_part(name, '/', 2) AND e.host_id = (SELECT auth.uid())))
  ));
COMMIT;
