import Link from 'next/link';
import Layout from '../components/layout';
import { Flourish } from '../components/Icons';
export default function About() {
  return (
    <Layout>
      <div className="mx-auto max-w-2xl py-5 sm:py-10">
        <p className="eyebrow">The idea is simple</p>
        <Flourish />
        <h1 className="page-title">
          More time together.
          <br />
          Less back-and-forth.
        </h1>
        <div className="text-muted mt-8 space-y-6 text-lg leading-8">
          <p>
            Good things happen when people get together. Planning it shouldn’t take an endless group
            chat.
          </p>
          <p>
            GetTogether.social gives your gathering a place of its own. Share the details, let
            everyone know what to bring, and keep the whole group on the same page.
          </p>
          <p className="text-base">
            Created by Ryan Tipps. Built with Next.js, Supabase, and Tailwind. You can explore the
            project on{' '}
            <a
              className="link"
              href="https://github.com/RyanTippsTX/get-together-social"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>{' '}
            or connect with Ryan on{' '}
            <a
              className="link"
              href="https://www.linkedin.com/in/ryantipps/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            .
          </p>
        </div>
        <Link href="/login" className="btn mt-8">
          Plan your next get-together
        </Link>
      </div>
    </Layout>
  );
}
