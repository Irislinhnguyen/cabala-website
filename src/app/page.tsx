'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

interface Course {
  id: number;
  title: string;
  shortName: string;
  description: string;
  price: number;
  currency: string;
  level: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  thumbnail: string;
  courseImage?: string;
  visible: boolean;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses.filter((course: Course) => course.visible).slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/courses');
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Miễn phí';
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header variant="full" />

      {/* Hero Section - Elegant & Spacious */}
      <section className="py-24 lg:py-32">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-6"
                   style={{ 
                     backgroundColor: 'var(--color-interactive-light)', 
                     color: 'var(--color-interactive-hover)' 
                   }}>
                <span className="accent-dot mr-2"></span>
                Nền tảng học tập thông minh
              </div>
              
              <h1 className="heading-1 mb-6">
                Học bất cứ thứ gì,{' '}
                <span className="text-interactive">bất cứ lúc nào</span>
              </h1>
              
              <p className="body-large mb-8 max-w-lg mx-auto lg:mx-0">
                Truy cập giáo dục đẳng cấp thế giới từ các trường đại học và công ty hàng đầu. 
                Xây dựng kỹ năng quan trọng với AI assistants thông minh.
              </p>

              {/* Elegant Search */}
              <div className="mb-8">
                <form onSubmit={handleSearch} className="space-y-4 sm:flex sm:gap-4 sm:space-y-0">
                  <input
                    type="text"
                    placeholder="Bạn muốn học gì hôm nay?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-interactive transition-all"
                    style={{ 
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'var(--color-surface)'
                    }}
                  />
                  <button 
                    type="submit" 
                    className="w-full sm:w-auto btn-primary px-8 py-4 text-lg"
                  >
                    Khám phá
                  </button>
                </form>
              </div>

              {/* Refined Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm">
                <div className="flex items-center">
                  <span className="body-small">118M+ học viên</span>
                </div>
                <div className="flex items-center">
                  <span className="body-small">7,000+ khóa học</span>
                </div>
                <div className="flex items-center">
                  <span className="body-small">4.6★ đánh giá</span>
                </div>
              </div>
            </div>

            {/* Right Content - Sophisticated Illustration */}
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg"
                   style={{ backgroundColor: 'var(--color-surface)' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                       style={{ backgroundColor: 'white' }}>
                    <svg className="w-8 h-8 text-interactive ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-6 left-6 w-3 h-3 rounded-full"
                     style={{ backgroundColor: 'var(--color-accent-500)' }}></div>
                <div className="absolute bottom-6 right-6 w-2 h-2 rounded-full"
                     style={{ backgroundColor: 'var(--color-interactive)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses - Clean & Minimal */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Khóa học nổi bật</h2>
            <p className="body-large max-w-2xl mx-auto">
              Khám phá những khóa học được đánh giá cao nhất từ các chuyên gia hàng đầu
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-base p-6 animate-pulse">
                  <div className="h-40 rounded-lg mb-4" style={{ backgroundColor: 'var(--color-border-light)' }}></div>
                  <div className="space-y-3">
                    <div className="h-4 rounded" style={{ backgroundColor: 'var(--color-border-light)' }}></div>
                    <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--color-border-light)' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="card-base p-6 group"
                >
                  <div className="aspect-video rounded-lg mb-4 overflow-hidden"
                       style={{ backgroundColor: 'var(--color-border-light)' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                  </div>
                  
                  <h3 className="heading-3 text-lg mb-2 group-hover:text-interactive transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="body-small mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-interactive font-semibold">
                      {formatPrice(course.price, course.currency)}
                    </span>
                    <span className="body-small">
                      {course.level}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/courses" className="btn-secondary">
              Xem tất cả khóa học
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistants Preview - Minimal */}
      <section className="py-20">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">AI Assistants thông minh</h2>
            <p className="body-large max-w-2xl mx-auto">
              Trợ lý AI cá nhân hóa giúp bạn học tập hiệu quả và phát triển kỹ năng nhanh chóng
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📚', title: 'AI Học từ vựng', desc: 'Học từ mới thông minh với phương pháp lặp lại ngắt quãng' },
              { icon: '📄', title: 'AI Viết CV', desc: 'Tạo CV chuyên nghiệp với AI phân tích JD thông minh' },
              { icon: '👨‍🏫', title: 'AI Gia sư', desc: 'Gia sư AI cá nhân 24/7 giải đáp thắc mắc học tập' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl"
                     style={{ backgroundColor: 'var(--color-surface)' }}>
                  {item.icon}
                </div>
                <h3 className="heading-3 text-xl mb-3">{item.title}</h3>
                <p className="body-base">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/ai-assistants" className="btn-secondary">
              Khám phá AI Assistants
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}