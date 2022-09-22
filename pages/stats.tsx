import Layout from '../components/layout';
import supabase from '../lib/supabase';

/* 
interesting stats: 
  number of hosts
  number of guests users
  number of interacticve users (hosts + guests), excludes guests that never log in
  number of events hosted
  total event page visits
  total site visits

frequency:
  this week (past 7 days)
  all time
*/

type Stats = {
  hostCount: number;
  guestCount: number;
  eventCount: number;
  visitCount: number;
};

export async function getServerSideProps() {
  /*
  Fetch these statistics:
    number of interacticve users (hosts + guests) (excludes read-only guests that never log in)
    number of events hosted
    total event page visits
  */
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

  const props = {
    hostCount,
    guestCount,
    eventCount,
    visitCount,
  };

  for (const property in props) {
    if (!property) throw Error;
  }

  return {
    props,
  };
}

export default function Stats(props: Stats) {
  return (
    <Layout>
      <div className="xs:min-h-[45rem] mx-2 flex min-h-[35rem] flex-col items-center gap-6">
        <h1 className="pt-16 text-center text-5xl font-bold tracking-tight text-zinc-700 ">
          Site Statistics
        </h1>
        <h2 className="text-center text-xl  tracking-tight text-zinc-700 ">
          {/* GetTogether.social launched on September X, 2022 */}
          GetTogether.social is in pre-launch.
          <br /> Beta testers are welcome!
        </h2>
        <StatCardCombo stats={props} />
      </div>
    </Layout>
  );
}

function StatCardCombo({ stats }: { stats: Stats }) {
  const { hostCount, guestCount, eventCount, visitCount } = stats;

  return (
    <div className="stats sm:stats-horizontal stats-vertical mb-8 shadow">
      <StatItem
        title={'Active Users'}
        value={hostCount + guestCount}
        description={'Hosts and Guests'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          className="inline-block h-8 w-8 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </StatItem>

      <StatItem title={'Events Hosted'} value={eventCount} description={'Landing Pages Created'}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          className="inline-block h-8 w-8 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
          />
        </svg>
      </StatItem>

      <StatItem title={'Event Page Views'} value={visitCount} description={'To date'}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          className="inline-block h-8 w-8 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
          />
        </svg>
      </StatItem>

      {/* <div className="stat">
        <div className="stat-title">New Users</div>
        <div className="stat-value">4,200</div>
        <div className="stat-desc">↗︎ 400 (22%)</div>
      </div>

      <div className="stat">
        <div className="stat-title">New Registers</div>
        <div className="stat-value">1,200</div>
        <div className="stat-desc">↘︎ 90 (14%)</div>
      </div> */}
    </div>
  );
}

const StatItem = ({
  children,
  title,
  value,
  description,
}: {
  children: React.ReactNode | React.ReactNode[] | null;
  title: React.ReactNode | string | null;
  value: React.ReactNode | string | null;
  description: React.ReactNode | string | null;
}) => {
  return (
    <div className="stat">
      <div className="stat-figure text-pink-500">{children}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-desc">{description}</div>
    </div>
  );
};

// Single Stat Card, not used:
// function StatCard() {
//   return (
//     <div className="stats shadow">
//       <div className="stat">
//         <div className="stat-title">Total Page Views</div>
//         <div className="stat-value">89,400</div>
//         <div className="stat-desc">21% more than last month</div>
//       </div>
//     </div>
// //   );
// }
