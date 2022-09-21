import Link from 'next/link';
import { siteTitle } from './layout'; // GetTogether.social
export function Brand() {
  return (
    <Link href="/">
      <a className="text-xl font-bold tracking-tight">{siteTitle}</a>
    </Link>
  );
}
