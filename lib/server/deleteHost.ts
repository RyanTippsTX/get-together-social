import type { NextApiRequest, NextApiResponse } from 'next';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

// The service-role client must never be exposed to the browser. Every destructive
// operation below is gated by a verified JWT whose subject matches the URL host ID.
export function createDeleteHostHandler(
  client: SupabaseClient<Database>,
  verifyUser: SupabaseClient<Database>['auth']['getUser']
) {
  return async function deleteHost(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
      res.setHeader('Allow', 'DELETE');
      res.status(405).send('Method Not Allowed');
      return;
    }
    const hostId = req.query.host_id;
    const header = req.headers.authorization;
    if (typeof hostId !== 'string' || typeof header !== 'string') {
      res.status(403).send('Forbidden');
      return;
    }
    // Accept both the existing page's raw JWT and standard Bearer authorization.
    const token = header.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      res.status(403).send('Forbidden');
      return;
    }
    const {
      data: { user },
      error: authError,
    } = await verifyUser(token);
    if (authError || !user || user.id !== hostId) {
      res.status(403).send('Forbidden');
      return;
    }

    async function removePhotos(bucket: string, ownerId: string) {
      const prefix = `avatars/${ownerId}`;
      // App-managed photos are flat, versioned files within this owner directory.
      while (true) {
        const { data: files, error } = await client.storage
          .from(bucket)
          .list(prefix, { limit: 1000 });
        if (error) throw error;
        if (!files?.length) return;
        const { data: removedFiles, error: removeError } = await client.storage
          .from(bucket)
          .remove(files.map((file) => `${prefix}/${file.name}`));
        if (removeError) throw removeError;
        if (removedFiles?.length !== files.length) throw new Error('Photo cleanup incomplete');
      }
    }
    let stage = 'list events';
    try {
      const { data: events, error } = await client
        .from('events')
        .select('event_id')
        .eq('host_id', hostId);
      if (error) throw error;
      for (const { event_id } of events || []) {
        stage = 'remove event photos';
        await removePhotos('events', event_id);
        for (const table of ['contributions', 'guests', 'page_visits', 'events'] as const) {
          stage = `delete ${table}`;
          const { error } = await client.from(table).delete().eq('event_id', event_id);
          if (error) throw error;
        }
      }
      stage = 'remove host photos';
      await removePhotos('hosts', hostId);
      stage = 'delete host profile';
      const { error: profileError } = await client.from('hosts').delete().eq('host_id', hostId);
      if (profileError) throw profileError;
      stage = 'delete auth user';
      const { error: userError } = await client.auth.admin.deleteUser(hostId);
      if (userError) throw userError;
      res.status(204).end();
    } catch {
      // Log the operation only; never log tokens, keys, or record contents.
      console.error('Account cleanup failed:', stage);
      // Do not delete the auth user after a failed cleanup, or report false success.
      // A retry can finish partial cleanup, with ownership still checked above.
      res.status(409).send('Account cleanup could not finish. Please try again.');
    }
  };
}
