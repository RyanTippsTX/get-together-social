import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/layout';
import { Flourish, Icon } from '../components/Icons';

export default function Home() {
  return (
    <Layout homePage>
      <section className="grid items-center gap-10 py-12 md:grid-cols-2 md:gap-12 md:py-20">
        <div>
          <p className="eyebrow">Less coordinating. More connecting.</p>
          <Flourish />
          <h1 className="font-display text-5xl font-black leading-[1.04] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            Good plans.
            <br />
            Great company.
          </h1>
          <p className="text-muted mt-6 max-w-md text-lg leading-relaxed">
            Your people, one simple plan. Bring everyone together with an event page that keeps the
            details—and who’s bringing what—in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="btn">
              Plan a get-together <Icon name="arrow" />
            </Link>
            <Link href="/1234567/Dunder-Mifflin-Christmas-Party" className="btn btn-outline">
              Take a look around
            </Link>
          </div>
          <p className="text-muted mt-4 text-xs">
            Free to host. Easy to join. No guest accounts needed.
          </p>
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
                <p className="text-muted text-xs">A little preview of the plan</p>
                <p className="font-display mt-1 text-xl font-extrabold">Sunday potluck</p>
              </div>
              <span className="bg-butter rounded-full p-3">
                <Icon name="calendar" />
              </span>
            </div>
            <div className="border-ink/10 mt-4 flex items-center justify-between border-t pt-4 text-sm">
              <span>Something sweet</span>
              <span className="badge badge-ghost">
                <Icon name="check" className="h-3 w-3" /> Alex is bringing it
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="border-ink/15 mb-8 border-t pt-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl">A good time starts here.</h2>
          <p className="text-muted text-sm">From the first invite to the last slice.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            [
              '01',
              'Make a little plan.',
              'Add the when, where, and whatever your guests should know. Make it yours with a cover photo.',
            ],
            [
              '02',
              'Bring your people.',
              'Share your event link in a text, an email, or wherever the group gets together.',
            ],
            [
              '03',
              'Everyone chips in.',
              'Request what you need. Guests claim an item or add their own, and everyone sees updates live.',
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
    </Layout>
  );
}
