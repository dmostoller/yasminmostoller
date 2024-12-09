import { ButtonHTMLAttributes, FC } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

type PrimaryIconButtonProps = {
  icon: LucideIcon;
  className?: string;
  href?: string;
  isLoading?: boolean;
  disabled?: boolean;
} & (
  | { href: string; onClick?: never }
  | { href?: never; onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'] }
);

export const PrimaryIconButton: FC<PrimaryIconButtonProps> = ({
  icon: Icon,
  className = '',
  href,
  onClick,
  isLoading = false,
  disabled = false,
}) => {
  const baseClasses =
    'p-2 rounded-full group inline-flex items-center justify-center bg-gradient-to-t from-violet-600 via-blue-500 to-teal-400 text-white hover:from-violet-700 hover:via-blue-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm';
  const combinedClasses = `${baseClasses} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        <Icon className="h-6 w-6" />
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses} disabled={isLoading || disabled}>
      <Icon className="h-6 w-6" />
    </button>
  );
};
