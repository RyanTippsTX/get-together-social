import { SVGProps } from 'react';

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & {
  name:
    | 'calendar'
    | 'clock'
    | 'pin'
    | 'arrow'
    | 'plus'
    | 'check'
    | 'more'
    | 'copy'
    | 'user'
    | 'close';
}) {
  const paths = {
    calendar:
      'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    clock: 'M12 8v4l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    arrow: 'M4 12h16m-6-6 6 6-6 6',
    plus: 'M12 5v14M5 12h14',
    check: 'm5 12 4 4L19 6',
    more: 'M5 12h.01M12 12h.01M19 12h.01',
    copy: 'M9 9h12v12H9ZM15 9V3H3v12h6',
    user: 'M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    close: 'm6 6 12 12M6 18 18 6',
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === 'more' ? 3 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function Sun({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="38"
      height="38"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="8" fill="currentColor" />
      <path
        d="M20 2v6m0 24v6M2 20h6m24 0h6M7.3 7.3l4.2 4.2m17 17 4.2 4.2m0-25.4-4.2 4.2m-17 17-4.2 4.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Flourish() {
  return (
    <svg
      width="102"
      height="30"
      viewBox="0 0 102 30"
      fill="none"
      className="mb-4 text-[#c99c00]"
      aria-hidden="true"
    >
      <path
        d="M2 25C25 4 55-3 60 7c4 8-16 20-9 15s27-15 27-6-8 7 22 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
