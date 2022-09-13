import Link from 'next/link';

// list paths you want to show up in the Site Map in the site-wide footer
// currently, some paths included in SiteMap for dev convience only
const pagePaths = new Map<string, string>([
  ['/', 'Home'],
  ['/about', 'About'],
  ['/login', 'Host Login'],
  ['/dashboard', 'Dashboard'],
  ['/stats', 'Site Statistics'],
  ['/new', 'Create New Event Landing Page'], // omit in productin
  ['/1234567', 'Sample Event Landing Page'], // omit in production
]);

const navElements: React.ReactElement[] = [];
pagePaths.forEach((title, path) => {
  navElements.push(
    <div key={path}>
      <Link href={path}>
        <a className="link link-hover">{title}</a>
      </Link>
    </div>
  );
});

export default function SiteMap() {
  return (
    <div className="footer text-pink-lemonade bg-zinc-800 p-10">
      <div className="container mx-auto">
        <span className="footer-title">Site Map</span>
        {navElements}
      </div>
      {/* <div>
        <span className="footer-title">Legal</span>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </div> */}
    </div>
  );
}
