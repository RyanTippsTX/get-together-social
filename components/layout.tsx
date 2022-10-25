import Head from 'next/head';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { useAppLoading } from '../lib/appLoading';
import { AppLoadingIndicator, AppLoadingSplash } from './AppLoading';

export const siteTitle = 'GetTogether.social';
const description = 'Host your next party or private event with GetTogether.social';
const siteUrl = 'https://gettogether.social';
const favicon =
  'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥳</text></svg>';

export default function Layout({
  children,
  homePage,
  eventPage,
  metaTags,
}: {
  children: React.ReactNode | React.ReactNode[];
  homePage?: boolean;
  eventPage?: boolean;
  metaTags?: {
    pageTitle?: string;
    pageDescription?: string;
    photoUrl?: string;
    pageUrl?: string;
  };
}) {
  const { appLoading, setAppLoading } = useAppLoading();

  return (
    <>
      <Head>
        <title>{metaTags?.pageTitle || siteTitle}</title>
        <meta name="description" content={metaTags?.pageDescription || description} />
        {/* Open Graph protocol: https://ogp.me/#types */}
        <meta name="og:title" content={metaTags?.pageTitle || siteTitle} />
        <meta name="og:type" content="website" />
        <meta name="og:image" content={metaTags?.photoUrl || favicon} />
        <meta name="og:url" content={metaTags?.pageUrl || siteUrl} />

        <meta name="og:description" content={metaTags?.pageDescription || description} />
        <meta name="og:site_name" content={siteTitle} />

        {/* <link rel="icon" href="/favicon.ico" /> */}
        {/* Trick to use an emoji as favicon: */}
        <link rel="icon" href={favicon} />
        <link rel="apple-touch-icon" href={favicon} />
      </Head>
      <header className="sticky top-0 z-40">
        <Navbar {...{ eventPage }} />
      </header>
      {/* <main className={'xs:min-h-[45rem] min-h-[35rem] bg-white'}> */}
      <main
        className={'xs:min-h-[45rem] min-h-[35rem] bg-white'}
        // className={`xs:min-h-[45rem] min-h-[35rem] ${
        //   eventPage || homePage ? 'bg-white' : 'bg-zinc-50'
        // }`}
      >
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
