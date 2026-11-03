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
        </div>
        <div className="grid items-start gap-7 md:grid-cols-2 md:gap-x-10 md:gap-y-8">
          {[
            {
              name: 'Maya',
              occasion: 'The cookie swap',
              color: 'bg-[#eaded5] text-[#684737]',
              message: 'I just want to bring cookies. Why am I creating an account?',
            },
            {
              name: 'Ben',
              occasion: 'Mike’s birthday',
              color: 'bg-[#dce6ec] text-[#375363]',
              message: 'Another app? I’ll just text the host.',
            },
            {
              name: 'Jess',
              occasion: 'The Friendsgiving crew',
              color: 'bg-[#e9dfed] text-[#62436b]',
              message:
                'Four people brought mashed potatoes. Nobody wanted to create an account just to say what they were bringing.',
            },
            {
              name: 'Sam',
              occasion: 'Sunday’s cookout',
              color: 'bg-[#e1e8d6] text-[#485b37]',
              message: 'Can we please just use a spreadsheet?',
            },
          ].map(({ name, occasion, color, message }) => (
            <div key={name} className="flex min-w-0 items-start gap-3">
              <div
                aria-hidden="true"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${color}`}
              >
                {name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-sm font-bold">{name}</span>
                  <span className="text-muted text-xs">{occasion}</span>
                </p>
                <blockquote className="border-ink/10 bg-cream rounded-2xl rounded-tl-sm border px-5 py-4 text-base leading-7">
                  {message}
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section
        className="border-ink/15 mb-12 grid gap-8 border-t pt-10 md:mb-16 md:grid-cols-[1fr_2fr] md:gap-12 md:pt-14"
        aria-labelledby="faq-title"
      >
        <div>
          <p className="eyebrow">A few practical details</p>
          <h2 id="faq-title" className="text-3xl sm:text-4xl">
            FAQ
          </h2>
        </div>
        <div className="divide-ink/15 divide-y">
          {[
            [
              'Does anyone need an account?',
              'Only the host signs in to create and manage events. Guests just enter their name to add or claim something to bring.',
            ],
            [
              'How does name-only guest access work?',
              'It’s the honor system. Names aren’t verified, so someone else can select the same name. Event pages and contributions are semi-public—anyone with the event link has access.',
            ],
            [
              'Can guests change what they’re bringing?',
              'Yes. Returning guests choose the same name they used before to update their contributions.',
            ],
          ].map(([question, answer]) => (
            <div key={question} className="py-6 first:pt-0 last:pb-0">
              <h3 className="text-lg">{question}</h3>
              <p className="text-muted mt-2 text-sm leading-7">{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
