import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

type PrimaryButtonProps = {
  text?: string;
  icon?: LucideIcon;
  className?: string;
  href?: string;
  type?: 'button' | 'submit';
  isLoading?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  showTextOnHover?: boolean;
  hoverText?: string;
} & (
  | { href: string; onClick?: never }
  | { href?: never; onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'] }
);

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  text,
  icon: Icon,
  className = '',
  href,
  onClick,
  type = 'button',
  isLoading = false,
  children,
  disabled = false,
  showTextOnHover = false,
  hoverText,
}) => {
  const baseClasses =
    'group inline-flex items-center justify-center bg-gradient-to-t from-violet-600 via-blue-500 to-teal-400 px-4 py-2 text-white hover:from-violet-700 hover:via-blue-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm';
  const combinedClasses = `${baseClasses} ${className}`.trim();

  const defaultContent = (
    <>
      {Icon && <Icon className="mr-2 h-5 w-5" />}
      {text}
    </>
  );

  const hoverContent = showTextOnHover ? (
    <>
      <span className="block group-hover:hidden">{Icon && <Icon className="h-5 w-5" />}</span>
      <span className="hidden group-hover:block">{hoverText || text}</span>
    </>
  ) : (
    defaultContent
  );

  const content = children ?? hoverContent;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClasses} disabled={isLoading || disabled}>
      {content}
    </button>
  );
};
