import { count } from 'console';
import supabase from '../lib/supabase';

export async function getEvents(user_id: string) {
  return await supabase.from('events').select('*, hosts (*)').eq('host_id', user_id);
}
export async function getEvent(url_code: string) {
  return await supabase
    .from('events')
    .select('*, hosts (*)')
    .eq('url_code', url_code)
    // .eq('url_string', url_string.toLowerCase())  // omit for now
    .single();
}
export async function getEventViewCount(event_id: string) {
  return await supabase
    .from('page_visits')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event_id);
}

export async function getContributions(event_id: string) {
  return await supabase
    .from('contributions')
    .select('*, guests( * )')
    .eq('event_id', event_id)
    .order('created_at', { ascending: true });
}
export async function getContribution(event_id: string) {
  return await supabase
    .from('contributions')
    .select('*, guests( * )')
    .eq('event_id', event_id)
    .order('created_at', { ascending: true })
    .single();
}
