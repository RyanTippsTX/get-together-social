import { Database } from '../lib/database.types';
// import supabase from '../lib/supabase';
// import { getEvent, getContribution, getContributions } from './models';

export type Host = Database['public']['Tables']['hosts']['Row'];
export type Event = Database['public']['Tables']['events']['Row'] & {
  hosts: Host;
};

export type Guest = Database['public']['Tables']['guests']['Row'];
export type Contribution = Database['public']['Tables']['contributions']['Row'] & {
  guests: Guest;
};
export type Contributions = Contribution[];

// type Contributions = Database['public']['Tables']['contributions']['Row'][];

// type ContributionsResponse = Awaited<ReturnType<typeof getContributions>>;
// type ContributionsResponseSuccess = ContributionsResponse['data'];
// type MoviesResponseError = ContributionsResponse['error'];
// type Contributions = ContributionsResponseSuccess;

// type Contribution = Database['public']['Tables']['contributions']['Row'] & {
//   contributor_id: Guest;
// };
// type Contributions = Contribution[];

// type ContributionsResponse = Awaited<ReturnType<typeof getContributions>>;
// type Contributions = ContributionsResponse['data'] & {
//   contributor_id: Guest;
// };

// type ContributionResponse = Awaited<ReturnType<typeof getContribution>>;
// type Contribution = ContributionResponse['data'];
