import User from './User';
import Head from 'next/head';
import Link from 'next/link';
import SiteMap from './SiteMap';

const siteTitle = 'GetTogether.social';
const siteAuthor = 'Ryan Tipps';

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode | React.ReactNode[];
  home?: boolean;
}) {
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
      <header className="bg-pink-lemonade">
        <User />
        <h2>
          <Link href="/">
            <a className="font-extrabold">{siteTitle}</a>
          </Link>
        </h2>
      </header>
      <main className="bg-slate-100">{children}</main>
      <footer className="bg-pink-lemonade">
        <SiteMap />
      </footer>
    </>
  );
}
