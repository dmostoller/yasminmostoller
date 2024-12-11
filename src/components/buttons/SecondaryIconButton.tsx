import { ButtonHTMLAttributes, FC } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Popover, PopoverPosition } from '@/components/Popover';

type SecondaryIconButtonProps = {
  icon: LucideIcon;
  className?: string;
  href?: string;
  label?: string;
  popoverPosition?: PopoverPosition;
  disabled?: boolean;
} & (
  | { href: string; onClick?: () => void }
  | { href?: never; onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'] }
);

export const SecondaryIconButton: FC<SecondaryIconButtonProps> = ({
  icon: Icon,
  className = '',
  href,
  onClick,
  label,
  disabled,
  popoverPosition = 'center',
}) => {
  const [showLabel, setShowLabel] = useState(false);

  const baseClasses = `
    p-2 text-xl rounded-full relative
    bg-gradient-to-t from-violet-600 via-blue-500 to-teal-400
    text-teal-500 ${!disabled && 'hover:text-white'}
    before:absolute before:inset-[2px] before:bg-[var(--background)] before:rounded-full before:z-[0]
    ${!disabled && 'hover:before:bg-gradient-to-t hover:before:from-violet-600 hover:before:via-blue-500 hover:before:to-teal-400'}
    transition-colors
    ${disabled && 'opacity-50 cursor-not-allowed'}
  `;

  const contentClasses = 'relative z-[1] flex items-center';
  const combinedClasses = `${baseClasses} ${className}`.trim();

  const ButtonContent = (
    <div className="relative">
      <span className={contentClasses}>
        <Icon className="h-6 w-6" />
      </span>
      {showLabel && label && <Popover label={label} position={popoverPosition} />}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={combinedClasses}
        onClick={onClick}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        {ButtonContent}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={combinedClasses}
      disabled={disabled}
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
    >
      {ButtonContent}
    </button>
  );
};
