import type { NextApiRequest, NextApiResponse } from 'next';
import type { Database } from '../../../lib/database.types';
import { createClient } from '@supabase/supabase-js';
import supabase from '../../../lib/supabase';
import { deleteEventFiles, deleteHostAvatar } from '../../../lib/storage';

// require environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw Error('Missing Supabase environment variable(s)');
}

// create Supabase-Server-Client with Service Role
const supabaseServerClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    // authenticate jwt
    const {
      data: { user },
    } = await supabase.auth.getUser(req.headers.authorization);
    if (!user) {
      res.status(403).send('Forbidden');
      return;
    }
    console.log('authenticated!');

    // authorize
    const { host_id } = req.query;
    if (user.id !== host_id) {
      res.status(403).send('Forbidden');
      return;
    }
    console.log('authorized!');

    // user is authenticated and authorized, now delete resources in order:
    console.log('deleteing');
    // 409 Conflict
    // delete events, guests, contributions

    const { data: events } = await supabase.from('events').select().match({ host_id });
    // console.log('events', events);
    if (events) {
      await Promise.all(
        events.map(async ({ event_id }) => {
          // delete event images
          deleteEventFiles(event_id);
          // delete contributions match event_id
          await supabase.from('contributions').delete().match({ event_id });
          // delete guests match event_id
          await supabase.from('guests').delete().match({ event_id });
          // delete page visits
          await supabase.from('page_visits').delete().match({ event_id });
          // delete event
          const { error } = await supabase.from('events').delete().match({ event_id });
          if (error) {
            console.log('error: ', error);
          }
        })
      );
    }
    // delete host avatar image
    {
      const { error } = await deleteHostAvatar(host_id);
      if (error) {
        console.log('profile image delete error: ', error);
      }
    }

    // delete host profile
    {
      const { error } = await supabase.from('hosts').delete().match({ host_id });
      if (error) {
        console.log('profile delete error: ', error);
      }
    }

    // delete user
    const { data, error } = await supabaseServerClient.auth.admin.deleteUser(host_id);
    if (error) {
      console.error(error);
      res.status(409).send('Conflict');
    }
    res.status(204).end();
  } else {
    // Handle any other HTTP method
    res.status(405).send('Method Not Allowed');
  }
};
export default handler;

// console.log('token: ', req.headers.authorization);
// const { data: users, error } = await supabase.auth.admin.listUsers();
