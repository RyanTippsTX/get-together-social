import { Host, Event, Guest, Contribution, Contributions } from '../models/models.types';
import { OptionsButton } from './OptionsButton';

// assume that contributions_enabled when this component is called to render
export function ContributionsComponent({
  contributions_frozen,
  contributions_custom_title,
  contributions,
}: {
  contributions_frozen: boolean;
  contributions_custom_title: string | null;
  contributions: Contributions | undefined;
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
      {/* <h2>Contributions:</h2> */}
      <ContributionsTable contributions_frozen {...{ contributions, contributions_custom_title }} />
      {/* <pre>{JSON.stringify(contributions, null, 2)}</pre> */}
    </div>
  );
}

function ContributionsTable({
  contributions_frozen,
  contributions_custom_title,
  contributions,
}: {
  contributions_frozen: boolean;
  contributions_custom_title: string | null;
  contributions: Contributions | undefined;
}) {
  return (
    <div className="flex flex-col items-center pb-6">
      <table className="table w-auto ">
        <thead>
          <tr>
            <th>{contributions_custom_title || 'Contribtutons'}</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {contributions?.map((contribution) => (
            <ContributionsTableRow {...{ contribution }} key={contribution.contribution_id} />
          ))}
          <tr>
            <td>
              <input className="input-sm border"></input>
              <div className="btn btn-primary">Add Entry</div>
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ContributionsTableRow({ contribution }: { contribution: Contribution }) {
  const {
    contribution_id,
    created_at,
    event_id,
    description,
    requested,
    contributor_id,
    claimed_comment,
    guests: { guest_id, display_name },
  } = contribution;

  const claimButton = <div className="btn btn-primary">claim</div>;

  return (
    <tr>
      <td>
        {(requested ? 'Requested: ' : '') +
          description +
          (claimed_comment ? ` - ${claimed_comment}` : '')}
      </td>
      <td>{display_name}</td>
      <td>{requested && !contributor_id ? claimButton : <OptionsButton />}</td>
    </tr>
  );
}
