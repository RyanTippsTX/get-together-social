import Link from 'next/link';
import { Brand } from './Brand';

// list paths you want to show up in the Site Map in the site-wide footer
// currently, some paths included in SiteMap for dev convience only
const sitePaths = new Map<string, string>([
  ['/', 'Home'],
  ['/about', 'About'],
  ['/stats', 'Site Statistics'],
  ['/1234567/Dunder-Mifflin-Christmas-Party', 'Sample Event'], // omit in production
]);
const hostPaths = new Map<string, string>([
  ['/login', 'Host Login'],
  ['/dashboard', 'Dashboard'],
  ['/new', 'New Event'], // omit in productin
]);
const legalPaths = new Map<string, string>([
  ['/legal/terms', 'Terms of use'],
  ['/legal/privacy', 'Privacy policy'],
  ['/legal/cookies', 'Cookie policy'],
]);

const Links = ({ routes }: { routes: Map<string, string> }) => {
  const navElements: React.ReactElement[] = [];
  routes.forEach((title, path) => {
    navElements.push(
      <div key={path}>
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
    <p>Copyright © 2022 - All right reserved</p>
  </div>
);

export function Footer() {
  return (
    <div className="bg-dark text-zinc-300">
      <div className="container mx-auto">
        <div className=" flex flex-col-reverse gap-10 p-10 sm:flex-row  ">
          <div className="footer place-items-center sm:place-items-start ">{company}</div>

          <div className=" grid grid-flow-col place-content-evenly gap-10 text-sm leading-7 sm:place-content-center">
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
