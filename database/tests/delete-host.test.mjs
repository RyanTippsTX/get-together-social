import test from 'node:test';
import assert from 'node:assert/strict';
// Node's type stripping keeps this test independent of the Next.js runtime.
import { createDeleteHostHandler } from '../../lib/server/deleteHost.ts';

function fixture({ user = 'host-a', failure = '' } = {}) {
  const calls = [];
  const removed = new Set();
  const verifyUser = async (token) => {
    calls.push(['verify', token]);
    return { data: { user: user ? { id: user } : null }, error: null };
  };
  const client = {
    auth: {
      getUser: async () => {
        throw new Error('Never verify user tokens with the admin client');
      },
      admin: {
        deleteUser: async (id) => {
          calls.push(['auth-delete', id]);
          return { error: null };
        },
      },
    },
    from: (table) => ({
      select: () => ({
        eq: async (column, value) => {
          calls.push(['select', table, column, value]);
          return { data: [{ event_id: 'event-a' }], error: failure === 'select' ? {} : null };
        },
      }),
      delete: () => ({
        eq: async (column, value) => {
          calls.push(['delete', table, column, value]);
          return { error: failure === table ? {} : null };
        },
      }),
    }),
    storage: {
      from: (bucket) => ({
        list: async (prefix) => ({
          data: removed.has(`${bucket}/${prefix}`) ? [] : [{ name: 'v1' }],
          error: failure === 'storage' ? {} : null,
        }),
        remove: async (paths) => {
          calls.push(['photos', bucket, paths]);
          removed.add(`${bucket}/${paths[0].slice(0, -3)}`);
          return { data: paths.map((name) => ({ name })), error: null };
        },
      }),
    },
  };
  const response = {
    code: 0,
    finished: 0,
    status(n) {
      this.code = n;
      return this;
    },
    send() {
      this.finished++;
      return this;
    },
    end() {
      this.finished++;
      return this;
    },
    setHeader() {},
  };
  // Narrow fake dependencies: no database or network calls are possible in these tests.
  const invoke = (req) => createDeleteHostHandler(client, verifyUser)(req, response);
  return { calls, response, invoke };
}
for (const [name, req, user] of [
  [
    'missing authorization',
    { method: 'DELETE', query: { host_id: 'host-a' }, headers: {} },
    'host-a',
  ],
  [
    'wrong owner',
    { method: 'DELETE', query: { host_id: 'host-b' }, headers: { authorization: 'jwt' } },
    'host-a',
  ],
  [
    'invalid token',
    { method: 'DELETE', query: { host_id: 'host-a' }, headers: { authorization: 'jwt' } },
    '',
  ],
  [
    'array route parameter',
    { method: 'DELETE', query: { host_id: ['host-a'] }, headers: { authorization: 'jwt' } },
    'host-a',
  ],
  [
    'empty bearer',
    { method: 'DELETE', query: { host_id: 'host-a' }, headers: { authorization: 'Bearer ' } },
    'host-a',
  ],
]) {
  test(name, async () => {
    const f = fixture({ user });
    await f.invoke(req);
    assert.equal(f.response.code, 403);
    assert(
      f.calls.every((c) => c[0] === 'verify'),
      'unauthorized request reached privileged data operations'
    );
  });
}
test('rejects other methods before authentication', async () => {
  const f = fixture();
  await f.invoke({ method: 'GET', query: {}, headers: {} });
  assert.equal(f.response.code, 405);
  assert.equal(f.calls.length, 0);
});
for (const authorization of ['jwt', 'Bearer jwt'])
  test(`owner cleanup with ${authorization}`, async () => {
    const f = fixture();
    await f.invoke({ method: 'DELETE', query: { host_id: 'host-a' }, headers: { authorization } });
    assert.equal(f.response.code, 204);
    assert.equal(f.response.finished, 1);
    assert.deepEqual(f.calls, [
      ['verify', 'jwt'],
      ['select', 'events', 'host_id', 'host-a'],
      ['photos', 'events', ['avatars/event-a/v1']],
      ['delete', 'contributions', 'event_id', 'event-a'],
      ['delete', 'guests', 'event_id', 'event-a'],
      ['delete', 'page_visits', 'event_id', 'event-a'],
      ['delete', 'events', 'event_id', 'event-a'],
      ['photos', 'hosts', ['avatars/host-a/v1']],
      ['delete', 'hosts', 'host_id', 'host-a'],
      ['auth-delete', 'host-a'],
    ]);
  });
for (const failure of ['select', 'storage', 'contributions', 'hosts'])
  test(`stops before auth deletion after ${failure} failure`, async () => {
    const f = fixture({ failure });
    await f.invoke({
      method: 'DELETE',
      query: { host_id: 'host-a' },
      headers: { authorization: 'jwt' },
    });
    assert.equal(f.response.code, 409);
    assert.equal(f.response.finished, 1);
    assert(!f.calls.some((c) => c[0] === 'auth-delete'));
  });
