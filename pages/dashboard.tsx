import Layout from '../components/layout';

export default function About() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      <p>
        * logged-in user status (top right) / sign-out button
        <br />
        * list active event pages, sort by event date
        <br />
        * For each, have buttons for:
        <br />* Copy link
        <br />* Delete page (with warning)
        <br />* Enable / disable potluck (existing data will be saved if you wish to restore potluck
        to this event in future) * Create new event page button
      </p>
    </Layout>
  );
}
