import Link from 'next/link';

// list paths you want to show up in the Site Map in the site-wide footer
// currently, some paths included in SiteMap for dev convience only
const pagePaths = new Map<string, string>([
  ['/', 'Home'],
  ['/about', 'About'],
  ['/dashboard', 'Host Dashboard'], // consider renaming?
  ['/new', 'Create New Event Landing Page'], // omit in productin
  ['/1234567', 'Sample Event Landing Page'], // omit in production
]);

const navElements: React.ReactElement[] = [];
pagePaths.forEach((title, path) => {
  navElements.push(
    <div>
      <Link href={path}>
        <a>{title}</a>
      </Link>
    </div>
  );
});

export default function SiteMap() {
  return (
    <nav>
      Site Map:
      {navElements}
    </nav>
  );
}
