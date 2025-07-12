import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t ${className}`} 
            style={{ 
              backgroundColor: 'var(--color-slate-900)', 
              borderColor: 'var(--color-border-light)',
              color: 'var(--color-slate-300)'
            }}>
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Logo variant="dark" size="md" showText={true} className="mb-4" />
            <p className="body-base mb-6" style={{ color: 'var(--color-slate-400)' }}>
              Nền tảng học trực tuyến hàng đầu Việt Nam. Mang đến giáo dục chất lượng cao 
              cho mọi người, mọi lúc, mọi nơi.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="transition-colors hover:text-white" 
                 style={{ color: 'var(--color-slate-500)' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="transition-colors hover:text-white" 
                 style={{ color: 'var(--color-slate-500)' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="transition-colors hover:text-white" 
                 style={{ color: 'var(--color-slate-500)' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="transition-colors hover:text-white" 
                 style={{ color: 'var(--color-slate-500)' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="heading-3 text-lg mb-6" style={{ color: 'white' }}>Khám phá</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/courses" className="body-base transition-colors hover:text-white" 
                      style={{ color: 'var(--color-slate-400)' }}>
                  Khóa học
                </Link>
              </li>
              <li>
                <Link href="/ai-assistants" className="body-base transition-colors hover:text-white" 
                      style={{ color: 'var(--color-slate-400)' }}>
                  Trợ lý AI
                </Link>
              </li>
              <li>
                <Link href="/about" className="body-base transition-colors hover:text-white" 
                      style={{ color: 'var(--color-slate-400)' }}>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/blog" className="body-base transition-colors hover:text-white" 
                      style={{ color: 'var(--color-slate-400)' }}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="heading-3 text-lg mb-6" style={{ color: 'white' }}>Hỗ trợ</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="body-base transition-colors hover:text-white" 
                      style={{ color: 'var(--color-slate-400)' }}>
                  Trung tâm hỗ trợ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="body-base transition-colors hover:text-white" 
                      style={{ color: 'var(--color-slate-400)' }}>
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="body-base transition-colors hover:text-white" 
                      style={{ color: 'var(--color-slate-400)' }}>
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="body-base transition-colors hover:text-white" 
                      style={{ color: 'var(--color-slate-400)' }}>
                  Góp ý
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="heading-3 text-lg mb-6" style={{ color: 'white' }}>Pháp lý</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="body-base transition-colors hover:text-white" 
                      style={{ color: 'var(--color-slate-400)' }}>
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="body-base transition-colors hover:text-white" 
                      style={{ color: 'var(--color-slate-400)' }}>
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="body-base transition-colors hover:text-white" 
                      style={{ color: 'var(--color-slate-400)' }}>
                  Chính sách cookie
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="body-base transition-colors hover:text-white" 
                      style={{ color: 'var(--color-slate-400)' }}>
                  Hỗ trợ tiếp cận
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-slate-800)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="body-small mb-4 md:mb-0" style={{ color: 'var(--color-slate-500)' }}>
              <p>&copy; {currentYear} Cabala. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/sitemap" className="body-small transition-colors hover:text-white" 
                    style={{ color: 'var(--color-slate-500)' }}>
                Sơ đồ trang web
              </Link>
              <Link href="/careers" className="body-small transition-colors hover:text-white" 
                    style={{ color: 'var(--color-slate-500)' }}>
                Tuyển dụng
              </Link>
              <Link href="/press" className="body-small transition-colors hover:text-white" 
                    style={{ color: 'var(--color-slate-500)' }}>
                Báo chí
              </Link>
              <div className="flex items-center space-x-2">
                <span className="body-small" style={{ color: 'var(--color-slate-500)' }}>🇻🇳</span>
                <select className="bg-transparent border-none body-small focus:outline-none text-white">
                  <option value="vi" style={{ backgroundColor: 'var(--color-slate-900)' }}>Tiếng Việt</option>
                  <option value="en" style={{ backgroundColor: 'var(--color-slate-900)' }}>English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}