import supabase from '../lib/supabase';
import { Inputs } from './forms.types';
import { Event } from '../lib/queries.types';

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

// export async function updateEvent({ event }: { event: Event }) {
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
  return await supabase.from('events').delete().match({ event_id });
}
export async function hardDeleteEvent(event_id: string) {
  // Actually deletes event data
  // Must delete associated data first (contributions, guests, etc)
  return await supabase.from('events').delete().match({ event_id });
}

export async function getEvents(user_id: string) {
  return await supabase.from('events').select('*, hosts (*)').eq('host_id', user_id);
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
