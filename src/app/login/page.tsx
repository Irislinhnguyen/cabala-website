'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Header from '@/components/layout/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('return');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store token and redirect
        localStorage.setItem('auth_token', data.token);
        const redirectUrl = returnUrl ? decodeURIComponent(returnUrl) : '/dashboard';
        window.location.href = redirectUrl;
      } else {
        setError(data.error || 'Đăng nhập thất bại');
      }
    } catch {
      setError('Lỗi mạng - vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header variant="minimal" backUrl="/" />
      
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6">
              <img 
                src="/Cabala.png" 
                alt="Cabala"
                className="h-10 w-10 sm:h-12 sm:w-12"
              />
              <span className="text-2xl sm:text-3xl font-bold text-primary">Cabala</span>
            </Link>
            <h1 className="heading-2 mb-2">Đăng nhập</h1>
            <p className="body-base">
              Truy cập khóa học và tài khoản của bạn
            </p>
          </div>

          <Card className="card-base">
            <CardHeader className="text-center">
              <CardTitle className="heading-3">Chào mừng trở lại</CardTitle>
              <CardDescription>
                Nhập thông tin đăng nhập để tiếp tục
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="label-base">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="label-base">
                    Mật khẩu
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-base"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg text-sm" 
                       style={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)' }}>
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Đang đăng nhập...</span>
                    </div>
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-interactive hover:text-interactive-hover transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" style={{ borderColor: 'var(--color-border-light)' }} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-secondary" style={{ backgroundColor: 'var(--color-surface)' }}>hoặc</span>
                </div>
              </div>

              <div className="text-center">
                <p className="body-small">
                  Chưa có tài khoản?{' '}
                  <Link
                    href="/register"
                    className="text-interactive hover:text-interactive-hover font-medium transition-colors"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="body-small">
              Bằng cách đăng nhập, bạn đồng ý với{' '}
              <Link href="/terms" className="text-interactive hover:text-interactive-hover transition-colors">
                Điều khoản dịch vụ
              </Link>{' '}
              và{' '}
              <Link href="/privacy" className="text-interactive hover:text-interactive-hover transition-colors">
                Chính sách bảo mật
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}