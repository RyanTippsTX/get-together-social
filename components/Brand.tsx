import Link from 'next/link';
import { Sun } from './Icons';
export function Brand() {
  return (
    <Link
      href="/"
      className="font-display inline-flex shrink-0 items-center gap-2 text-lg font-black tracking-[-0.05em] sm:gap-3 sm:text-2xl"
      aria-label="GetTogether.social home"
    >
      <Sun className="h-8 w-8 shrink-0 text-[#e9b900] sm:h-10 sm:w-10" />
      <span>
        GetTogether<span className="font-semibold">.social</span>
      </span>
    </Link>
  );
}
