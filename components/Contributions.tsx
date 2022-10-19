import { Host, Event, Guest, Contribution, Contributions } from '../lib/queries.types';
import { ContributionOptionsButton } from './ContributionOptionsButton';

// assume that contributions_enabled when this component is called to render
export function ContributionsComponent({
  contributions_frozen,
  contributions_custom_title,
  contributions,
  host,
}: {
  contributions_frozen: boolean;
  contributions_custom_title: string | null;
  contributions: Contributions | undefined;
  host: Host;
}) {
  // conditional rendering logic
  if (typeof contributions === undefined) {
    // contributions are still loading
    return <div>{'loading ...'}</div>;
  }
  if (typeof contributions === null) {
    // contributions are enabled but
    return <div>{'No contributions yet, please consider contributing!'}</div>;
  }

  return (
    <div>
      <ContributionsTable
        {...{ contributions_frozen, contributions, contributions_custom_title, host }}
      />
    </div>
  );
}

function ContributionsTable({
  contributions_frozen,
  contributions_custom_title,
  contributions,
  host,
}: {
  contributions_frozen: boolean;
  contributions_custom_title: string | null;
  contributions: Contributions | undefined;
  host: Host;
}) {
  function Tooltip() {
    const icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6 text-zinc-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
    );

    const popup = (
      <div
        className="text-md invisible absolute left-2/4 bottom-full mb-1
         w-40 -translate-x-2/4 
        items-center rounded
        bg-zinc-700 p-2 font-medium text-zinc-100 shadow hover:visible group-hover:visible"
      >
        <div className="">
          {/* <h2 className="font-bold ">To Participate:</h2> */}
          {'Log in as a Guest to participate'}
          {/* {contributions_custom_title || 'Contribtutons'} */}
        </div>
      </div>
    );
    return (
      <div className="group relative px-1">
        {icon}
        {popup}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pb-6 ">
      <div className="w-full py-2">
        <div className="mx-2 flex items-center gap-1 pb-1">
          <div className="text-dark text-xl font-bold">
            {contributions_custom_title || 'Contribtutons'}{' '}
          </div>
          <Tooltip />
        </div>
        <div>
          {contributions?.map((contribution, i) => (
            <ContributionsTableRow
              {...{ contribution, i, host }}
              key={contribution.contribution_id}
            />
          ))}
        </div>
        {<NewContributionForm {...{ contributions_frozen }} />}
      </div>
    </div>
  );
}

function ContributionsTableRow({
  i,
  contribution,
  host,
}: {
  i: number;
  contribution: Contribution;
  host: Host;
}) {
  const {
    contribution_id,
    created_at,
    event_id,
    description,
    requested,
    contributor_id,
    claimed_comment,
    guests: guest,
  } = contribution;
  // const { avatar_url, display_name } = host;

  // contributions will either be:
  // * Committed by the host   // request false, contributor null
  const committedByHost = !requested && !contributor_id;
  // * Committed by a guest   // request false, contributor 1234
  const committedByGuest = !requested && contributor_id;
  // * Requested by the host
  //     * Claimed by no one   // requested true, contributor null
  const requestUnclaimed = requested && !contributor_id;
  //     * Claimed by a guest   // request true, contributor 1234
  const requestClaimedByGuest = requested && contributor_id;
  //     * Claimed by N guests   // future feature, for now host will need to make multiple requests if wanting to do that
  //     * Claimed by the host.   // this is not a request, so convert

  const claimButton = (
    <div className="btn btn-sm gap-1">
      <p className="">Claim</p>
      <p className="text-2xl">🙋🏻</p>
      {/* <p className="block text-2xl">✋🏻</p> */}
    </div>
  );

  const item = (
    <div className="grow">
      {description}
      {requestUnclaimed && <span className="badge mx-1">Requested</span>}
      {requestClaimedByGuest &&
        (claimed_comment ? (
          <span className="badge badge-ghost mx-1">Claimed as:</span>
        ) : (
          <span className="badge badge-ghost mx-1">Claimed</span>
        ))}
      {claimed_comment}
    </div>
  );
  const contributor = (
    <div className="w-40 flex-none">
      {(committedByGuest || requestClaimedByGuest) && guest.display_name}
      {committedByHost && host.display_name}
    </div>
  );

  const actions = (
    <div className="flex-none">
      <div>{requested && !contributor_id ? claimButton : <ContributionOptionsButton />}</div>
    </div>
  );

  return (
    <div className="flex items-center border-t-[1px] border-zinc-200 bg-zinc-100 py-1 px-2 sm:mx-2">
      {item}
      {contributor}
      {actions}
    </div>
  );
}

function NewContributionForm({ contributions_frozen }: { contributions_frozen: boolean }) {
  //grey out form inputs if frozen
  return (
    <>
      {!contributions_frozen && (
        <div className="px-2">
          <div className=" flex w-full gap-2 pt-3">
            <input
              type="text"
              placeholder="Add an item..."
              className="input input-bordered w-full"
            />
            {/* <div className="btn btn-primary text-3xl">🕊</div> */}
            <div className="btn gap-2">
              <p className="text-lg">Submit</p>
              <p className="text-3xl">✍🏻</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
