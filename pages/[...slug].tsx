import { useRouter } from 'next/router';
import Layout from '../components/layout';

export default function EventPage() {
  const router = useRouter();
  const { slug }: { slug?: string[] } = router.query;

  if (!slug) return; // shouldn't ever happen because of file based routing

  const [eventID, eventDescription] = slug;

  return (
    <Layout>
      <h1 className="text-3xl font-bold">Custom Landing Page</h1>
      <p>Event ID: {eventID}</p>
      <p>Event Description: {eventDescription}</p>
    </Layout>
  );
}
