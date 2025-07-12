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

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Về chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cabala được thành lập với sứ mệnh mang giáo dục chất lượng cao đến với mọi người. 
              Chúng tôi kết nối học viên với các giáo sư đại học hàng đầu và các chuyên gia giàu kinh nghiệm trong ngành.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 mb-16">
            {/* Mission */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sứ mệnh</h3>
              <p className="text-gray-600">
                Dân chủ hóa giáo dục bằng cách cung cấp quyền truy cập vào các khóa học chất lượng cao 
                từ các chuyên gia hàng đầu thế giới.
              </p>
            </div>

            {/* Quality */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Chất lượng</h3>
              <p className="text-gray-600">
                Tất cả khóa học được thiết kế bởi các giáo sư đại học có uy tín và các chuyên gia 
                với hơn 10 năm kinh nghiệm trong lĩnh vực.
              </p>
            </div>

            {/* Innovation */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Đổi mới</h3>
              <p className="text-gray-600">
                Sử dụng công nghệ AI tiên tiến để cá nhân hóa trải nghiệm học tập 
                và tối ưu hóa hiệu quả học tập của từng học viên.
              </p>
            </div>
          </div>

          {/* Instructor Highlights */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Đội ngũ giảng viên hàng đầu
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">🎓</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Giáo sư Đại học</h4>
                <p className="text-gray-600 text-sm">
                  Từ Harvard, MIT, Stanford và các trường đại học danh tiếng
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">🚀</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Chuyên gia Ngành</h4>
                <p className="text-gray-600 text-sm">
                  Từ Google, Microsoft, Meta và các công ty công nghệ hàng đầu
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">💡</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Nhà Sáng lập</h4>
                <p className="text-gray-600 text-sm">
                  Các doanh nhân thành công và nhà đầu tư kỳ cựu
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistants Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trợ lý AI thông minh
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sản phẩm đột phá của chúng tôi - Các trợ lý AI được thiết kế riêng để hỗ trợ học tập hiệu quả. 
              Từ việc học từ vựng đến viết CV, AI sẽ là người đồng hành học tập của bạn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vocabulary AI */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Học Từ Vựng</h3>
              <p className="text-gray-600 mb-6">
                Trợ lý AI giúp bạn học từ vựng hiệu quả với phương pháp lặp lại ngắt quãng, 
                flashcard thông minh và bài tập tương tác.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Học 50+ từ mới mỗi ngày
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Phát âm chuẩn với AI
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Theo dõi tiến độ thông minh
                </div>
              </div>
            </div>

            {/* CV Writing AI */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Viết CV</h3>
              <p className="text-gray-600 mb-6">
                Tạo CV chuyên nghiệp với AI. Phân tích JD, gợi ý kỹ năng phù hợp, 
                và tối ưu hóa CV để tăng cơ hội được tuyển dụng.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Phân tích JD thông minh
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Template chuyên nghiệp
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Tối ưu ATS-friendly
                </div>
              </div>
            </div>

            {/* Interview AI */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Phỏng Vấn</h3>
              <p className="text-gray-600 mb-6">
                Luyện tập phỏng vấn với AI thông minh. Mô phỏng cuộc phỏng vấn thực tế, 
                phản hồi chi tiết và cải thiện kỹ năng giao tiếp.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mô phỏng phỏng vấn thực tế
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Phản hồi chi tiết
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Cải thiện kỹ năng giao tiếp
                </div>
              </div>
            </div>

            {/* Study AI */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Gia Sư</h3>
              <p className="text-gray-600 mb-6">
                Gia sư AI cá nhân 24/7. Giải đáp thắc mắc, giải bài tập, 
                và hướng dẫn học tập theo phong cách riêng của bạn.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Hỗ trợ 24/7
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Giải bài tập chi tiết
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Học tập cá nhân hóa
                </div>
              </div>
            </div>

            {/* Code AI */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Lập Trình</h3>
              <p className="text-gray-600 mb-6">
                Trợ lý AI giúp học lập trình hiệu quả. Review code, debug, 
                và đề xuất cải tiến với phản hồi ngay lập tức.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Review code tự động
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Debug thông minh
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Học best practices
                </div>
              </div>
            </div>

            {/* Language AI */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Ngoại Ngữ</h3>
              <p className="text-gray-600 mb-6">
                Học ngoại ngữ hiệu quả với AI. Luyện phát âm, ngữ pháp, 
                và giao tiếp thông qua cuộc hội thoại tự nhiên.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Luyện phát âm thông minh
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Hội thoại tự nhiên
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Học ngữ pháp thông minh
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg">
              Khám phá tất cả AI Tools
            </button>
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
              Khám phá các khóa học phổ biến nhất từ các giáo sư đại học hàng đầu và các chuyên gia giàu kinh nghiệm trong ngành
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

      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Blog & Tin tức
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cập nhật những xu hướng giáo dục mới nhất, mẹo học tập hiệu quả, 
              và những câu chuyện thành công từ cộng đồng học viên Cabala.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🧠</div>
                  <div className="text-blue-600 font-semibold">AI & Giáo dục</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    Công nghệ
                  </span>
                  <span className="text-gray-500 text-sm ml-3">5 ngày trước</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cách AI đang thay đổi cách chúng ta học
                </h3>
                <p className="text-gray-600 mb-4">
                  Khám phá những ứng dụng thú vị của AI trong giáo dục và cách chúng giúp 
                  cá nhân hóa trải nghiệm học tập cho từng học viên.
                </p>
                <Link href="/blog/ai-changing-education" className="text-blue-600 hover:text-blue-700 font-medium">
                  Đọc thêm →
                </Link>
              </div>
            </article>

            {/* Blog Post 2 */}
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📚</div>
                  <div className="text-green-600 font-semibold">Phương pháp học</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    Học tập
                  </span>
                  <span className="text-gray-500 text-sm ml-3">1 tuần trước</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  10 mẹo học tập hiệu quả cho người bận rộn
                </h3>
                <p className="text-gray-600 mb-4">
                  Bạn bận rộn nhưng vẫn muốn học tập? Đây là những mẹo được chứng minh 
                  khoa học để tối ưu hóa thời gian học của bạn.
                </p>
                <Link href="/blog/study-tips-busy-people" className="text-green-600 hover:text-green-700 font-medium">
                  Đọc thêm →
                </Link>
              </div>
            </article>

            {/* Blog Post 3 */}
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-purple-600 font-semibold">Nghề nghiệp</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                    Sự nghiệp
                  </span>
                  <span className="text-gray-500 text-sm ml-3">2 tuần trước</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Kỹ năng nào cần thiết cho thị trường việc làm 2024?
                </h3>
                <p className="text-gray-600 mb-4">
                  Phân tích xu hướng tuyển dụng và những kỹ năng hot nhất 
                  mà nhà tuyển dụng đang tìm kiếm trong năm 2024.
                </p>
                <Link href="/blog/skills-2024-job-market" className="text-purple-600 hover:text-purple-700 font-medium">
                  Đọc thêm →
                </Link>
              </div>
            </article>
          </div>

          <div className="text-center mt-12">
            <Link href="/blog" className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg inline-block">
              Xem tất cả bài viết
            </Link>
          </div>
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
              <p className="text-gray-300 mb-4">
                Trao quyền cho người học trên toàn thế giới với quyền truy cập vào giáo dục chất lượng cao 
                từ các giáo sư đại học và chuyên gia hàng đầu.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Khóa học</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/courses" className="hover:text-white">Tất cả khóa học</Link></li>
                <li><Link href="/courses?category=programming" className="hover:text-white">Lập trình</Link></li>
                <li><Link href="/courses?category=data-science" className="hover:text-white">Khoa học dữ liệu</Link></li>
                <li><Link href="/courses?category=design" className="hover:text-white">Thiết kế</Link></li>
                <li><Link href="/courses?category=business" className="hover:text-white">Kinh doanh</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">AI Tools</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/ai/vocabulary" className="hover:text-white">AI Học từ vựng</Link></li>
                <li><Link href="/ai/cv-writing" className="hover:text-white">AI Viết CV</Link></li>
                <li><Link href="/ai/interview" className="hover:text-white">AI Phỏng vấn</Link></li>
                <li><Link href="/ai/coding" className="hover:text-white">AI Lập trình</Link></li>
                <li><Link href="/ai/language" className="hover:text-white">AI Ngoại ngữ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/help" className="hover:text-white">Trung tâm trợ giúp</Link></li>
                <li><Link href="/contact" className="hover:text-white">Liên hệ</Link></li>
                <li><Link href="/community" className="hover:text-white">Cộng đồng</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
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