'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { X as CloseIcon, LogIn, LogOut, User } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { MenuIcon } from './icons/Menu';

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
        className={`px-4 py-2 hover:text-teal-500 ${isActive ? 'text-teal-600' : 'text-gray-700'}`}
      >
        {children}
      </Link>
    );
  };

  const renderAuthButtons = () => {
    if (status === 'loading') {
      return <div className="animate-pulse w-20 h-8 bg-gray-200 rounded" />;
    }

    if (status === 'authenticated' && session.user) {
      return (
        <>
          <span className="text-gray-700 mr-4">Welcome, {session.user.name}</span>
          <button
            onClick={handleSignOut}
            className="rounded-full p-3 text-teal-600 border border-teal-600 hover:bg-teal-50"
          >
            <LogOut className="w-6 h-6" />
          </button>
          <Link
            href="/user"
            className="rounded-full p-3 text-teal-600 border border-teal-600 hover:bg-teal-50"
          >
            <User className="w-6 h-6" />
          </Link>
        </>
      );
    }
    return (
      <>
        <button
          onClick={() => signIn('google')}
          className="rounded-full p-3 text-teal-600 border border-teal-600 hover:bg-teal-50"
        >
          <LogIn className="w-6 h-6" />
        </button>
      </>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/logo.jpeg" alt="logo" width={60} height={60} className="object-contain" />
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden z-[999]">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-teal-500 focus:outline-none"
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
            <div className="h-full flex flex-col items-center justify-center space-y-6 bg-white">
              <Link
                href="/gallery"
                className="w-full text-center px-3 py-4 text-2xl font-medium text-gray-700 hover:text-teal-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/paintings"
                className="w-full text-center px-3 py-4 text-2xl font-medium text-gray-700 hover:text-teal-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Paintings
              </Link>
              <Link
                href="/events"
                className="w-full text-center px-3 py-4 text-2xl font-medium text-gray-700 hover:text-teal-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Exhibitions
              </Link>
              <Link
                href="/news"
                className="w-full text-center px-3 py-4 text-2xl font-medium text-gray-700 hover:text-teal-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/about"
                className="w-full text-center px-3 py-4 text-2xl font-medium text-gray-700 hover:text-teal-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Bio
              </Link>
              <Link
                href="/contact"
                className="w-full text-center px-3 py-4 text-2xl font-medium text-gray-700 hover:text-teal-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
