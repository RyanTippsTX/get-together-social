# Host ownership and shared-guest RLS

`migrations/20261018_host_ownership_rls.sql` was applied to the shared Supabase project on October 18, 2026, after a rollback-only rehearsal. It is recorded here for review and reproducibility; do not reapply it to that project. The migration is transactional and does not update or delete existing rows.

## Access model

The owner explicitly chose to preserve name-only guests. A guest name is **not verified identity**: anyone with access can select another guest's name and manage shared guest contributions. These policies protect the host boundary; they do not claim to provide individual guest ownership.

| Resource | Public/guest access | Host access |
| --- | --- | --- |
| Hosts | Read public display names/photo URLs | Create/update/delete own profile only |
| Events | Read existing public event data | Create/update/delete own events only; identity/ownership immutable |
| Guests | Join active events and manage the shared names | Same shared model |
| Contributions | Add guest items when enabled/unfrozen; claim/unclaim requests; manage guest-created items | Manage own event's items and requests |
| Page visits | Read counts/data and append visits to active events; cannot forge host flag | Own-event cleanup allowed |
| Testing | No client access | No client access |
| Photos | Public bucket delivery remains public | Storage API access restricted to own avatar/event directory |

Guest changes cannot rewrite a host request's description, create host-owned items/requests, delete requests, move items or guests between events, or overwrite an existing claim directly. Unclaiming remains shared. Identity triggers compare old/new values where RLS alone cannot enforce immutability.

Public reads intentionally retain the existing application/statistics contract, including rows marked deleted by the app. The application hides those events and guest writes reject them. This rollout does not make event links private or add anti-spam/rate limiting.

The existing blanket Storage `ALL` policy was replaced with owner-scoped access. The public buckets, their files, and their settings were not changed. The unused `testing` table now denies browser access. Unneeded table privileges, including `TRUNCATE`, were revoked from browser roles.

## Account-deletion compatibility

The account-deletion endpoint previously verified a JWT but used an anonymous database client for cleanup. RLS correctly blocks that. The accompanying endpoint change uses a server-only service-role client **after** verifying the JWT subject matches the requested host ID. A separate unprivileged client verifies tokens because the legacy SDK mutates its Auth headers during verification. It awaits file deletion, checks every cleanup result, and deletes the Auth user last. Deploy this server change to retain account deletion under RLS. Normal event editing, photos, contributions, and guest login do not require an app deployment.

Vercel must also have a server-only `SUPABASE_SERVICE_KEY` secret. The project currently has only the two public Supabase variables: the preview build succeeds, but the account endpoint cannot initialize without this secret. Adding the key and merging this PR are pending owner approval. Never prefix the service key with `NEXT_PUBLIC_` or put it in source control.

## Validation

- `npm ci --prefix database/tests`
- `npm test --prefix database/tests`: 88 permission checks in isolated PGlite/Postgres with synthetic records and a schema derived from the actual project.
- `node --experimental-strip-types --test database/tests/delete-host.test.mjs`: 12 endpoint authorization/cleanup unit tests, using Node 22+.
- `npm test --prefix database/tests -- --write-rehearsal`: generate an ignored SQL rehearsal ending in `ROLLBACK`. 85 checks passed on Supabase. It never truncates live tables. Storage deletion is tested through its API because Supabase blocks direct SQL deletion.
- `live-smoke.mjs PRIVATE_ENV_FILE TEST_IMAGE PRIVATE_FIXTURE_LEDGER`: explicit integration test creating temporary tagged Auth users, hosts, an event, guest, contributions, and a photo. It never logs credentials or sends sign-up emails. It cleans up only recorded IDs and paths; 19 real API checks passed and fixtures were removed. An optional fifth argument, `http://localhost:PORT`, also tests the actual Next.js account-deletion endpoint; 23 checks passed including rejection of unauthorized deletion, successful owner deletion, and preservation of the other test host. Tokens are only sent to localhost for that endpoint test.

`npm run build` (including lint/type validation) and `npx tsc --noEmit` passed. The existing Next.js 12 dependency tree is unchanged in this security branch; upgrades are in the separate UI PR.

The local tests do not model the entire Supabase platform. The live transaction and API tests cover the actual roles, JWTs, database policies, and Storage service. No non-test event records were edited or deleted.

References: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [column privileges](https://supabase.com/docs/guides/database/postgres/column-level-security).
