import Layout from '../../components/layout';
import { Flourish } from '../../components/Icons';

export default function Legal() {
  return (
    <Layout
      metaTags={{
        pageTitle: 'Terms, privacy & cookies | GetTogether.social',
        pageDescription:
          'How GetTogether.social works, what information is shared, and your choices.',
        pageUrl: 'https://gettogether.social/legal',
      }}
    >
      <article className="mx-auto max-w-3xl py-5 sm:py-10">
        <header>
          <p className="eyebrow">The details</p>
          <Flourish />
          <h1 className="page-title">Terms, privacy &amp; cookies.</h1>
          <p className="text-muted mt-6 max-w-2xl text-lg leading-8">
            GetTogether.social is a small project by Ryan Tipps that helps people plan events and
            coordinate what to bring. Here’s what to expect when you use it.
          </p>
          <p className="text-muted mt-4 text-sm">
            Last updated <time dateTime="2026-10-18">October 18, 2026</time>
          </p>
          <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-3">
            {[
              ['Terms', 'terms'],
              ['Privacy', 'privacy'],
              ['Cookies', 'cookies'],
              ['Contact', 'contact'],
            ].map(([label, id]) => (
              <a key={id} href={`#${id}`} className="btn btn-outline btn-sm">
                {label}
              </a>
            ))}
          </nav>
        </header>

        <div className="mt-12 space-y-10 text-base leading-7">
          <section
            id="terms"
            aria-labelledby="terms-title"
            className="border-ink/15 scroll-mt-8 border-t pt-8"
          >
            <h2 id="terms-title" className="mb-5 text-3xl">
              Terms of use
            </h2>
            <div className="text-muted space-y-4">
              <p>
                Use the service lawfully and respectfully. Don’t post harmful or unlawful content,
                impersonate others, send spam, or try to access or disrupt someone else’s account.
                Only share content and photos you have permission to use.
              </p>
              <p>
                You keep ownership of your content. By posting it, you allow us to store and display
                it as needed to provide the service. Hosts and guests are responsible for their
                event details, contributions, and arrangements; GetTogether.social does not organize
                or supervise the gatherings.
              </p>
              <p>
                The service is provided as available, without a promise of uninterrupted access or
                error-free operation. Features may change, and content or access may be removed to
                address misuse. Keep a separate copy of important plans. Nothing on this page limits
                rights that cannot be waived under applicable law.
              </p>
            </div>
          </section>

          <section
            id="privacy"
            aria-labelledby="privacy-title"
            className="border-ink/15 scroll-mt-8 border-t pt-8"
          >
            <h2 id="privacy-title" className="mb-5 text-3xl">
              Privacy
            </h2>
            <div className="text-muted space-y-5">
              <div>
                <h3 className="text-ink mb-2 font-sans text-lg font-bold">Information we use</h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Host account information, such as your email address, display name, profile
                    photo, and sign-in identifiers.
                  </li>
                  <li>
                    Details you submit, including event dates and locations, descriptions, photos,
                    guest names, and contributions.
                  </li>
                  <li>
                    Basic event-visit records, including the event, visit time, and whether the
                    visitor is signed in as its host. Our infrastructure providers may also process
                    IP addresses, device information, and technical logs.
                  </li>
                </ul>
                <p className="mt-4">
                  We use this information to run the app, sign hosts in, show event updates, respond
                  to requests, troubleshoot problems, and understand usage. Host sign-in email
                  addresses are not displayed on event pages.
                </p>
              </div>
              <div className="border-ink/15 bg-cream rounded-2xl border p-5 sm:p-6">
                <h3 className="text-ink mb-2 font-sans text-lg font-bold">What’s public</h3>
                <p>
                  Event details and locations, host names and photos, guest names, and contributions
                  are public information. They can be accessed beyond the people you invite. Share
                  only information you’re comfortable making public.
                </p>
                <p className="mt-3">
                  Guest access uses a name, without verifying who is behind it. Someone else can
                  select the same name and manage those shared guest contributions.
                </p>
              </div>
              <div>
                <h3 className="text-ink mb-2 font-sans text-lg font-bold">
                  Services that help the app run
                </h3>
                <p>
                  We use{' '}
                  <a className="link" href="https://vercel.com/legal/privacy-notice">
                    Vercel
                  </a>{' '}
                  for hosting and{' '}
                  <a className="link" href="https://supabase.com/privacy">
                    Supabase
                  </a>{' '}
                  for accounts, data, photos, and live updates. They process information needed to
                  provide those services. If you choose Google sign-in, Google also processes your
                  sign-in under{' '}
                  <a className="link" href="https://policies.google.com/privacy">
                    its privacy policy
                  </a>
                  .
                </p>
              </div>
              <div>
                <h3 className="text-ink mb-2 font-sans text-lg font-bold">
                  Your choices and data removal
                </h3>
                <p>
                  Hosts can edit their profile and events. Guests can edit their display name or use
                  “Delete my guest contributions” in the guest menu.
                </p>
                <p className="mt-3">
                  Deleting an event hides its page and removes its uploaded photos, but retains
                  event records, guest entries, and contributions for statistics. Those retained
                  records can still be publicly accessible. Deleting a host account removes that
                  account and its hosted events, associated entries, and uploaded files from the
                  active service. Provider logs, backups, and copies other people have saved may
                  remain.
                </p>
                <p className="mt-3">
                  For help with access, corrections, or removal, use the{' '}
                  <a className="link" href="#contact">
                    contact information below
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          <section
            id="cookies"
            aria-labelledby="cookies-title"
            className="border-ink/15 scroll-mt-8 border-t pt-8"
          >
            <h2 id="cookies-title" className="mb-5 text-3xl">
              Cookies &amp; browser storage
            </h2>
            <div className="text-muted space-y-4">
              <p>
                The app uses your browser’s local storage to remember a host’s sign-in session. This
                is browser storage rather than a cookie. Guest selections are held temporarily while
                you use the page.
              </p>
              <p>
                We don’t add advertising cookies or cross-site marketing trackers to the app.
                Hosting and sign-in providers may use cookies or similar technology for security and
                authentication; their own websites have separate policies.
              </p>
              <p>
                You can sign out and clear cookies and site data in your browser settings. Blocking
                or clearing storage may sign you out or stop sign-in from working. Clearing browser
                data does not delete events or other information stored by the service.
              </p>
            </div>
          </section>

          <section
            id="contact"
            aria-labelledby="contact-title"
            className="border-ink/15 scroll-mt-8 border-t pt-8"
          >
            <h2 id="contact-title" className="mb-5 text-3xl">
              Questions or requests?
            </h2>
            <div className="text-muted space-y-4">
              <p>
                Contact{' '}
                <a className="link" href="https://www.linkedin.com/in/ryantipps/">
                  Ryan Tipps on LinkedIn
                </a>{' '}
                about this page or your information. Use a private message for personal requests and
                include the relevant event link. Never send passwords or sign-in links.
              </p>
              <p>
                We may update this page as the service changes. The date at the top shows when it
                was last revised.
              </p>
            </div>
          </section>
        </div>
      </article>
    </Layout>
  );
}
