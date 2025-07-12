'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AIAssistants() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const aiTools = [
    {
      id: 'vocabulary',
      name: 'AI Học Từ Vựng',
      category: 'language',
      description: 'Trợ lý AI giúp bạn học từ vựng hiệu quả với phương pháp lặp lại ngắt quãng, flashcard thông minh và bài tập tương tác.',
      features: [
        'Học 50+ từ mới mỗi ngày',
        'Phát âm chuẩn với AI',
        'Theo dõi tiến độ thông minh',
        'Flashcard cá nhân hóa',
        'Bài tập tương tác'
      ],
      icon: '📚',
      color: 'blue',
      gradient: 'from-blue-100 to-blue-200',
      price: 'Miễn phí',
      popular: true
    },
    {
      id: 'cv-writing',
      name: 'AI Viết CV',
      category: 'career',
      description: 'Tạo CV chuyên nghiệp với AI. Phân tích JD, gợi ý kỹ năng phù hợp, và tối ưu hóa CV để tăng cơ hội được tuyển dụng.',
      features: [
        'Phân tích JD thông minh',
        'Template chuyên nghiệp',
        'Tối ưu ATS-friendly',
        'Gợi ý kỹ năng phù hợp',
        'Export đa định dạng'
      ],
      icon: '📄',
      color: 'green',
      gradient: 'from-green-100 to-green-200',
      price: '99.000 VND/tháng',
      popular: false
    },
    {
      id: 'interview',
      name: 'AI Phỏng Vấn',
      category: 'career',
      description: 'Luyện tập phỏng vấn với AI thông minh. Mô phỏng cuộc phỏng vấn thực tế, phản hồi chi tiết và cải thiện kỹ năng giao tiếp.',
      features: [
        'Mô phỏng phỏng vấn thực tế',
        'Phản hồi chi tiết',
        'Cải thiện kỹ năng giao tiếp',
        'Câu hỏi theo ngành nghề',
        'Đánh giá chi tiết'
      ],
      icon: '🎤',
      color: 'purple',
      gradient: 'from-purple-100 to-purple-200',
      price: '149.000 VND/tháng',
      popular: false
    },
    {
      id: 'tutor',
      name: 'AI Gia Sư',
      category: 'study',
      description: 'Gia sư AI cá nhân 24/7. Giải đáp thắc mắc, giải bài tập, và hướng dẫn học tập theo phong cách riêng của bạn.',
      features: [
        'Hỗ trợ 24/7',
        'Giải bài tập chi tiết',
        'Học tập cá nhân hóa',
        'Đa ngôn ngữ',
        'Theo dõi tiến độ'
      ],
      icon: '👨‍🏫',
      color: 'yellow',
      gradient: 'from-yellow-100 to-yellow-200',
      price: '199.000 VND/tháng',
      popular: true
    },
    {
      id: 'coding',
      name: 'AI Lập Trình',
      category: 'programming',
      description: 'Trợ lý AI giúp học lập trình hiệu quả. Review code, debug, và đề xuất cải tiến với phản hồi ngay lập tức.',
      features: [
        'Review code tự động',
        'Debug thông minh',
        'Học best practices',
        'Hỗ trợ đa ngôn ngữ lập trình',
        'Dự án thực tế'
      ],
      icon: '💻',
      color: 'red',
      gradient: 'from-red-100 to-red-200',
      price: '299.000 VND/tháng',
      popular: false
    },
    {
      id: 'language',
      name: 'AI Ngoại Ngữ',
      category: 'language',
      description: 'Học ngoại ngữ hiệu quả với AI. Luyện phát âm, ngữ pháp, và giao tiếp thông qua cuộc hội thoại tự nhiên.',
      features: [
        'Luyện phát âm thông minh',
        'Hội thoại tự nhiên',
        'Học ngữ pháp thông minh',
        'Đa ngôn ngữ',
        'Chứng chỉ quốc tế'
      ],
      icon: '🗣️',
      color: 'indigo',
      gradient: 'from-indigo-100 to-indigo-200',
      price: '199.000 VND/tháng',
      popular: true
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', count: aiTools.length },
    { id: 'language', name: 'Ngôn ngữ', count: aiTools.filter(tool => tool.category === 'language').length },
    { id: 'career', name: 'Sự nghiệp', count: aiTools.filter(tool => tool.category === 'career').length },
    { id: 'study', name: 'Học tập', count: aiTools.filter(tool => tool.category === 'study').length },
    { id: 'programming', name: 'Lập trình', count: aiTools.filter(tool => tool.category === 'programming').length }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? aiTools 
    : aiTools.filter(tool => tool.category === selectedCategory);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header variant="full" />

      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="text-center">
            <h1 className="heading-1 mb-6">
              Trợ lý <span className="text-interactive">AI</span> thông minh
            </h1>
            <p className="body-large max-w-3xl mx-auto mb-8">
              Khám phá bộ sưu tập AI assistants được thiết kế riêng để hỗ trợ học tập hiệu quả. 
              Từ việc học từ vựng đến viết CV, AI sẽ là người đồng hành học tập của bạn.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <span className="bg-blue-100 text-blue-800 px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
                6 AI Tools
              </span>
              <span className="bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
                Miễn phí thử 7 ngày
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
                Hỗ trợ 24/7
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b" style={{ borderColor: 'var(--color-border-light)' }}>
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Grid */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                {tool.popular && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Phổ biến
                  </div>
                )}
                
                <div className={`h-40 sm:h-48 bg-gradient-to-br ${tool.gradient} flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">{tool.icon}</div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{tool.name}</h3>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">{tool.description}</p>
                  
                  <div className="space-y-2 mb-4 sm:mb-6">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs sm:text-sm text-gray-600">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg sm:text-xl font-bold text-gray-900">{tool.price}</div>
                    {tool.price !== 'Miễn phí' && (
                      <div className="text-xs sm:text-sm text-gray-500">
                        <span className="line-through">7 ngày miễn phí</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base">
                      {tool.price === 'Miễn phí' ? 'Sử dụng ngay' : 'Dùng thử miễn phí'}
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Cách hoạt động
            </h2>
            <p className="body-large max-w-3xl mx-auto">
              Chỉ với 3 bước đơn giản, bạn có thể bắt đầu sử dụng AI assistants để tăng tốc hành trình học tập
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Chọn AI Tool</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Chọn AI assistant phù hợp với nhu cầu học tập của bạn từ bộ sưu tập của chúng tôi
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Tương tác & Học</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Tương tác với AI thông qua giao diện thân thiện, nhận hướng dẫn và phản hồi cá nhân hóa
              </p>
            </div>

            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Theo dõi tiến độ</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Theo dõi kết quả học tập và nhận insights để cải thiện hiệu quả học tập
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Học viên nói gì về AI assistants
            </h2>
            <p className="body-large max-w-3xl mx-auto">
              Hàng nghìn học viên đã cải thiện hiệu quả học tập với AI assistants của chúng tôi
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                &quot;AI Học Từ Vựng giúp tôi nhớ được hơn 500 từ chỉ trong 1 tháng. Phương pháp lặp lại ngắt quãng thực sự hiệu quả!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xs sm:text-sm font-bold text-blue-600">NM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Nguyen Minh</p>
                  <p className="text-xs sm:text-sm text-gray-500">Sinh viên ĐH Bách Khoa</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                &quot;AI Viết CV đã giúp tôi tạo ra một CV ấn tượng và nhận được offer từ Google. Tuyệt vời!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xs sm:text-sm font-bold text-green-600">LT</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Le Tuan</p>
                  <p className="text-xs sm:text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                &quot;AI Gia Sư như một thầy giáo cá nhân 24/7. Giải thích rất chi tiết và dễ hiểu, phù hợp với tốc độ học của tôi.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xs sm:text-sm font-bold text-purple-600">HN</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Hoang Nam</p>
                  <p className="text-xs sm:text-sm text-gray-500">Học sinh lớp 12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-interactive)' }}>
        <div className="container-wide text-center">
          <h2 className="heading-2 text-white mb-4">
            Sẵn sàng trải nghiệm AI assistants?
          </h2>
          <p className="body-large text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Bắt đầu với 7 ngày dùng thử miễn phí. Không cần thẻ tín dụng.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button className="bg-white text-blue-600 font-semibold px-6 sm:px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-center">
              Dùng thử miễn phí
            </button>
            <button className="border border-white text-white font-semibold px-6 sm:px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-center">
              Xem demo
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 