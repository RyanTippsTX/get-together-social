import Layout from '../components/layout';
import supabase from '../lib/supabase';

export async function getServerSideProps() {
  const { data: hosts, error } = await supabase.from('hosts').select('*');
  const { data: events } = await supabase.from('events').select('*');
  const { data: guests } = await supabase.from('guests').select('*');
  const { data: contributions } = await supabase.from('contributions').select('*');

  // other calls here !

  return {
    props: {
      hosts,
      events,
      guests,
      contributions,
    },
  };
}

export default function Stats(props: any) {
  return (
    <Layout>
      <h1 className="text-3xl font-bold">Stats</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </Layout>
  );
}
