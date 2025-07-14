'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [authResult, setAuthResult] = useState<{
    isAuthenticated: boolean;
    isAdmin: boolean;
    user: { name?: string; email?: string } | null;
    error?: string;
  }>({ isAuthenticated: false, isAdmin: false, user: null });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('🔍 Admin Layout: No auth token found, redirecting to login');
      window.location.href = '/login?redirect=/admin';
      return;
    }

    console.log('🔍 Admin Layout: Auth token found, verifying admin access...');
    
    // Verify token using API endpoint (same approach as student dashboard)
    verifyAdminTokenAndSetAuth(token);
  }, []);

  const verifyAdminTokenAndSetAuth = async (token: string) => {
    try {
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      
      if (!data.success || !data.user) {
        console.log('🔍 Admin Layout: Token verification failed:', data.error);
        localStorage.removeItem('auth_token');
        window.location.href = '/login?redirect=/admin';
        return;
      }
      
      console.log('🔍 Admin Layout: Token verified successfully:', data.user);
      
      // Check if user is admin
      if (data.user.role !== 'ADMIN') {
        console.log('🔍 Admin Layout: User is not admin, redirecting to dashboard');
        alert('Access denied: Admin role required');
        window.location.href = '/dashboard';
        return;
      }
      
      console.log('🔍 Admin Layout: Admin access confirmed');
      
      // Set authenticated admin user
      setAuthResult({
        isAuthenticated: true,
        isAdmin: true,
        user: {
          name: data.user.name,
          email: data.user.email
        }
      });
      setIsLoading(false);
      
    } catch (error) {
      console.error('🔍 Admin Layout: Token verification error:', error);
      localStorage.removeItem('auth_token');
      window.location.href = '/login?redirect=/admin';
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Course Management', href: '/admin/courses', icon: '📚' },
    { name: 'Tag Mapping', href: '/admin/tags', icon: '🏷️' },
    { name: 'Categories', href: '/admin/categories', icon: '📁' },
    { name: 'Sync Moodle', href: '/admin/sync', icon: '🔄' },
  ];

  const handleLogout = async () => {
    try {
      console.log('🔍 Admin Layout: Initiating logout...');
      
      const token = localStorage.getItem('auth_token');
      
      // Call logout API endpoint
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      
      // Clear local storage
      localStorage.removeItem('auth_token');
      console.log('🔍 Admin Layout: Token cleared, redirecting to login');
      
      // Redirect to login page
      window.location.href = '/login';
      
    } catch (error) {
      console.error('🔍 Admin Layout: Logout error:', error);
      // Even if API call fails, still clear local storage and redirect
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated or not admin (redirect will happen)
  if (!authResult.isAuthenticated || !authResult.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 font-bold text-xl">
                Cabala Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {authResult.user?.name || 'Admin'}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
              <Link 
                href="/" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}