import { ButtonHTMLAttributes, FC } from 'react';
import Link from 'next/link';
import { LucideIcon, Loader } from 'lucide-react';
import { useState } from 'react';
import { Popover, PopoverPosition } from '@/components/Popover';

type PrimaryIconButtonProps = {
  icon: LucideIcon;
  className?: string;
  href?: string;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  popoverPosition?: PopoverPosition;
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
  label,
  popoverPosition = 'center',
}) => {
  const [showLabel, setShowLabel] = useState(false);

  const baseClasses =
    'p-2 rounded-full group inline-flex items-center justify-center bg-gradient-to-t from-violet-600 via-blue-500 to-teal-400 text-white hover:from-violet-700 hover:via-blue-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm';
  const combinedClasses = `${baseClasses} ${className}`.trim();

  const ButtonContent = (
    <div className="relative">
      {isLoading ? <Loader className="h-6 w-6 animate-spin" /> : <Icon className="h-6 w-6" />}
      {showLabel && label && <Popover label={label} position={popoverPosition} />}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={combinedClasses}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
      >
        {ButtonContent}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={combinedClasses}
      disabled={isLoading || disabled}
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
    >
      {ButtonContent}
    </button>
  );
};
