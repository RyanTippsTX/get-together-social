import supabase from '../lib/supabase';
import { ProfileInputs, Inputs } from './forms.types';
import { Event } from '../lib/queries.types';

// ---------- HOST PROFILE ----------

export async function createHostProfile({
  display_name,
  // avatar_url,
  host_id,
}: ProfileInputs & { host_id: string }) {
  const { error } = await supabase.from('hosts').insert([
    {
      display_name,
      // avatar_url,
      host_id,
    },
  ]);
  return { error };
}
export async function updateHostDisplayName({
  display_name,
  host_id,
}: {
  display_name: string;
  host_id: string;
}) {
  const { error } = await supabase
    .from('hosts')
    .update({
      display_name,
    })
    .match({ host_id });
  return { error };
}

// ---------- EVENTS ----------

// Returns a random integer from 0 to 9,999,999:
function generateUrlCode() {
  return Math.floor(Math.random() * 10 ** 7);
}

// one-way encoding, optimized for human readability:
function readableUrlEncodeTitle(title: string) {
  return title
    .replace(/[^a-zA-Z\d\s:]/g, '') // alphanumeric only
    .trim() // remove whitespace from beginning or end, often leftover from removal of leading / trailing emoji
    .split(/\s{1,}/g) // condense white space
    .join('-') // hyphen delineated
    .toLowerCase(); // lowercase
}

export async function createEvent({
  title,
  date,
  time,
  location,
  description,
  contributions_enabled,
  contributions_frozen,
  contributions_custom_title_enabled,
  contributions_custom_title,
  host_id,
}: Inputs & { host_id: string }) {
  // do some data processing stuff

  const url_code = generateUrlCode(); // random 7 digit
  const url_string = readableUrlEncodeTitle(title); // one-way, human-readable encoding
  const route = '/' + url_code + '/' + url_string;

  const { error } = await supabase.from('events').insert([
    // ECMA specifies that undefined shorthand values will not be passed as properties at all (e.g. if 'time' is undefined, it will not return an undefined property, it will simply not return a property at all)
    {
      // event_id, // uuid generated by postgres
      // created_at, // generated by postgres
      host_id,
      title,
      date,
      time,
      location,
      // photo_url,
      description,
      contributions_enabled,
      contributions_frozen,
      contributions_custom_title,
      url_code,
      url_string,
    },
  ]);
  return { route, error };
}

export async function updateEvent({
  title,
  date,
  time,
  location,
  description,
  contributions_enabled,
  contributions_frozen,
  contributions_custom_title_enabled,
  contributions_custom_title,
  event_id,
  url_code,
}: Inputs & { event_id: string; url_code: string }) {
  // const {
  //   event_id,
  //   created_at,
  //   host_id,
  //   title,
  //   date,
  //   time,
  //   location,
  //   photo_url,
  //   description,
  //   contributions_enabled,
  //   contributions_frozen,
  //   contributions_custom_title,
  //   url_code,
  //   url_string,
  // } = event;

  const url_string = readableUrlEncodeTitle(title); // one-way, human-readable encoding
  const route = '/' + url_code + '/' + url_string;

  const { error } = await supabase
    .from('events')
    .update({
      title,
      date,
      time,
      location,
      // photo_url,
      description,
      contributions_enabled,
      contributions_frozen,
      contributions_custom_title,
      url_string,
    })
    .match({ event_id });

  return { route, error };
}

export async function softDeleteEvent(event_id: string) {
  // doesnt actually delete the data. Just marks the event "deleted" and makes it inaccessible to users. Useful for future analytics.
  // return await supabase.from('events').delete().match({ event_id });
}
export async function hardDeleteEvent(event_id: string) {
  // Actually deletes event data
  // Must delete associated data first (contributions, guests, etc)
  // return await supabase.from('events').delete().match({ event_id });
}

export async function getEvents(user_id: string) {
  return await supabase
    .from('events')
    .select('*, hosts (*)')
    .eq('host_id', user_id)
    .order('date', { ascending: true });
}
export async function getEvent(lookupKey: { url_code: string } | { event_id: string }) {
  if ('event_id' in lookupKey) {
    const { event_id } = lookupKey;
    return await supabase.from('events').select('*, hosts (*)').match({ event_id }).single();
  }

  const { url_code } = lookupKey;
  return await supabase
    .from('events')
    .select('*, hosts (*)')
    // .match({ url_code, url_string })
    .match({ url_code })
    .single();
}
export async function getEventViewCount(event_id: string) {
  return await supabase
    .from('page_visits')
    .select('*', { count: 'exact', head: true })
    .match({ event_id });
}

// ---------- GUESTS ----------

export async function getGuestList(event_id: string) {
  return await supabase
    .from('guests')
    .select('display_name, guest_id')
    .match({ event_id })
    .order('display_name', { ascending: true });
}
export async function createGuest({
  event_id,
  display_name,
}: {
  event_id: string;
  display_name: string;
}) {
  return await supabase
    .from('guests')
    .insert({
      event_id,
      display_name,
    })
    .select()
    .single();
}
export async function updateGuest({
  guest_id,
  display_name,
}: {
  guest_id: string;
  display_name: string;
}) {
  return await supabase
    .from('guests')
    .update({
      display_name,
    })
    .match({ guest_id });
}
export async function safeDeleteGuestAndContributions(guest_id: string) {
  await Promise.all([
    // unclaim requests
    supabase
      .from('contributions')
      .update({
        claimed_comment: null,
        contributor_id: null,
      })
      .match({ contributor_id: guest_id, requested: true }),

    // delete contributions
    supabase.from('contributions').delete().match({ contributor_id: guest_id, requested: false }),
  ]).then((values) => {
    console.log(values);
  });

  // then delete account
  await supabase.from('guests').delete().match({ guest_id });
  return;
}

// ---------- CONTRIBUTIONS ----------

export async function getContributions(event_id: string) {
  return await supabase
    .from('contributions')
    .select('*, guests( * )')
    .match({ event_id })
    .order('created_at', { ascending: true });
}
export async function getContribution(event_id: string) {
  return await supabase
    .from('contributions')
    .select('*, guests( * )')
    .match({ event_id })
    .order('created_at', { ascending: true })
    .single();
}

// - - - - - as guest - - - - -
export async function createGuestContribution({
  event_id,
  description,
  guest_id,
}: {
  event_id: string;
  description: string;
  guest_id: string;
}) {
  return await supabase.from('contributions').insert([
    {
      event_id,
      description,
      requested: false,
      contributor_id: guest_id,
      claimed_comment: null,
    },
  ]);
}
export async function claimRequestAsGuest({
  contribution_id,
  claimed_comment,
  guest_id,
}: {
  contribution_id: string;
  claimed_comment: string | null;
  guest_id: string;
}) {
  return await supabase
    .from('contributions')
    .update({
      claimed_comment,
      contributor_id: guest_id,
    })
    .match({ contribution_id });
}
export async function unclaimRequest(contribution_id: string) {
  return await supabase
    .from('contributions')
    .update({
      contributor_id: null,
    })
    .match({ contribution_id });
}
export async function updateClaimedAsDescription(contribution_id: string) {
  // overwrites the 'claimed-as' description field
  // do stuff
}

// - - - - - as host - - - - -
export async function createHostContribution({
  event_id,
  description,
}: {
  event_id: string;
  description: string;
}) {
  return await supabase.from('contributions').insert([
    {
      event_id,
      description,
      requested: false,
      contributor_id: null,
      claimed_comment: null,
    },
  ]);
}
export async function createRequest({
  event_id,
  description,
}: {
  event_id: string;
  description: string;
}) {
  // do stuff
  return await supabase.from('contributions').insert([
    {
      event_id,
      description,
      requested: true,
      contributor_id: null,
      claimed_comment: null,
    },
  ]);
}
export async function convertRequestToHostContribution({
  contribution_id,
}: {
  contribution_id: string;
}) {
  // aka when a host claims his/her own request
  return await supabase
    .from('contributions')
    .update({
      claimed_comment: null,
      contributor_id: null,
      requested: false,
    })
    .match({ contribution_id });
}
export async function convertHostContributionToRequest(contribution_id: string) {
  // must be a host contribution
  return await supabase
    .from('contributions')
    .update({
      claimed_comment: null,
      contributor_id: null,
      requested: true,
    })
    .match({ contribution_id });
}
// - - - - - shared - - - - -
export async function updateDescription(contribution_id: string) {
  // do stuff
}

export async function deleteContribution(contribution_id: string) {
  // same function for guest contribution, host contribution, & requests
  return await supabase.from('contributions').delete().match({ contribution_id });
}
