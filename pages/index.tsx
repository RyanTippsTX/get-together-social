import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/layout';
import { Flourish, Icon } from '../components/Icons';

export default function Home() {
  return (
    <Layout
      homePage
      metaTags={{
        pageTitle: 'Good company. Less hassle. | GetTogether.social',
        pageDescription:
          'Share event details and coordinate who’s bringing what. Guests just enter their name—no account or app download required.',
        pageUrl: 'https://gettogether.social',
      }}
    >
      <section className="grid items-center gap-10 py-12 md:grid-cols-2 md:gap-12 md:py-20">
        <div>
          <p className="eyebrow">Event planning. Without the guest signup.</p>
          <Flourish />
          <h1 className="font-display text-[2.5rem] font-black leading-[1.04] tracking-[-0.05em] sm:text-6xl md:text-[2.75rem] lg:text-6xl">
            Good company.
            <br />
            Less hassle.
          </h1>
          <p className="text-muted mt-6 max-w-md text-lg leading-relaxed">
            Share the details and coordinate who’s bringing what. Guests just enter their name—no
            account or app download required.
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
      <section className="border-ink/15 border-t py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="eyebrow">For the “just send me a link” crowd</p>
            <h2 className="max-w-md text-3xl leading-tight sm:text-4xl">
              Bringing a dish shouldn’t require an onboarding workflow.
            </h2>
            <p className="text-muted mt-5 max-w-md leading-7">
              From game-day snacks to backyard barbecues, make it easy for everyone to pitch in. All
              the simplicity of a shared doc, on a page made for your gathering.
            </p>
          </div>
          <ul className="space-y-6">
            {[
              [
                'The details, all together.',
                'Your photo, time, place, and plan on one easy-to-read event page.',
              ],
              [
                'A clear list of who’s bringing what.',
                'Ask for what you need. Guests claim a spot or add a dish of their own.',
              ],
              [
                'Everyone sees the same plan.',
                'Contributions update live, so guests can see what’s covered and what’s still needed.',
              ],
            ].map(([title, copy]) => (
              <li key={title} className="flex gap-4">
                <span className="badge-ghost mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <Icon name="check" />
                </span>
                <div>
                  <h3 className="text-lg">{title}</h3>
                  <p className="text-muted mt-1 text-sm leading-7">{copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="border-ink/15 border-t py-10 md:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl">From “you’re invited” to “I’ll bring brownies.”</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            [
              '01',
              'You make the page.',
              'Sign in as the host, add the details, and list what you need. Give it a cover photo to make it yours.',
            ],
            [
              '02',
              'You send the link.',
              'Drop it in the group chat, a text, or an email. Guests can open the page right in their browser.',
            ],
            [
              '03',
              'They bring something.',
              'Guests enter their name and claim an item or add their own. That’s it. No registration between them and the brownies.',
            ],
          ].map(([number, title, copy]) => (
            <div key={number}>
              <span className="text-sm font-bold text-[#886b00]">{number} /</span>
              <h3 className="mt-3 text-xl">{title}</h3>
              <p className="text-muted mt-2 max-w-sm text-sm leading-7">{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="card mb-12 p-6 sm:p-8 md:mb-16">
        <div className="grid gap-8 md:grid-cols-[1fr_1.3fr] md:gap-12">
          <div>
            <p className="eyebrow">Simple by design</p>
            <h2 className="text-3xl">Built for people you know.</h2>
            <Link href="/20270214/super-bowl-sunday" className="btn btn-outline mt-6">
              Try it as a guest <Icon name="arrow" />
            </Link>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg">Do guests really just need a name?</h3>
              <p className="text-muted mt-2 text-sm leading-7">
                Yes. No email, password, or account to create. If they come back later, they can
                select their name from the guest list to update what they’re bringing.
              </p>
            </div>
            <div>
              <h3 className="text-lg">How does guest access work?</h3>
              <p className="text-muted mt-2 text-sm leading-7">
                It’s the honor system: guest names aren’t verified, so someone else can select the
                same name. Event pages and contributions are public. Share only details you’re
                comfortable making public.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
