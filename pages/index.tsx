import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
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

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://gettogether.social">GetTogether.social</a>
        </h1>

        {/* <p className={styles.description}>
          {
            'Create a sharable landing page for you next party or private event with GetTogether.social'
          }
        </p> */}

        <p className={styles.constructionWorker}>{'👷🏻‍♂️'}</p>
        <p className={styles.underConstruction}>{"⚠️ We're currently under construction! ⚠️"}</p>

        <div className={styles.grid}>
          <a href="https://github.com/RyanTippsTX/get-together-social" className={styles.card}>
            <h2>Source Code &rarr;</h2>
            <p>Check out our progress on GitHub.</p>
          </a>
        </div>
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
};

export default Home;
