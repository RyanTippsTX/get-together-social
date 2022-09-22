import { Children } from 'react';
import Layout from '../components/layout';
import supabase from '../lib/supabase';

// export async function getServerSideProps() {
//   const { data: hosts, error } = await supabase.from('hosts').select('*');
//   const { data: events } = await supabase.from('events').select('*');
//   const { data: guests } = await supabase.from('guests').select('*');
//   const { data: contributions } = await supabase.from('contributions').select('*');

//   // other calls here !

//   return {
//     props: {
//       hosts,
//       events,
//       guests,
//       contributions,
//     },
//   };
// }

export default function Stats(props: any) {
  return (
    <Layout>
      <div className="xs:min-h-[45rem] flex min-h-[35rem] flex-col items-center gap-6">
        <h1 className="pt-20 text-center text-4xl font-bold tracking-tight text-zinc-700 ">
          Site Statistics <br /> (placeholder -- not real)
        </h1>
        {/* <StatCard /> */}
        <StatCardCombo />
      </div>
    </Layout>
  );
}

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
function StatCardCombo() {
  const StatItem = ({
    children,
    title,
    value,
    description,
  }: {
    children: React.ReactNode | React.ReactNode[] | null;
    title: string | null;
    value: string | null;
    description: string | null;
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

  return (
    <div className="stats sm:stats-horizontal stats-vertical shadow">
      <StatItem title={'Downloads'} value={'31K'} description={'Jan 1st - Feb 1st'}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-8 w-8 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </StatItem>

      <StatItem title={'Downloads'} value={'31K'} description={'Jan 1st - Feb 1st'}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-8 w-8 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          ></path>
        </svg>
      </StatItem>

      <StatItem title={'Downloads'} value={'31K'} description={'Jan 1st - Feb 1st'}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-8 w-8 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          ></path>
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
