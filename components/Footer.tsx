import Link from 'next/link';
import { Brand } from './Brand';
export function Footer() {
  return (
    <footer className="border-ink/15 bg-cream mt-12 border-t">
      <div className="site-width grid gap-10 py-10 md:grid-cols-[1fr_auto] md:py-12">
        <div>
          <Brand />
          <p className="text-muted mt-3 text-sm">A little planning. A lot of good company.</p>
          <p className="text-muted mt-5 text-xs">© {new Date().getFullYear()} GetTogether.social</p>
        </div>
        <div className="grid grid-cols-3 gap-5 text-sm sm:gap-14">
          {[
            [
              'Explore',
              ['Home', '/'],
              ['Live demo', '/1234567/Dunder-Mifflin-Christmas-Party'],
              ['About', '/about'],
              ['Statistics', '/stats'],
            ],
            [
              'Hosting',
              ['Host login', '/login'],
              ['My events', '/my-events'],
              ['New event', '/new'],
            ],
            ['The details', ['Terms', '/legal'], ['Privacy', '/legal'], ['Cookies', '/legal']],
          ].map(([heading, ...links]) => (
            <nav key={heading as string} aria-label={heading as string}>
              <h2 className="text-muted mb-3 font-sans text-xs font-bold uppercase tracking-wider">
                {heading}
              </h2>
              <ul className="space-y-2">
                {(links as string[][]).map(([label, href]) => (
                  <li key={label}>
                    <Link className="link-hover" href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </footer>
  );
}
