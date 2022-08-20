import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
// import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>GetTogether.social</title>
        <meta
          name="description"
          content="Create a sharable landing page for you next party or private event with GetTogether.social"
        />
        <meta name="author" content="Ryan Tipps" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        {/* Trick to use an emoji as favicon: */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥳</text></svg>"
        />
      </Head>

      <main>
        <h1 className="text-3xl font-bold underline">Hello TailwindCSS!</h1>
      </main>
    </div>
  );
};

export default Home;
