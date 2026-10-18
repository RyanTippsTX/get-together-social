import Layout from '../components/layout';
import supabase from '../lib/supabase';

type Stats = {
  hostCount: number | null;
  guestCount: number | null;
  eventCount: number | null;
  visitCount: number | null;
};
export async function getServerSideProps() {
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
  return { props: { hostCount, guestCount, eventCount, visitCount } };
}
export default function Statistics({ hostCount, guestCount, eventCount, visitCount }: Stats) {
  return (
    <Layout>
      <div className="page-heading">
        <p className="eyebrow">A growing circle</p>
        <h1 className="page-title">Good company, by the numbers.</h1>
        <p className="subheading">The gatherings and people that make GetTogether.social.</p>
      </div>
      <dl className="stats">
        {[
          [
            'Hosts & guests',
            hostCount === null || guestCount === null ? null : hostCount + guestCount,
          ],
          ['Events created', eventCount],
          ['Event page views', visitCount],
        ].map(([label, value]) => (
          <div className="stat" key={label}>
            <dt className="stat-title">{label}</dt>
            <dd className="stat-value">
              {value === null ? '—' : Number(value).toLocaleString('en-US')}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-muted mt-5 text-xs">All-time estimates, including past events.</p>
    </Layout>
  );
}
