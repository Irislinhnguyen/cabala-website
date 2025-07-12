'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';

interface HeaderProps {
  variant?: 'full' | 'simple' | 'minimal';
  title?: string;
  description?: string;
  backUrl?: string;
  showAuth?: boolean;
  className?: string;
}

export default function Header({ 
  variant = 'full', 
  title, 
  description, 
  backUrl, 
  showAuth = true,
  className = ''
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const renderNavigation = () => (
    <nav className="hidden md:flex items-center space-x-8">
      <Link 
        href="/courses" 
        className="font-medium transition-colors"
        style={{
          color: isActive('/courses') 
            ? 'var(--color-interactive)' 
            : 'var(--color-text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/courses')) {
            e.currentTarget.style.color = 'var(--color-interactive)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive('/courses')) {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }
        }}
      >
        Khóa học
      </Link>
      <Link 
        href="/ai-assistants" 
        className="font-medium transition-colors"
        style={{
          color: isActive('/ai-assistants') 
            ? 'var(--color-interactive)' 
            : 'var(--color-text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/ai-assistants')) {
            e.currentTarget.style.color = 'var(--color-interactive)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive('/ai-assistants')) {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }
        }}
      >
        Trợ lý AI
      </Link>
      <Link 
        href="/about" 
        className="font-medium transition-colors"
        style={{
          color: isActive('/about') 
            ? 'var(--color-interactive)' 
            : 'var(--color-text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/about')) {
            e.currentTarget.style.color = 'var(--color-interactive)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive('/about')) {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }
        }}
      >
        Về chúng tôi
      </Link>
      <Link 
        href="/blog" 
        className="font-medium transition-colors"
        style={{
          color: isActive('/blog') 
            ? 'var(--color-interactive)' 
            : 'var(--color-text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/blog')) {
            e.currentTarget.style.color = 'var(--color-interactive)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive('/blog')) {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }
        }}
      >
        Blog
      </Link>
      <Link 
        href="/dashboard" 
        className="font-medium transition-colors"
        style={{
          color: isActive('/dashboard') 
            ? 'var(--color-interactive)' 
            : 'var(--color-text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/dashboard')) {
            e.currentTarget.style.color = 'var(--color-interactive)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive('/dashboard')) {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }
        }}
      >
        Dashboard
      </Link>
    </nav>
  );

  const renderAuthButtons = () => (
    <div className="hidden md:flex items-center space-x-4">
      <Link 
        href="/login" 
        className="font-medium transition-colors"
        style={{ color: 'var(--color-interactive)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-interactive-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-interactive)';
        }}
      >
        Đăng nhập
      </Link>
      <Link 
        href="/register" 
        className="btn-primary"
      >
        Tham gia miễn phí
      </Link>
    </div>
  );

  const renderBackButton = () => (
    <Link 
      href={backUrl || '/'} 
      className="flex items-center transition-colors"
      style={{ color: 'var(--color-text-muted)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--color-interactive)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--color-text-muted)';
      }}
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Quay lại
    </Link>
  );

  const renderMobileMenu = () => (
    <div className="md:hidden border-t" style={{ borderColor: 'var(--color-border-light)' }}>
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link 
          href="/courses" 
          className="block px-3 py-2 font-medium transition-colors"
          style={{
            color: isActive('/courses') 
              ? 'var(--color-interactive)' 
              : 'var(--color-text-secondary)'
          }}
        >
          Khóa học
        </Link>
        <Link 
          href="/ai-assistants" 
          className="block px-3 py-2 font-medium transition-colors"
          style={{
            color: isActive('/ai-assistants') 
              ? 'var(--color-interactive)' 
              : 'var(--color-text-secondary)'
          }}
        >
          Trợ lý AI
        </Link>
        <Link 
          href="/about" 
          className="block px-3 py-2 font-medium transition-colors"
          style={{
            color: isActive('/about') 
              ? 'var(--color-interactive)' 
              : 'var(--color-text-secondary)'
          }}
        >
          Về chúng tôi
        </Link>
        <Link 
          href="/blog" 
          className="block px-3 py-2 font-medium transition-colors"
          style={{
            color: isActive('/blog') 
              ? 'var(--color-interactive)' 
              : 'var(--color-text-secondary)'
          }}
        >
          Blog
        </Link>
        <Link 
          href="/dashboard" 
          className="block px-3 py-2 font-medium transition-colors"
          style={{
            color: isActive('/dashboard') 
              ? 'var(--color-interactive)' 
              : 'var(--color-text-secondary)'
          }}
        >
          Dashboard
        </Link>
        {showAuth && (
          <div className="border-t pt-3 mt-3" style={{ borderColor: 'var(--color-border-light)' }}>
            <Link 
              href="/login" 
              className="block px-3 py-2 font-medium"
              style={{ color: 'var(--color-interactive)' }}
            >
              Đăng nhập
            </Link>
            <Link 
              href="/register" 
              className="block mx-3 mt-2 text-center btn-primary"
            >
              Tham gia miễn phí
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  // Full navigation header
  if (variant === 'full') {
    return (
      <header className={`border-b sticky top-0 z-50 ${className}`} 
              style={{ 
                backgroundColor: 'var(--color-background)', 
                borderColor: 'var(--color-border-light)' 
              }}>
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Logo size="md" showText={true} />
            </Link>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                }}
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {renderNavigation()}
            
            {showAuth && renderAuthButtons()}
          </div>

          {mobileMenuOpen && renderMobileMenu()}
        </div>
      </header>
    );
  }

  // Simple header with back button and title
  if (variant === 'simple') {
    return (
      <header className={`border-b ${className}`}
              style={{ 
                backgroundColor: 'var(--color-background)', 
                borderColor: 'var(--color-border-light)' 
              }}>
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {backUrl && renderBackButton()}
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Logo size="md" showText={true} />
                </Link>
                {title && (
                  <div>
                    <h1 className="heading-3 text-lg" style={{ color: 'var(--color-text-primary)' }}>{title}</h1>
                    {description && (
                      <p className="body-small mt-1" style={{ color: 'var(--color-text-muted)' }}>{description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile menu button for simple header */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                }}
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {renderNavigation()}
            
            {showAuth && renderAuthButtons()}
          </div>

          {mobileMenuOpen && renderMobileMenu()}
        </div>
      </header>
    );
  }

  // Minimal header - just logo
  if (variant === 'minimal') {
    return (
      <header className={`border-b ${className}`}
              style={{ 
                backgroundColor: 'var(--color-background)', 
                borderColor: 'var(--color-border-light)' 
              }}>
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Logo size="md" showText={true} />
            </Link>
            
            {backUrl && (
              <div className="flex items-center space-x-4">
                {renderBackButton()}
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  return null;
}