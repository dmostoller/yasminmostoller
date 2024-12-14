import { ButtonHTMLAttributes, FC } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

type SecondaryButtonProps = {
  text: string;
  icon?: LucideIcon;
  className?: string;
  href?: string;
  type?: 'button' | 'submit';
} & (
  | { href: string; onClick?: () => void }
  | { href?: never; onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'] }
);

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  text,
  icon: Icon,
  className = '',
  href,
  onClick,
  type = 'button',
}) => {
  const baseClasses = `
    group inline-flex items-center justify-center px-2 py-2 text-sm rounded-lg 
    relative bg-gradient-to-t from-violet-600 via-blue-500 to-teal-400
    text-teal-500 hover:text-white
    before:absolute before:inset-[2px] before:bg-[var(--background)] before:rounded-lg before:z-[0]
    hover:before:bg-gradient-to-t hover:before:from-violet-600 hover:before:via-blue-500 hover:before:to-teal-400
    transition-colors
  `;

  const contentClasses = 'relative z-[1] flex items-center';
  const combinedClasses = `${baseClasses} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClasses} onClick={onClick}>
        <span className={contentClasses}>
          {Icon && <Icon className="mr-2 h-5 w-5" />}
          {text}
        </span>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClasses}>
      <span className={contentClasses}>
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        {text}
      </span>
    </button>
  );
};
