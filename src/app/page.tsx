'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold text-blue-900">Cabala</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/courses" className="text-gray-700 hover:text-blue-600">Duyệt</Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <Link href="/courses" className="text-gray-700 hover:text-blue-600">Khóa học</Link>
            </nav>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Bạn muốn học gì?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Đăng nhập
              </Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded">
                Tham gia miễn phí
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Học bất cứ thứ gì,{' '}
                <span className="text-blue-600">bất cứ lúc nào</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Truy cập giáo dục đẳng cấp thế giới từ các trường đại học và công ty hàng đầu. 
                Xây dựng kỹ năng quan trọng với các lộ trình học tập cá nhân hóa được hỗ trợ bởi AI.
              </p>

              {/* Search Section */}
              <div className="mb-8">
                <form onSubmit={handleSearch} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Bạn muốn học gì hôm nay?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-lg">
                    Khám phá
                  </button>
                </form>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="font-medium">118M+ học viên</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="font-medium">7,000+ khóa học</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="font-medium">4.6 đánh giá trung bình</span>
                </div>
              </div>
            </div>

            {/* Right Content - Video Preview */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-1">Bắt đầu học hôm nay</h3>
                    <p className="text-sm text-gray-600">Xem trước những gì bạn sẽ học</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Khóa học nổi bật
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các khóa học phổ biến nhất từ các tổ chức giáo dục hàng đầu thế giới và các chuyên gia trong ngành
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : courses.length === 0 ? (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">Không có khóa học nào được tìm thấy</p>
              </div>
            ) : (
              courses.map((course, index) => {
                const colors = [
                  { bg: 'from-blue-100 to-blue-200', text: 'text-blue-600' },
                  { bg: 'from-green-100 to-green-200', text: 'text-green-600' },
                  { bg: 'from-purple-100 to-purple-200', text: 'text-purple-600' },
                  { bg: 'from-pink-100 to-pink-200', text: 'text-pink-600' }
                ];
                const color = colors[index % colors.length];
                
                return (
                  <Link key={course.id} href={`/courses/${course.id}`} className="block">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                      <div className={`h-40 bg-gradient-to-br ${color.bg} flex items-center justify-center`}>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${color.text} mb-1`}>{course.shortName}</div>
                          <div className={`text-sm ${color.text} opacity-80`}>Khóa học chất lượng</div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                        
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(Math.floor(course.rating))].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                            {course.rating % 1 !== 0 && (
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            )}
                            {[...Array(5 - Math.ceil(course.rating))].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">{course.rating} ({course.students})</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className={`text-lg font-bold ${course.price === 0 ? 'text-blue-600' : 'text-gray-900'}`}>
                            {formatPrice(course.price, course.currency)}
                          </div>
                          <button 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `/courses/${course.id}`;
                            }}
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
          
          {courses.length > 0 && (
            <div className="text-center mt-8">
              <Link href="/courses" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg inline-block">
                Xem tất cả khóa học
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold">Cabala</span>
              </div>
              <p className="text-gray-300">
                Trao quyền cho người học trên toàn thế giới với quyền truy cập vào giáo dục chất lượng cao.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Khóa học</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Lập trình</li>
                <li>Khoa học dữ liệu</li>
                <li>Thiết kế</li>
                <li>Kinh doanh</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Trung tâm trợ giúp</li>
                <li>Liên hệ</li>
                <li>Cộng đồng</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Theo dõi</h3>
              <p className="text-gray-300 mb-4">
                Nhận cập nhật khóa học mới nhất
              </p>
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Cabala. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}