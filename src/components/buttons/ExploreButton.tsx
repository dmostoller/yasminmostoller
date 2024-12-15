import Link from 'next/link';

export const ExploreButton = ({ text }: { text: string }) => (
  <Link
    href="/paintings"
    className="
      no-underline
      group inline-flex items-center justify-center px-2 py-2 text-md rounded-lg 
      relative bg-gradient-to-t from-violet-600 via-blue-500 to-teal-400
      text-teal-500 hover:text-white
      before:absolute before:inset-[2px] before:bg-[var(--background)] before:rounded-lg before:z-[0]
      hover:before:bg-gradient-to-t hover:before:from-violet-600 hover:before:via-blue-500 hover:before:to-teal-400
      transition-colors
    "
  >
    <span className="relative z-[1] flex items-center">{text}</span>
  </Link>
);
