import Head from 'next/head';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { useAppLoading } from '../lib/appLoading';
import { AppLoadingIndicator, AppLoadingSplash } from './AppLoading';

export const siteTitle = 'GetTogether.social';
const siteAuthor = 'Ryan Tipps';

export default function Layout({
  children,
  eventPage,
}: {
  children: React.ReactNode | React.ReactNode[];
  eventPage?: boolean;
}) {
  const { appLoading, setAppLoading } = useAppLoading();
  return (
    <>
      <Head>
        <title>GetTogether.social</title>
        <meta
          name="description"
          content="Create a sharable landing page for you next party or private event with GetTogether.social"
        />
        <meta name="author" content={siteAuthor} />
        <meta name="og:title" content={siteTitle} />
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
        {/* Trick to use an emoji as favicon: */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥳</text></svg>"
        />
      </Head>
      <header className="sticky top-0 z-40">
        <Navbar {...{ eventPage }} />
      </header>
      <main className="xs:min-h-[45rem] min-h-[35rem] bg-zinc-50">
        <div className="container mx-auto">{appLoading ? <AppLoadingSplash /> : children}</div>
        {/* {sessionLoading || profileLoading ? (
          <Loading />
        ) : (
          <div className="container mx-auto">{children}</div>
        )} */}
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
