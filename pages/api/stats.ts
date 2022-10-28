import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../lib/supabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // res.status(200).json({ name: 'John Doe' });

  const [
    { count: hostCount },
    { count: guestCount },
    { count: eventCount },
    { count: visitCount },
  ] = await Promise.all([
    supabase.from('hosts').select('*', { count: 'estimated', head: true }),
    supabase.from('guests').select('*', { count: 'estimated', head: true }),
    supabase.from('events').select('*', { count: 'estimated', head: true }),
    supabase.from('page_visits').select('*', { count: 'estimated', head: true }),
  ]);

  res.status(200).json({
    hostCount,
    guestCount,
    eventCount,
    visitCount,
  });
};
export default handler;
