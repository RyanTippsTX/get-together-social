// Explicitly invoked integration check. Creates only disposable, tagged fixtures.
// Uses admin API creation with email_confirm=true: no sign-up emails are sent.
// Requires a private env file path, and a test image path. Never logs credentials.
import { readFile, writeFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import { randomUUID, randomBytes } from 'node:crypto';
import assert from 'node:assert/strict';
const env = parseEnv(await readFile(process.argv[2], 'utf8'));
const base = env.NEXT_PUBLIC_SUPABASE_URL;
const anon = env.NEXT_PUBLIC_SUPABASE_API_KEY;
const service = env.SUPABASE_SERVICE_KEY;
assert(base && anon && service, 'Missing private test configuration');
const ledgerPath = process.argv[4];
assert(ledgerPath, 'Provide a private fixture ledger path for recovery');
const endpoint = process.argv[5];
if (endpoint)
  assert(
    new URL(endpoint).hostname === 'localhost',
    'Endpoint verification is restricted to localhost'
  );
const endpointDeleted = new Set();
const image = await readFile(process.argv[3]);
const run = randomUUID();
const owned = { run, users: [], events: [], guests: [], contributions: [], storage: [] };
const persist = () => writeFile(ledgerPath, JSON.stringify(owned, null, 2), { mode: 0o600 });
let checks = 0;
const pass = (name) => console.log(`PASS ${++checks}: ${name}`);
async function req(path, { token = anon, method = 'GET', body, binary } = {}) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      apikey: token === service ? service : anon,
      Authorization: `Bearer ${token}`,
      'Content-Type': binary ? 'image/jpeg' : 'application/json',
      Prefer: 'return=representation',
    },
    body: binary || (body === undefined ? undefined : JSON.stringify(body)),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { ok: res.ok, status: res.status, data };
}
function ok(r, label) {
  assert(r.ok, `${label}: HTTP ${r.status}`);
  return r.data;
}
function denied(r, label) {
  assert(!r.ok || (Array.isArray(r.data) && r.data.length === 0), `${label}: unexpectedly allowed`);
  pass(label);
}
const row = (table, idField, id) => `/rest/v1/${table}?${idField}=eq.${id}`;
try {
  const tokens = [];
  for (let i = 0; i < 2; i++) {
    const email = `codex-rls-${run}-${i}@example.invalid`,
      password = randomBytes(32).toString('base64url');
    const user = ok(
      await req('/auth/v1/admin/users', {
        token: service,
        method: 'POST',
        body: { email, password, email_confirm: true },
      }),
      'create synthetic auth user'
    );
    owned.users.push(user.id);
    await persist();
    const session = ok(
      await req('/auth/v1/token?grant_type=password', {
        method: 'POST',
        body: { email, password },
      }),
      'authenticate synthetic host'
    );
    tokens.push(session.access_token);
    ok(
      await req('/rest/v1/hosts', {
        token: tokens[i],
        method: 'POST',
        body: { host_id: user.id, display_name: `Codex RLS temporary ${i}` },
      }),
      'host creates own profile'
    );
  }
  pass('authenticated hosts can create their own profiles');
  const [a, b] = tokens;
  const event = randomUUID();
  owned.events.push(event);
  await persist();
  ok(
    await req('/rest/v1/events', {
      token: a,
      method: 'POST',
      body: {
        event_id: event,
        host_id: owned.users[0],
        title: `Codex RLS temporary ${run}`,
        date: '2026-10-25',
        url_code: Math.floor(Math.random() * 10000000),
        url_string: 'codex-rls-temporary',
        description: 'Disposable RLS verification fixture',
        contributions_enabled: true,
        contributions_frozen: false,
      },
    }),
    'host creates event'
  );
  pass('host can create an event');
  const eventPath = row('events', 'event_id', event);
  assert.equal(
    ok(
      await req(eventPath, { token: a, method: 'PATCH', body: { time: 'RLS checked' } }),
      'host edits own event'
    ).length,
    1
  );
  pass('host can edit own event');
  denied(
    await req(eventPath, { method: 'PATCH', body: { title: 'unauthorized' } }),
    'anonymous event changes denied'
  );
  denied(
    await req(eventPath, { token: b, method: 'PATCH', body: { title: 'unauthorized' } }),
    'other host event changes denied'
  );
  denied(
    await req(row('hosts', 'host_id', owned.users[0]), {
      token: b,
      method: 'PATCH',
      body: { display_name: 'unauthorized' },
    }),
    'other host profile changes denied'
  );
  denied(await req('/rest/v1/testing?select=*'), 'unused testing table inaccessible');
  const guest = randomUUID();
  owned.guests.push(guest);
  await persist();
  ok(
    await req('/rest/v1/guests', {
      method: 'POST',
      body: { guest_id: guest, event_id: event, display_name: 'Codex RLS temporary guest' },
    }),
    'guest joins'
  );
  pass('name-only guest joining works');
  const request = randomUUID(),
    item = randomUUID();
  owned.contributions.push(request, item);
  await persist();
  ok(
    await req('/rest/v1/contributions', {
      token: a,
      method: 'POST',
      body: {
        contribution_id: request,
        event_id: event,
        description: 'Test requested item',
        requested: true,
      },
    }),
    'host request'
  );
  ok(
    await req('/rest/v1/contributions', {
      method: 'POST',
      body: {
        contribution_id: item,
        event_id: event,
        description: 'Test guest item',
        contributor_id: guest,
        requested: false,
      },
    }),
    'guest contribution'
  );
  pass('host requests and guest additions work');
  const requestPath = row('contributions', 'contribution_id', request);
  denied(
    await req(requestPath, { method: 'PATCH', body: { description: 'unauthorized' } }),
    'guest cannot rewrite host request'
  );
  assert.equal(
    ok(
      await req(requestPath, { method: 'PATCH', body: { contributor_id: guest } }),
      'claim request'
    ).length,
    1
  );
  pass('guest can claim request');
  assert.equal(
    ok(
      await req(requestPath, { method: 'PATCH', body: { contributor_id: null } }),
      'unclaim request'
    ).length,
    1
  );
  pass('guest can unclaim request');
  ok(
    await req(eventPath, { token: a, method: 'PATCH', body: { contributions_frozen: true } }),
    'freeze event'
  );
  const deniedItem = randomUUID();
  owned.contributions.push(deniedItem);
  await persist();
  denied(
    await req('/rest/v1/contributions', {
      method: 'POST',
      body: {
        contribution_id: deniedItem,
        event_id: event,
        description: 'Not allowed',
        contributor_id: guest,
      },
    }),
    'frozen event rejects new guest items'
  );
  ok(
    await req(eventPath, { token: a, method: 'PATCH', body: { contributions_frozen: false } }),
    'unfreeze event'
  );
  const file = `avatars/${event}/rls-${run}.jpg`;
  owned.storage.push({ bucket: 'events', path: file });
  await persist();
  ok(
    await req(`/storage/v1/object/events/${file}`, { token: a, method: 'POST', binary: image }),
    'host photo upload'
  );
  pass('host photo upload allowed');
  const list = async () =>
    ok(
      await req('/storage/v1/object/list/events', {
        token: a,
        method: 'POST',
        body: { prefix: `avatars/${event}`, limit: 100 },
      }),
      'list owned photos'
    );
  assert.equal((await list()).length, 1);
  pass('host can list own photos');
  owned.storage.push({ bucket: 'events', path: `avatars/${event}/foreign.jpg` });
  await persist();
  const foreignUpload = await req(`/storage/v1/object/events/avatars/${event}/foreign.jpg`, {
    token: b,
    method: 'POST',
    binary: image,
  });
  assert(!foreignUpload.ok, 'foreign photo upload unexpectedly allowed');
  pass('other host photo upload denied');
  for (const [token, name] of [
    [anon, 'anonymous'],
    [b, 'other host'],
  ]) {
    await req('/storage/v1/object/events', { token, method: 'DELETE', body: { prefixes: [file] } });
    assert.equal((await list()).length, 1, `${name} deleted an owner photo`);
    pass(`${name} cannot remove host photo`);
  }
  ok(
    await req('/storage/v1/object/events', {
      token: a,
      method: 'DELETE',
      body: { prefixes: [file] },
    }),
    'owner photo removal'
  );
  assert.equal((await list()).length, 0);
  pass('host can remove own photo through Storage API');
  if (endpoint) {
    const url = `${endpoint}/api/hosts/${owned.users[0]}`;
    for (const [headers, label] of [
      [{}, 'anonymous'],
      [{ Authorization: b }, 'other host'],
    ]) {
      assert.equal((await fetch(url, { method: 'DELETE', headers })).status, 403);
      pass(`${label} cannot invoke privileged account deletion`);
    }
    ok(
      await req(`/storage/v1/object/events/${file}`, { token: a, method: 'POST', binary: image }),
      'restore fixture photo for endpoint cleanup'
    );
    assert.equal(
      (await fetch(url, { method: 'DELETE', headers: { Authorization: a } })).status,
      204
    );
    endpointDeleted.add(owned.users[0]);
    pass('verified owner account deletion succeeds');
    for (const table of ['events', 'guests', 'contributions', 'page_visits']) {
      assert.equal(
        ok(
          await req(row(table, 'event_id', event), { token: service }),
          'check removed fixture records'
        ).length,
        0
      );
    }
    assert.equal(
      ok(
        await req(row('hosts', 'host_id', owned.users[0]), { token: service }),
        'check removed fixture host'
      ).length,
      0
    );
    assert.equal(
      (await req(`/auth/v1/admin/users/${owned.users[0]}`, { token: service })).status,
      404
    );
    assert.equal(
      ok(
        await req('/storage/v1/object/list/events', {
          token: service,
          method: 'POST',
          body: { prefix: `avatars/${event}`, limit: 100 },
        }),
        'check removed fixture photo'
      ).length,
      0
    );
    assert.equal(
      ok(
        await req(row('hosts', 'host_id', owned.users[1]), { token: service }),
        'check other fixture host remains'
      ).length,
      1
    );
    pass('endpoint removes only the verified owner account and its records/photos');
  }
  console.log(`${checks} live API checks passed.`);
} finally {
  // Cleanup only exact IDs/paths created by this run, using the server-only service role.
  // No broad filters or deletes against existing production records.
  const errors = [];
  async function cleanup(path, opts) {
    const r = await req(path, { token: service, ...opts });
    if (!r.ok) errors.push(`${path.split('?')[0]} HTTP ${r.status}`);
  }
  for (const f of owned.storage)
    await cleanup(`/storage/v1/object/${f.bucket}`, {
      method: 'DELETE',
      body: { prefixes: [f.path] },
    });
  for (const id of owned.contributions)
    await cleanup(row('contributions', 'contribution_id', id), { method: 'DELETE' });
  for (const id of owned.guests) await cleanup(row('guests', 'guest_id', id), { method: 'DELETE' });
  for (const id of owned.events) await cleanup(row('events', 'event_id', id), { method: 'DELETE' });
  for (const id of owned.users) {
    await cleanup(row('hosts', 'host_id', id), { method: 'DELETE' });
    if (!endpointDeleted.has(id)) await cleanup(`/auth/v1/admin/users/${id}`, { method: 'DELETE' });
  }
  if (errors.length)
    throw new Error(`Fixture cleanup requires attention; see ledger. ${errors.join('; ')}`);
  owned.cleaned = true;
  await persist();
  console.log('All temporary API fixtures cleaned up.');
}
