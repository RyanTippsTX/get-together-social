import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/layout';
import { Flourish, Icon } from '../components/Icons';

export default function Home() {
  return (
    <Layout
      homePage
      metaTags={{
        pageTitle: 'A party app without guest signup | GetTogether.social',
        pageDescription:
          'A party app where guests join with just their name. Share the event link. Guests say what they’re bringing. No downloads. No accounts.',
        pageUrl: 'https://gettogether.social',
      }}
    >
      <section className="grid items-center gap-10 py-12 md:grid-cols-2 md:gap-12 md:py-20">
        <div>
          <Flourish />
          <h1 className="font-display text-[2.5rem] font-black leading-[1.04] tracking-[-0.05em] sm:text-6xl md:text-[2.75rem] lg:text-6xl">
            A party app where guests join with just their name.
          </h1>
          <p className="text-muted mt-6 max-w-md text-lg leading-relaxed">
            Share the event link. Guests say what they’re bringing. No downloads. No accounts.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="btn">
              Create event <Icon name="arrow" />
            </Link>
            <Link href="/20270214/super-bowl-sunday" className="btn btn-outline">
              Try it as a guest
            </Link>
          </div>
          <p className="text-muted mt-4 text-xs">Free to use. Only the host needs to sign in.</p>
        </div>
        <div className="relative pb-14">
          <div className="relative aspect-[1/1.03] overflow-hidden rounded-[28px] rounded-t-[100px]">
            <Image
              src="/gathering.jpg"
              alt="A sunny backyard table set with salads, bread, lemonade, and yellow flowers"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="border-ink/15 bg-cream shadow-custom absolute bottom-0 left-4 right-4 rotate-[-2deg] rounded-2xl border p-5 sm:left-7 sm:right-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-xs">A name. A dish. You’re in.</p>
                <p className="font-display mt-1 text-xl font-extrabold">Backyard barbecue</p>
              </div>
              <span className="bg-butter rounded-full p-3">
                <Icon name="calendar" />
              </span>
            </div>
            <div className="border-ink/10 mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-sm">
              <span>Brownies</span>
              <span className="badge badge-ghost">
                <Icon name="check" className="h-3 w-3" /> Alex is bringing it
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="border-ink/15 border-t py-10 md:py-14" aria-labelledby="sound-familiar">
        <div className="mb-8">
          <h2 id="sound-familiar" className="text-3xl sm:text-4xl">
            Sound familiar?
          </h2>
          <p className="text-muted mt-3 text-sm">Imagined messages from the group chat.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            'I just want to bring cookies. Why am I creating an account?',
            'Another app? I’ll just text the host.',
            'We have three desserts and no plates.',
            'Can we please just use a spreadsheet?',
          ].map((quote) => (
            <blockquote key={quote} className="card rounded-bl-none p-6 text-lg leading-relaxed">
              “{quote}”
            </blockquote>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
          <h3 className="text-2xl sm:text-3xl">A link. A name. “I’ll bring brownies.”</h3>
          <Link href="/login" className="btn">
            Create event <Icon name="arrow" />
          </Link>
        </div>
      </section>
      <details className="border-ink/15 mb-12 border-t pt-6 md:mb-16">
        <summary className="text-muted w-fit text-sm font-semibold">
          How does name-only guest access work?
        </summary>
        <p className="text-muted mt-4 max-w-2xl text-sm leading-7">
          Guests use the honor system: names aren’t verified, so someone else can select the same
          name. Returning guests can choose their name again to update what they’re bringing. Event
          pages and contributions are public. Share only details you’re comfortable making public.
        </p>
      </details>
    </Layout>
  );
}
