import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import supabase from '../lib/supabase';

export default function Dashboard() {
  // const { data: hosts, error } = await supabase.from('hosts').select('*');
  // const { data: events } = await supabase.from('events').select('*');
  // const { data: guests } = await supabase.from('guests').select('*');
  // const { data: contributions } = await supabase.from('contributions').select('*');

  const [data, setData] = useState(null);

  const asyncFetchDashboardData = async () => {
    const { data, error } = await supabase.from('hosts').select('*');
    setData(data);
    return;
  };

  useEffect(() => {
    asyncFetchDashboardData();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>loading...</p>}
    </Layout>
  );
}

// const getNotes = async () => {
//   const { data, error } = await supabase.from('notes').select('*');
//   return; // need to configure this properly
// };
// const postNote = async () => {
//   const { data, error } = await supabase.from('notes').insert([{ id: 41, content: 'hello' }]);
//   return; // need to configure this properly
// };
