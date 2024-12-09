'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { X as CloseIcon, LogIn, LogOut, User } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { MenuIcon } from './icons/Menu';
import { SecondaryIconButton } from './buttons/SecondaryIconButton';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/',
      redirect: true,
    });
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`
        relative px-4 py-2 mx-2 font-medium text-lg
        transition-all duration-300 ease-in-out
        rounded-md
        
        // Text styling with gradient on hover
        ${
          isActive
            ? 'bg-gradient-to-r from-violet-600 via-blue-500 to-teal-400 bg-clip-text text-transparent'
            : 'text-[var(--text-secondary)]'
        }
        hover:bg-gradient-to-r hover:from-violet-600 hover:via-blue-500 hover:to-teal-400
        hover:bg-clip-text hover:text-transparent
        
        // Underline effect
        after:content-['']
        after:absolute after:bottom-0 after:left-0
        after:w-full after:h-[2px]
        after:bg-gradient-to-r after:from-violet-600 after:via-blue-500 after:to-teal-400
        after:opacity-0 after:scale-x-0
        after:transition-all after:duration-300
        hover:after:opacity-100 hover:after:scale-x-100
        ${isActive ? 'after:opacity-100 after:scale-x-100' : ''}
        
        // Subtle glow effect on hover
        hover:shadow-[0_0_15px_-3px_rgba(139,92,246,0.1)]
      `}
      >
        {children}
      </Link>
    );
  };

  const renderAuthButtons = () => {
    if (status === 'loading') {
      return <div className="animate-pulse w-20 h-8 bg-[var(--gray-100)] rounded" />;
    }

    if (status === 'authenticated' && session.user) {
      return (
        <>
          {/* <span className="text-[var(--text-secondary)] mr-4">Hi, {session.user.name}</span> */}
          <SecondaryIconButton onClick={handleSignOut} icon={LogOut} />
          <SecondaryIconButton href="/user" icon={User} />
        </>
      );
    }
    return (
      <>
        <SecondaryIconButton onClick={() => signIn('google')} icon={LogIn} />
      </>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[var(--background)] shadow-md z-50">
      <div className="max-w-screen-2xl mx-auto p-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 cursor-pointer">
            <Image src="/images/y1.png" alt="logo" width={60} height={60} className="object-contain" />
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden z-[999]">
            <button
              onClick={toggleMobileMenu}
              className="text-[var(--text-secondary)] hover:text-teal-500 focus:outline-none"
            >
              <MenuIcon isOpen={isMenuOpen} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <NavItem href="/gallery">Gallery</NavItem>
            <NavItem href="/paintings">Paintings</NavItem>
            <NavItem href="/events">Exhibitions</NavItem>
            <NavItem href="/news">News</NavItem>
            <NavItem href="/about">Bio</NavItem>
            <NavItem href="/contact">Contact</NavItem>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">{renderAuthButtons()}</div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black bg-opacity-50">
            <div className="h-full flex flex-col items-center justify-center space-y-6 bg-[var(--background)]">
              {[
                { href: '/gallery', text: 'Gallery' },
                { href: '/paintings', text: 'Paintings' },
                { href: '/events', text: 'Exhibitions' },
                { href: '/news', text: 'News' },
                { href: '/about', text: 'Bio' },
                { href: '/contact', text: 'Contact' },
              ].map(({ href, text }) => {
                const pathname = usePathname();
                const isActive = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      relative w-full text-center px-4 py-4 text-2xl font-medium
                      transition-all duration-300 ease-in-out
                      
                      // Text styling with gradient
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-600 via-blue-500 to-teal-400 bg-clip-text text-transparent'
                          : 'text-[var(--text-secondary)]'
                      }
                      hover:bg-gradient-to-r hover:from-violet-600 hover:via-blue-500 hover:to-teal-400
                      hover:bg-clip-text hover:text-transparent
                      
                      // Underline effect
                      after:content-['']
                      after:absolute after:bottom-0 after:left-[25%]
                      after:w-1/2 after:h-[2px]
                      after:bg-gradient-to-r after:from-violet-600 after:via-blue-500 after:to-teal-400
                      after:opacity-0 after:scale-x-0
                      after:transition-all after:duration-300
                      hover:after:opacity-100 hover:after:scale-x-100
                      ${isActive ? 'after:opacity-100 after:scale-x-100' : ''}
                      
                      // Subtle glow effect
                      hover:shadow-[0_0_15px_-3px_rgba(139,92,246,0.1)]
                    `}
                  >
                    {text}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
