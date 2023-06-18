import Link from 'next/link';
import { Brand } from './Brand';

// list paths you want to show up in the Site Map in the site-wide footer
// currently, some paths included in SiteMap for dev convience only
const sitePaths = new Map<string, string>([
  ['Home', '/'],
  ['Demo', '/1234567/Dunder-Mifflin-Christmas-Party'], // omit in production
  ['About', '/about'],
  ['Statistics', '/stats'],
]);
const hostPaths = new Map<string, string>([
  ['Host Login', '/login'],
  ['My Events', '/my-events'],
  ['New Event', '/new'], // omit in productin
]);
const legalPaths = new Map<string, string>([
  ['Terms of use', '/legal/'],
  ['Privacy policy', '/legal/'],
  ['Cookie policy', '/legal/'],
]);

const Links = ({ routes }: { routes: Map<string, string> }) => {
  const navElements: React.ReactElement[] = [];
  routes.forEach((path, title) => {
    navElements.push(
      <div key={title}>
        <Link href={path}>
          <a className="link link-hover">{title}</a>
        </Link>
      </div>
    );
  });
  return <>{navElements}</>;
};

const company = (
  <div className="place-items-center sm:place-items-start">
    <Brand />
    <p>Copyright © 2023 - All rights reserved</p>
  </div>
);

export function Footer() {
  return (
    <div className="bg-dark text-zinc-300">
      <div className="container mx-auto">
        <div className=" flex flex-col-reverse gap-10 py-10 px-6 sm:flex-row ">
          <div className="footer place-items-center sm:place-items-start ">{company}</div>

          <div className="grid min-w-max  grid-cols-3 place-content-between gap-4  text-sm leading-7 sm:place-content-center">
            <div className="min-w-max">
              <span className="footer-title">Site</span>
              <Links routes={sitePaths} />
            </div>
            <div className="min-w-max">
              <span className="footer-title">Hosts</span>
              <Links routes={hostPaths} />
            </div>
            <div className="min-w-max">
              <span className="footer-title">Legal</span>
              <Links routes={legalPaths} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
