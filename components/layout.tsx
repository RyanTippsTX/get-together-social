import Head from 'next/head';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { useAppLoading } from '../lib/appLoading';
import { useProfile } from '../lib/profile';
import { AppLoadingSplash } from './AppLoading';

export const siteTitle = 'GetTogether.social';
export default function Layout({
  children,
  homePage,
  eventPage,
  metaTags,
}: {
  children: React.ReactNode;
  homePage?: boolean;
  eventPage?: boolean;
  metaTags?: { pageTitle?: string; pageDescription?: string; photoUrl?: string; pageUrl?: string };
}) {
  const { appLoading } = useAppLoading();
  const { error: profileError, retry: retryProfile } = useProfile();
  return (
    <>
      <Head>
        <title>{metaTags?.pageTitle || siteTitle}</title>
        <meta
          name="description"
          content={
            metaTags?.pageDescription ||
            'Good plans. Great company. A simple way to bring your people together.'
          }
        />
        <meta property="og:title" content={metaTags?.pageTitle || siteTitle} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={metaTags?.photoUrl || 'https://gettogether.social/gathering.jpg'}
        />
        <meta property="og:url" content={metaTags?.pageUrl || 'https://gettogether.social'} />
        <meta
          property="og:description"
          content={
            metaTags?.pageDescription ||
            'Plan a get-together, share the details, and see who’s bringing what.'
          }
        />
        <meta property="og:site_name" content={siteTitle} />
        <link rel="icon" href="/sun.svg" type="image/svg+xml" />
      </Head>
      <a
        href="#main"
        className="focus:bg-lemon sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:p-4"
      >
        Skip to content
      </a>
      <header className="border-ink/15 bg-cream relative z-40 border-b">
        <Navbar eventPage={eventPage} />
      </header>
      <main id="main" className={`site-width min-h-[65vh] ${homePage ? '' : 'py-10 sm:py-14'}`}>
        {profileError && (
          <div
            role="alert"
            className="card mb-6 flex flex-wrap items-center justify-between gap-3 p-5"
          >
            <p>{profileError}</p>
            <button className="btn btn-sm" onClick={retryProfile}>
              Try again
            </button>
          </div>
        )}
        {children}
      </main>
      {appLoading && <AppLoadingSplash />}
      <Footer />
    </>
  );
}
