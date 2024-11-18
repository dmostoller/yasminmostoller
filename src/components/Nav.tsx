'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { Menu as MenuIcon, X as CloseIcon, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = null;

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
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
        {/* <Link
          href="/signin"
          className="rounded-full p-3 text-teal-600 border border-teal-600 hover:bg-teal-50"
        >
          <UserPlus className="w-6 h-6" />
        </Link> */}
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
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-teal-500 focus:outline-none"
            >
              {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/gallery"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/paintings"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Paintings
              </Link>
              <Link
                href="/events"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Exhibitions
              </Link>
              <Link
                href="/news"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-500"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Bio
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-500"
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
