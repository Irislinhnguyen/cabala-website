'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function AIAssistants() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const aiTools = [
    {
      id: 'idiom-learning',
      name: 'AI Học Idiom',
      category: 'language',
      description: 'Học idioms tiếng Anh một cách thông minh và hiệu quả. Mỗi phiên học 3 idioms với quiz kiểm tra ngay lập tức.',
      features: [
        'Học 3 idioms mỗi phiên',
        'Quiz kiểm tra ngay lập tức',
        'Theo dõi tiến độ chi tiết',
        'Ví dụ và lưu ý sử dụng',
        'Hệ thống ôn tập thông minh'
      ],
      icon: '🗣️',
      color: 'teal',
      gradient: 'from-teal-100 to-teal-200',
      price: 'Miễn phí',
      popular: true,
      link: '/idiom-learning'
    },
    {
      id: 'speaking-room',
      name: 'AI Speaking Room',
      category: 'language',
      description: 'Luyện nói tiếng Anh tự nhiên với AI coach thông minh. Thực hành conversation theo từng cấp độ với phản hồi tích cực.',
      features: [
        'Conversation thực tế với AI',
        'Nhiều chủ đề và cấp độ khác nhau',
        'Phản hồi tích cực và khuyến khích',
        'Tính năng Voice + Text đồng thời',
        'Điều chỉnh tốc độ giọng nói'
      ],
      icon: '🎤',
      color: 'emerald',
      gradient: 'from-emerald-100 to-emerald-200',
      price: 'Miễn phí',
      popular: true,
      link: '/speaking-room'
    },
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
              <span className="bg-interactive-light text-interactive px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
                7 AI Tools
              </span>
              <span className="bg-surface text-secondary px-3 sm:px-4 py-2 rounded-full text-sm font-medium border border-light">
                Miễn phí thử 7 ngày
              </span>
              <span className="bg-accent text-white px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
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
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "secondary"}
                size="default"
                className="rounded-full"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Grid */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="card-base overflow-hidden relative">
                {tool.popular && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-accent text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Phổ biến
                  </div>
                )}
                
                <div className={`h-40 sm:h-48 bg-gradient-to-br ${tool.gradient} flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">{tool.icon}</div>
                    <h3 className="heading-3 text-primary">{tool.name}</h3>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <p className="body-base text-secondary mb-4">{tool.description}</p>
                  
                  <div className="space-y-2 mb-4 sm:mb-6">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center body-small text-secondary">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg sm:text-xl font-bold text-primary">{tool.price}</div>
                    {tool.price !== 'Miễn phí' && (
                                              <div className="text-xs sm:text-sm text-muted">
                        <span className="line-through">7 ngày miễn phí</span>
                      </div>
                    )}
                  </div>

                                      <div className="space-y-2">
                    {tool.link ? (
                      <Link href={tool.link} className="btn-primary block w-full text-center">
                        {tool.price === 'Miễn phí' ? 'Sử dụng ngay' : 'Dùng thử miễn phí'}
                      </Link>
                    ) : (
                      <Button className="w-full">
                        {tool.price === 'Miễn phí' ? 'Sử dụng ngay' : 'Dùng thử miễn phí'}
                      </Button>
                    )}
                    <Button variant="secondary" className="w-full">
                      Xem chi tiết
                    </Button>
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
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-interactive-light rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-interactive">1</span>
              </div>
              <h3 className="heading-3 text-primary mb-3 sm:mb-4">Chọn AI Tool</h3>
              <p className="body-base text-secondary">
                Chọn AI assistant phù hợp với nhu cầu học tập của bạn từ bộ sưu tập của chúng tôi
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-light">
                <span className="text-xl sm:text-2xl font-bold text-interactive">2</span>
              </div>
              <h3 className="heading-3 text-primary mb-3 sm:mb-4">Tương tác & Học</h3>
              <p className="body-base text-secondary">
                Tương tác với AI thông qua giao diện thân thiện, nhận hướng dẫn và phản hồi cá nhân hóa
              </p>
            </div>

            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="heading-3 text-primary mb-3 sm:mb-4">Theo dõi tiến độ</h3>
              <p className="body-base text-secondary">
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
            <div className="card-base p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="body-base text-secondary mb-3 sm:mb-4">
                &quot;AI Học Từ Vựng giúp tôi nhớ được hơn 500 từ chỉ trong 1 tháng. Phương pháp lặp lại ngắt quãng thực sự hiệu quả!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-interactive-light rounded-full flex items-center justify-center mr-3">
                  <span className="text-xs sm:text-sm font-bold text-interactive">NM</span>
                </div>
                <div>
                  <p className="body-base font-semibold text-primary">Nguyen Minh</p>
                  <p className="body-small text-muted">Sinh viên ĐH Bách Khoa</p>
                </div>
              </div>
            </div>

            <div className="card-base p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="body-base text-secondary mb-3 sm:mb-4">
                &quot;AI Viết CV đã giúp tôi tạo ra một CV ấn tượng và nhận được offer từ Google. Tuyệt vời!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-surface rounded-full flex items-center justify-center mr-3 border border-light">
                  <span className="text-xs sm:text-sm font-bold text-interactive">LT</span>
                </div>
                <div>
                  <p className="body-base font-semibold text-primary">Le Tuan</p>
                  <p className="body-small text-muted">Software Engineer</p>
                </div>
              </div>
            </div>

            <div className="card-base p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="body-base text-secondary mb-3 sm:mb-4">
                &quot;AI Gia Sư như một thầy giáo cá nhân 24/7. Giải thích rất chi tiết và dễ hiểu, phù hợp với tốc độ học của tôi.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center mr-3">
                  <span className="text-xs sm:text-sm font-bold text-white">HN</span>
                </div>
                <div>
                  <p className="body-base font-semibold text-primary">Hoang Nam</p>
                  <p className="body-small text-muted">Học sinh lớp 12</p>
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
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Dùng thử miễn phí
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Xem demo
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 