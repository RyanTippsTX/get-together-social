import { PGlite } from '@electric-sql/pglite';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const db = new PGlite();
const sql = (name) => readFile(new URL(name, import.meta.url), 'utf8');
await db.exec(await sql('./schema.sql'));
await db.exec(await sql('../migrations/20261018_host_ownership_rls.sql'));
const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const A=id(1), B=id(2), E=id(10), F=id(11), D=id(12), X=id(13), EB=id(14);
const G=id(20), G2=id(21), GB=id(22), GF=id(23), GD=id(24);
const H=id(30), R=id(31), C=id(32), I=id(33), RF=id(34), RD=id(35);
const fixtureSQL = `
INSERT INTO auth.users(id) VALUES ('${A}'), ('${B}');
INSERT INTO hosts(host_id,display_name) VALUES ('${A}','Host A'),('${B}','Host B');
INSERT INTO events(event_id,host_id,title,date,url_code,url_string,contributions_enabled,contributions_frozen,deleted_by_host) VALUES
('${E}','${A}','Open','2026-10-25',9000000,'open',true,false,false),
('${F}','${A}','Frozen','2026-10-25',9000001,'frozen',true,true,false),
('${D}','${A}','Disabled','2026-10-25',9000002,'disabled',false,false,false),
('${X}','${A}','Deleted','2026-10-25',9000003,'deleted',true,false,true),
('${EB}','${B}','Other host','2026-10-25',9000004,'other',true,false,false);
INSERT INTO guests(guest_id,event_id,display_name) VALUES
('${G}','${E}','Guest'),('${G2}','${E}','Second guest'),('${GB}','${EB}','Other event guest'),('${GF}','${F}','Frozen guest'),('${GD}','${D}','Disabled guest');
INSERT INTO contributions(contribution_id,event_id,description,requested,contributor_id) VALUES
('${H}','${E}','Host lemonade',false,null),('${R}','${E}','Salad request',true,null),
('${C}','${E}','Claimed request',true,'${G}'),('${I}','${E}','Guest cookies',false,'${G}'),
('${RF}','${F}','Frozen request',true,null),('${RD}','${D}','Disabled request',true,'${GD}');
INSERT INTO page_visits(event_id,user_is_host) VALUES ('${E}',false);
INSERT INTO testing(content) VALUES ('private test content');
INSERT INTO storage.objects(bucket_id,name) VALUES
('hosts','avatars/${A}/v1'),('events','avatars/${E}/v1'),('events','avatars/${EB}/v1');
`;
await db.exec(fixtureSQL);
let count=0;
const cases=[];
async function check(name, role, uid, query, expected=1) {
  cases.push({name,role,uid,query,expected});
  await db.exec('BEGIN');
  try {
    await db.exec(`SET LOCAL ROLE ${role}`);
    await db.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [uid || '']);
    let result;
    try { result = await db.query(query); }
    catch (error) {
      if (expected !== 'deny' || error.code !== '42501') throw error;
      result = null;
    }
    if (expected === 'deny') {
      if (result) {
        assert.match(query, /^(SELECT|UPDATE|DELETE) /, 'operation should raise insufficient_privilege');
        assert.equal(result.rows.length, 0, 'unauthorized operation exposed or affected rows');
      }
    } else {
      assert.equal(result.rows.length, expected);
    }
    console.log(`PASS ${++count}: ${name}`);
  } catch (error) {
    throw new Error(`${name}: ${error.message}`, {cause:error});
  } finally { await db.exec('ROLLBACK'); }
}
const update = (table, set, where) => `UPDATE ${table} SET ${set} WHERE ${where} RETURNING *`;
const del = (table, where) => `DELETE FROM ${table} WHERE ${where} RETURNING *`;
for (const [role,uid,label] of [['anon',null,'anonymous'],['authenticated',B,'other host']]) {
  for (const table of ['hosts','events','guests','contributions','page_visits'])
    await check(`${label} public ${table} reads`,role,uid,`SELECT * FROM ${table} LIMIT 1`);
  await check(`${label} cannot edit host`,role,uid,update('hosts',"display_name='Intruder'",`host_id='${A}'`),'deny');
  await check(`${label} cannot edit event`,role,uid,update('events',"title='Intruder'",`event_id='${E}'`),'deny');
  await check(`${label} cannot soft-delete event`,role,uid,update('events','deleted_by_host=true',`event_id='${E}'`),'deny');
  await check(`${label} cannot forge event owner`,role,uid,`INSERT INTO events(host_id,title,date,url_code,url_string) VALUES ('${A}','Forged','2026-10-25',9000010,'forged') RETURNING *`,'deny');
  await check(`${label} cannot forge profile`,role,uid,`INSERT INTO hosts(host_id) VALUES ('${id(3)}') RETURNING *`,'deny');
  await check(`${label} cannot rewrite host item`,role,uid,update('contributions',"description='Tampered'",`contribution_id='${H}'`),'deny');
  await check(`${label} cannot remove host item`,role,uid,del('contributions',`contribution_id='${H}'`),'deny');
  await check(`${label} cannot remove request`,role,uid,del('contributions',`contribution_id='${R}'`),'deny');
  await check(`${label} cannot rewrite request`,role,uid,update('contributions',"description='Tampered'",`contribution_id='${R}'`),'deny');
  await check(`${label} cannot create request`,role,uid,`INSERT INTO contributions(event_id,description,requested) VALUES ('${E}','Forged request',true) RETURNING *`,'deny');
  await check(`${label} cannot create host item`,role,uid,`INSERT INTO contributions(event_id,description) VALUES ('${E}','Forged host item') RETURNING *`,'deny');
  await check(`${label} cannot forge visit host flag`,role,uid,`INSERT INTO page_visits(event_id,user_is_host) VALUES ('${E}',true) RETURNING *`,'deny');
  await check(`${label} cannot edit analytics`,role,uid,update('page_visits','user_is_host=true',`event_id='${E}'`),'deny');
  await check(`${label} cannot delete analytics`,role,uid,del('page_visits',`event_id='${E}'`),'deny');
  await check(`${label} cannot read unused testing`,role,uid,'SELECT * FROM testing','deny');
  await check(`${label} cannot truncate`,role,uid,'TRUNCATE testing','deny');
  await check(`${label} cannot upload someone else's event photo`,role,uid,`INSERT INTO storage.objects(bucket_id,name) VALUES ('events','avatars/${E}/v2') RETURNING *`,'deny');
  await check(`${label} cannot overwrite someone else's event photo`,role,uid,update('storage.objects',"name='tampered'",`bucket_id='events' AND name='avatars/${E}/v1'`),'deny');
  await check(`${label} cannot delete someone else's profile photo`,role,uid,del('storage.objects',`bucket_id='hosts' AND name='avatars/${A}/v1'`),'deny');
}
await check('host updates own profile','authenticated',A,update('hosts',"display_name='Updated'",`host_id='${A}'`));
await check('host creates own event','authenticated',A,`INSERT INTO events(host_id,title,date,url_code,url_string) VALUES ('${A}','New','2026-10-25',9000010,'new') RETURNING *`);
await check('host edits own event','authenticated',A,update('events',"title='Updated'",`event_id='${E}'`));
await check('host soft-deletes own event','authenticated',A,update('events','deleted_by_host=true',`event_id='${E}'`));
await check('host cannot transfer ownership','authenticated',A,update('events',`host_id='${B}'`,`event_id='${E}'`),'deny');
await check('host cannot change event ID','authenticated',A,update('events',`event_id='${id(99)}'`,`event_id='${E}'`),'deny');
await check('host creates request even when frozen','authenticated',A,`INSERT INTO contributions(event_id,description,requested) VALUES ('${F}','New request',true) RETURNING *`);
await check('host claims request','authenticated',A,update('contributions','requested=false',`contribution_id='${R}'`));
await check('host converts own contribution to request','authenticated',A,update('contributions','requested=true',`contribution_id='${H}'`));
await check('host deletes request','authenticated',A,del('contributions',`contribution_id='${R}'`));
await check('host uploads event photo','authenticated',A,`INSERT INTO storage.objects(bucket_id,name) VALUES ('events','avatars/${E}/v2') RETURNING *`);
await check('host uploads profile photo','authenticated',A,`INSERT INTO storage.objects(bucket_id,name) VALUES ('hosts','avatars/${A}/v2') RETURNING *`);
await check('host lists own photo','authenticated',A,`SELECT * FROM storage.objects WHERE bucket_id='events' AND name='avatars/${E}/v1'`);
await check('host cannot move photo into another event','authenticated',A,update('storage.objects',`name='avatars/${EB}/v2'`,`bucket_id='events' AND name='avatars/${E}/v1'`),'deny');
await check('host removes own photo','authenticated',A,del('storage.objects',`bucket_id='events' AND name='avatars/${E}/v1'`));
await check('host visit recorded','authenticated',A,`INSERT INTO page_visits(event_id,user_is_host) VALUES ('${E}',true) RETURNING *`);
await check('guest joins active event','anon',null,`INSERT INTO guests(event_id,display_name) VALUES ('${E}','New guest') RETURNING *`);
await check('guest cannot join deleted event','anon',null,`INSERT INTO guests(event_id,display_name) VALUES ('${X}','New guest') RETURNING *`,'deny');
await check('guest can change shared display name','anon',null,update('guests',"display_name='Updated guest'",`guest_id='${G}'`));
await check('guest cannot move identity to another event','anon',null,update('guests',`event_id='${EB}'`,`guest_id='${G}'`),'deny');
await check('guest cannot change identity UUID','anon',null,update('guests',`guest_id='${id(99)}'`,`guest_id='${G}'`),'deny');
await check('guest adds contribution','anon',null,`INSERT INTO contributions(event_id,description,contributor_id) VALUES ('${E}','Bread','${G}') RETURNING *`);
await check('guest cannot add item while frozen','anon',null,`INSERT INTO contributions(event_id,description,contributor_id) VALUES ('${F}','Bread','${GF}') RETURNING *`,'deny');
await check('guest cannot add item while disabled','anon',null,`INSERT INTO contributions(event_id,description,contributor_id) VALUES ('${D}','Bread','${GD}') RETURNING *`,'deny');
await check('guest cannot attach another event guest','anon',null,`INSERT INTO contributions(event_id,description,contributor_id) VALUES ('${E}','Bread','${GB}') RETURNING *`,'deny');
await check('guest claims request','anon',null,update('contributions',`contributor_id='${G}'`,`contribution_id='${R}'`));
await check('guest claims frozen request','anon',null,update('contributions',`contributor_id='${GF}'`,`contribution_id='${RF}'`));
await check('guest cannot claim using another event identity','anon',null,update('contributions',`contributor_id='${GB}'`,`contribution_id='${R}'`),'deny');
await check('guest cannot overwrite an existing claim','anon',null,update('contributions',`contributor_id='${G2}'`,`contribution_id='${C}'`),'deny');
await check('guest unclaims requested item','anon',null,update('contributions','contributor_id=null,claimed_comment=null',`contribution_id='${C}'`));
await check('guest can unclaim hidden section during account cleanup','anon',null,update('contributions','contributor_id=null,claimed_comment=null',`contribution_id='${RD}'`));
await check('guest cannot claim in disabled section','anon',null,update('contributions',`contributor_id='${GD}'`,`contribution_id='${RD}'`),'deny');
await check('guest cannot turn request into personal item','anon',null,update('contributions',`requested=false,contributor_id='${G}'`,`contribution_id='${R}'`),'deny');
await check('guest cannot move contribution','anon',null,update('contributions',`event_id='${EB}',contributor_id='${GB}'`,`contribution_id='${I}'`),'deny');
await check('guest cannot forge host contribution from guest item','anon',null,update('contributions','contributor_id=null',`contribution_id='${I}'`),'deny');
await check('guest removes shared guest contribution','anon',null,del('contributions',`contribution_id='${I}'`));
await check('anonymous visit recorded','anon',null,`INSERT INTO page_visits(event_id,user_is_host) VALUES ('${E}',false) RETURNING *`);
await check('no analytics on deleted event','anon',null,`INSERT INTO page_visits(event_id,user_is_host) VALUES ('${X}',false) RETURNING *`,'deny');
await check('storage ignores malformed event folder','authenticated',A,`INSERT INTO storage.objects(bucket_id,name) VALUES ('events','avatars/not-a-uuid/v1') RETURNING *`,'deny');
await check('storage ignores wrong prefix','authenticated',A,`INSERT INTO storage.objects(bucket_id,name) VALUES ('events','other/${E}/v1') RETURNING *`,'deny');
assert.equal((await db.query("SELECT count(*)::int AS n FROM pg_class WHERE relnamespace='public'::regnamespace AND relkind='r' AND relrowsecurity")).rows[0].n,6);
console.log(`All ${count} role/operation checks passed; all 6 public tables have RLS enabled.`);
if (process.argv.includes('--write-rehearsal')) {
  const quote = value => "'" + String(value).replaceAll("'", "''") + "'";
  const migration = (await sql('../migrations/20261018_host_ownership_rls.sql')).replace(/^BEGIN;$/m, '').replace(/^COMMIT;$/m, '');
  let rehearsal = `-- ROLLBACK-ONLY rehearsal: synthetic records, no committed changes.\nBEGIN;\n${migration}\n${fixtureSQL}\n`;
  // Supabase protects storage deletion with an API-only guard.
  // Test those three cases through the Storage API, not by bypassing its guard.
  const liveCases = cases.filter(c => !/^DELETE FROM storage.objects /.test(c.query));
  for (const c of liveCases) {
    const assertion = /^TRUNCATE /.test(c.query)
      ? `ASSERT NOT has_table_privilege(current_user, 'public.testing', 'TRUNCATE'), ${quote(c.name)};`
      : c.expected === 'deny'
      ? `BEGIN EXECUTE ${quote(c.query)}; GET DIAGNOSTICS n = ROW_COUNT; ASSERT ${/^(SELECT|UPDATE|DELETE) /.test(c.query) ? 'n = 0' : 'false'}, ${quote(c.name)}; EXCEPTION WHEN insufficient_privilege THEN NULL; END;`
      : `EXECUTE ${quote(c.query)}; GET DIAGNOSTICS n = ROW_COUNT; ASSERT n = ${c.expected}, ${quote(c.name)};`;
    rehearsal += `SAVEPOINT test_case;\nSET LOCAL ROLE ${c.role};\nSELECT set_config('request.jwt.claim.sub', ${quote(c.uid || '')}, true);\nDO $test$ DECLARE n integer; BEGIN ${assertion} END $test$;\nRESET ROLE;\nROLLBACK TO SAVEPOINT test_case;\nRELEASE SAVEPOINT test_case;\n`;
  }
  rehearsal += `ROLLBACK;\nSELECT '${liveCases.length} RLS checks passed; rehearsal rolled back' AS result;\n`;
  await writeFile(new URL('./rehearsal.sql', import.meta.url), rehearsal);
}
await db.close();
