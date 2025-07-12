'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function About() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header variant="full" />

      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="text-center">
            <h1 className="heading-1 mb-6">
              Về <span className="text-interactive">Cabala</span>
            </h1>
            <p className="body-large max-w-3xl mx-auto mb-8">
              Chúng tôi tin rằng giáo dục chất lượng cao nên được tiếp cận bởi mọi người, 
              ở mọi nơi, vào mọi lúc. Cabala được thành lập với sứ mệnh dân chủ hóa giáo dục 
              thông qua công nghệ và đổi mới.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <span className="bg-blue-100 text-blue-800 px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
                Thành lập 2024
              </span>
              <span className="bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
                100+ Giảng viên
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
                1000+ Học viên
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="heading-2 mb-6">
                Sứ mệnh của chúng tôi
              </h2>
              <p className="body-base mb-6">
                Tại Cabala, chúng tôi cam kết mang đến trải nghiệm học tập tốt nhất thông qua 
                việc kết nối học viên với các giáo sư đại học hàng đầu và các chuyên gia giàu kinh nghiệm.
              </p>
              <p className="body-base mb-8">
                Chúng tôi sử dụng công nghệ AI tiên tiến để cá nhân hóa hành trình học tập của từng học viên, 
                đảm bảo hiệu quả học tập tối ưu và trải nghiệm học tập thú vị.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Chất lượng hàng đầu</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Tất cả khóa học được thiết kế bởi các chuyên gia có uy tín</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Học tập cá nhân hóa</h4>
                    <p className="text-gray-600 text-sm sm:text-base">AI điều chỉnh nội dung phù hợp với tốc độ học của bạn</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Hỗ trợ toàn diện</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Từ học tập đến phát triển sự nghiệp với AI assistants</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6 sm:p-8">
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎯</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Tầm nhìn 2030</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Trở thành nền tảng giáo dục trực tuyến hàng đầu Việt Nam, 
                      mang giáo dục chất lượng cao đến với mọi người.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Đội ngũ giảng viên
            </h2>
            <p className="body-large max-w-3xl mx-auto">
              Chúng tôi tự hào có đội ngũ giảng viên là các giáo sư đại học danh tiếng 
              và các chuyên gia hàng đầu từ các tập đoàn công nghệ lớn.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* University Professors - Mobile Optimized */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">🎓</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Giáo sư Đại học</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Các giáo sư từ Harvard, MIT, Stanford, và các trường đại học danh tiếng trong nước
              </p>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                <p>• Tiến sĩ từ các trường top thế giới</p>
                <p>• Hơn 15 năm kinh nghiệm giảng dạy</p>
                <p>• Tác giả của hàng trăm công trình nghiên cứu</p>
              </div>
            </div>

            {/* Industry Experts - Mobile Optimized */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">🚀</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Chuyên gia Ngành</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Các chuyên gia từ Google, Microsoft, Meta, Amazon và các công ty công nghệ hàng đầu
              </p>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                <p>• Hơn 10 năm kinh nghiệm thực tế</p>
                <p>• Từng làm việc tại Big Tech</p>
                <p>• Chuyên gia trong lĩnh vực AI, Data Science</p>
              </div>
            </div>

            {/* Entrepreneurs - Mobile Optimized */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center sm:col-span-2 lg:col-span-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-purple-100 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">💡</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Doanh nhân</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Các doanh nhân thành công, nhà đầu tư và CEO của các startup unicorn
              </p>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                <p>• Thành lập và thoái vốn nhiều startup</p>
                <p>• Kinh nghiệm quản lý đội ngũ hàng trăm người</p>
                <p>• Mentor cho hàng nghìn doanh nhân trẻ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="body-large max-w-3xl mx-auto">
              Những giá trị này định hình cách chúng tôi hoạt động và phục vụ cộng đồng học viên
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Excellence - Mobile Optimized */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Xuất sắc</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Chúng tôi cam kết cung cấp chất lượng giáo dục tốt nhất, 
                không ngừng cải tiến và đổi mới.
              </p>
            </div>

            {/* Accessibility - Mobile Optimized */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Tiếp cận</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Giáo dục chất lượng phải có thể tiếp cận được bởi mọi người, 
                bất kể hoàn cảnh.
              </p>
            </div>

            {/* Innovation - Mobile Optimized */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Đổi mới</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Chúng tôi luôn đi đầu trong việc ứng dụng công nghệ mới 
                để cải thiện trải nghiệm học tập.
              </p>
            </div>

            {/* Community - Mobile Optimized */}
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Cộng đồng</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Chúng tôi xây dựng một cộng đồng học tập mạnh mẽ, 
                nơi mọi người cùng nhau phát triển.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-interactive)' }}>
        <div className="container-wide text-center">
          <h2 className="heading-2 mb-4 text-white">
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className="body-large mb-8 max-w-2xl mx-auto text-white opacity-90">
            Tham gia cùng hàng nghìn học viên đang xây dựng tương lai của họ với Cabala
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-white text-primary hover:bg-gray-100 transition-colors btn-primary">
              Tham gia miễn phí
            </Link>
            <Link href="/courses" className="border border-white text-white hover:bg-white hover:text-primary transition-colors btn-secondary">
              Khám phá khóa học
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 