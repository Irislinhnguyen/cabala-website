'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigation = [
    { name: 'Duyệt khóa học', href: '/courses' },
    { name: 'Cho doanh nghiệp', href: '/business' },
    { name: 'Bằng cấp', href: '/degrees' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-cabala-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <Logo size="md" />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-cabala-neutral-700 hover:text-cabala-blue transition-colors font-medium py-2"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-cabala-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Bạn muốn học gì hôm nay?"
                className="block w-full pl-10 pr-4 py-2 border border-cabala-neutral-300 rounded-full bg-cabala-neutral-50 text-sm placeholder-cabala-neutral-500 focus:outline-none focus:ring-2 focus:ring-cabala-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-cabala-neutral-700 hover:text-cabala-blue font-medium"
              >
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button 
                size="sm" 
                className="bg-cabala-blue hover:bg-cabala-blue-dark text-white font-medium px-6"
              >
                Tham gia miễn phí
              </Button>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-1">
            {/* Search Toggle - Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-3 rounded-md text-cabala-neutral-700 hover:text-cabala-blue touch-manipulation"
              aria-label="Toggle search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Menu Button - Mobile */}
            <button
              className="p-3 rounded-md text-cabala-neutral-700 hover:text-cabala-blue touch-manipulation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className={cn(
          'md:hidden border-t border-cabala-neutral-200 py-4',
          isSearchOpen ? 'block' : 'hidden'
        )}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-cabala-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Bạn muốn học gì hôm nay?"
              className="block w-full pl-12 pr-4 py-4 border border-cabala-neutral-300 rounded-lg bg-cabala-neutral-50 text-base placeholder-cabala-neutral-500 focus:outline-none focus:ring-2 focus:ring-cabala-blue focus:border-transparent touch-manipulation"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          'md:hidden border-t border-cabala-neutral-200 py-4',
          isMenuOpen ? 'block' : 'hidden'
        )}>
          <nav className="flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-cabala-neutral-700 hover:text-cabala-blue transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-cabala-neutral-200">
              <div className="flex flex-col space-y-3">
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start w-full text-cabala-neutral-700 hover:text-cabala-blue py-3 touch-manipulation"
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    size="sm" 
                    className="justify-start w-full bg-cabala-blue hover:bg-cabala-blue-dark text-white py-3 touch-manipulation"
                  >
                    Tham gia miễn phí
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;