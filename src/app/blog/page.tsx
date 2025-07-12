'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: 'Cách AI đang thay đổi cách chúng ta học',
      excerpt: 'Khám phá những ứng dụng thú vị của AI trong giáo dục và cách chúng giúp cá nhân hóa trải nghiệm học tập cho từng học viên.',
      content: 'Artificial Intelligence (AI) đã và đang cách mạng hóa nhiều lĩnh vực, và giáo dục không phải là ngoại lệ...',
      category: 'technology',
      author: 'Nguyễn Văn A',
      authorRole: 'AI Researcher',
      publishedAt: '2024-01-15',
      readTime: '5 phút đọc',
      image: '/api/placeholder/400/250',
      tags: ['AI', 'Giáo dục', 'Công nghệ'],
      featured: true
    },
    {
      id: 2,
      title: '10 mẹo học tập hiệu quả cho người bận rộn',
      excerpt: 'Bạn bận rộn nhưng vẫn muốn học tập? Đây là những mẹo được chứng minh khoa học để tối ưu hóa thời gian học của bạn.',
      content: 'Trong thế giới hiện đại, việc cân bằng giữa công việc, gia đình và học tập là một thách thức lớn...',
      category: 'study',
      author: 'Trần Thị B',
      authorRole: 'Educational Psychologist',
      publishedAt: '2024-01-12',
      readTime: '7 phút đọc',
      image: '/api/placeholder/400/250',
      tags: ['Học tập', 'Phương pháp', 'Hiệu quả'],
      featured: false
    },
    {
      id: 3,
      title: 'Kỹ năng nào cần thiết cho thị trường việc làm 2024?',
      excerpt: 'Phân tích xu hướng tuyển dụng và những kỹ năng hot nhất mà nhà tuyển dụng đang tìm kiếm trong năm 2024.',
      content: 'Thị trường việc làm đang thay đổi nhanh chóng với sự phát triển của công nghệ và AI...',
      category: 'career',
      author: 'Lê Văn C',
      authorRole: 'Career Advisor',
      publishedAt: '2024-01-10',
      readTime: '8 phút đọc',
      image: '/api/placeholder/400/250',
      tags: ['Sự nghiệp', 'Kỹ năng', 'Tuyển dụng'],
      featured: true
    },
    {
      id: 4,
      title: 'Làm thế nào để viết CV ấn tượng với AI',
      excerpt: 'Hướng dẫn chi tiết cách sử dụng AI để tạo ra một CV chuyên nghiệp và thu hút nhà tuyển dụng.',
      content: 'Việc viết CV là một trong những bước quan trọng nhất trong quá trình tìm kiếm việc làm...',
      category: 'career',
      author: 'Phạm Thị D',
      authorRole: 'HR Manager',
      publishedAt: '2024-01-08',
      readTime: '6 phút đọc',
      image: '/api/placeholder/400/250',
      tags: ['CV', 'AI', 'Tuyển dụng'],
      featured: false
    },
    {
      id: 5,
      title: 'Xu hướng học trực tuyến năm 2024',
      excerpt: 'Những xu hướng mới nhất trong học trực tuyến và cách chúng đang định hình lại tương lai của giáo dục.',
      content: 'Học trực tuyến đã trở thành một phần không thể thiếu trong hệ thống giáo dục hiện đại...',
      category: 'education',
      author: 'Hoàng Văn E',
      authorRole: 'EdTech Expert',
      publishedAt: '2024-01-05',
      readTime: '9 phút đọc',
      image: '/api/placeholder/400/250',
      tags: ['Học trực tuyến', 'EdTech', 'Xu hướng'],
      featured: false
    },
    {
      id: 6,
      title: 'Phương pháp học từ vựng hiệu quả với AI',
      excerpt: 'Khám phá cách sử dụng AI để học từ vựng nhanh chóng và nhớ lâu hơn.',
      content: 'Học từ vựng là một trong những thách thức lớn nhất khi học ngoại ngữ...',
      category: 'study',
      author: 'Ngô Thị F',
      authorRole: 'Language Teacher',
      publishedAt: '2024-01-03',
      readTime: '4 phút đọc',
      image: '/api/placeholder/400/250',
      tags: ['Từ vựng', 'AI', 'Ngôn ngữ'],
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', count: blogPosts.length },
    { id: 'technology', name: 'Công nghệ', count: blogPosts.filter(post => post.category === 'technology').length },
    { id: 'study', name: 'Học tập', count: blogPosts.filter(post => post.category === 'study').length },
    { id: 'career', name: 'Sự nghiệp', count: blogPosts.filter(post => post.category === 'career').length },
    { id: 'education', name: 'Giáo dục', count: blogPosts.filter(post => post.category === 'education').length }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header variant="full" />

      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="text-center">
            <h1 className="heading-1 mb-6">
              Blog <span className="text-interactive">Cabala</span>
            </h1>
            <p className="body-large max-w-3xl mx-auto mb-8">
              Khám phá những insight mới nhất về giáo dục, công nghệ AI, và phát triển sự nghiệp. 
              Cập nhật kiến thức từ các chuyên gia hàng đầu trong ngành.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <span className="bg-blue-100 text-blue-800 px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
                Cập nhật hàng tuần
              </span>
              <span className="bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
                Từ chuyên gia
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
                Miễn phí
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20">
        <div className="container-wide">
          <h2 className="heading-2 mb-12">Bài viết nổi bật</h2>
          
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {featuredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 sm:h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Nổi bật
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl mb-2">
                      {post.category === 'technology' ? '🧠' : 
                       post.category === 'career' ? '🎯' : 
                       post.category === 'study' ? '📚' : '🏫'}
                    </div>
                    <div className="text-blue-600 font-semibold capitalize text-sm sm:text-base">{post.category}</div>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-center mb-3 gap-2">
                    <span className="bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium capitalize">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm">{formatDate(post.publishedAt)}</span>
                    <span className="text-gray-500 text-xs sm:text-sm">• {post.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer line-clamp-2">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-gray-600">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{post.author}</p>
                        <p className="text-xs text-gray-500">{post.authorRole}</p>
                      </div>
                    </div>
                    <Link href={`/blog/${post.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Đọc tiếp →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8" style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border-light)' }}>
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-wide">
          <h2 className="heading-2 mb-12">
            {selectedCategory === 'all' ? 'Tất cả bài viết' : `Bài viết về ${categories.find(c => c.id === selectedCategory)?.name}`}
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`h-40 sm:h-48 bg-gradient-to-br ${
                  post.category === 'technology' ? 'from-blue-100 to-blue-200' :
                  post.category === 'career' ? 'from-green-100 to-green-200' :
                  post.category === 'study' ? 'from-purple-100 to-purple-200' :
                  'from-yellow-100 to-yellow-200'
                } flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl mb-2">
                      {post.category === 'technology' ? '🧠' : 
                       post.category === 'career' ? '🎯' : 
                       post.category === 'study' ? '📚' : '🏫'}
                    </div>
                    <div className={`font-semibold capitalize text-sm sm:text-base ${
                      post.category === 'technology' ? 'text-blue-600' :
                      post.category === 'career' ? 'text-green-600' :
                      post.category === 'study' ? 'text-purple-600' :
                      'text-yellow-600'
                    }`}>
                      {post.category}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-center mb-3 gap-2">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium capitalize ${
                      post.category === 'technology' ? 'bg-blue-100 text-blue-600' :
                      post.category === 'career' ? 'bg-green-100 text-green-600' :
                      post.category === 'study' ? 'bg-purple-100 text-purple-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm">{formatDate(post.publishedAt)}</span>
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer line-clamp-2">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-gray-600">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{post.author}</p>
                        <p className="text-xs text-gray-500">{post.readTime}</p>
                      </div>
                    </div>
                    <Link href={`/blog/${post.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Đọc →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-interactive)' }}>
        <div className="container-wide">
          <div className="text-center">
            <h2 className="heading-2 text-white mb-4">
              Đăng ký nhận bài viết mới nhất
            </h2>
            <p className="body-large text-white opacity-90 mb-8 max-w-2xl mx-auto">
              Nhận thông báo khi có bài viết mới về giáo dục, công nghệ AI, và phát triển sự nghiệp
            </p>
            <div className="max-w-md mx-auto">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
                >
                  Đăng ký
                </button>
              </form>
              <p className="text-blue-100 text-xs sm:text-sm mt-3">
                Miễn phí. Không spam. Hủy đăng ký bất kỳ lúc nào.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 