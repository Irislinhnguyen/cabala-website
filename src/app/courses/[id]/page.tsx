'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Course {
  id: number;
  title: string;
  shortName: string;
  description: string;
  category: number;
  visible: boolean;
  startDate: number;
  endDate: number;
  format: string;
  courseImage?: string;
  price: number;
  currency: string;
  level: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  language: string;
  enrollmentMethods: string[];
  modules: any[];
  prerequisites: any[];
  learningOutcomes: any[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  // Removed enrollment state - using direct SSO flow

  useEffect(() => {
    if (params.id) {
      fetchCourse(params.id as string);
      checkAuthentication();
    }
  }, [params.id]);

  // Removed enrollment status checking - using direct SSO flow

  const checkAuthentication = () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.userId,
          email: payload.email,
          name: payload.name,
          role: payload.role
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('auth_token');
      }
    }
  };

  // Removed enrollment and access functions - using direct SSO flow

  const fetchCourse = async (courseId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();

      if (data.success) {
        setCourse(data.course);
      } else {
        setError(data.error || 'Failed to load course');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD',
    }).format(price);
  };

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return 'Chưa xác định';
    return new Date(timestamp * 1000).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <header className="border-b px-4 py-6" 
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-light)' }}>
          <div className="container-wide">
            <div className="flex items-center space-x-4">
              <Link href="/courses">
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Quay lại
                </Button>
              </Link>
              <div>
                <h1 className="heading-2">Đang tải...</h1>
              </div>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full"
               style={{ borderColor: 'var(--color-interactive)' }}></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <header className="border-b px-4 py-6" 
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-light)' }}>
          <div className="container-wide">
            <div className="flex items-center space-x-4">
              <Link href="/courses">
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Quay lại
                </Button>
              </Link>
              <div>
                <h1 className="heading-2">Lỗi</h1>
              </div>
            </div>
          </div>
        </header>
        <div className="container-wide py-12">
          <Card className="card-base">
            <CardContent className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: 'var(--color-text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="heading-3 mb-2">
                Không tìm thấy khóa học
              </h3>
              <p className="body-base mb-6">
                {error || 'Khóa học này có thể đã bị xóa hoặc không còn tồn tại'}
              </p>
              <Button onClick={() => router.push('/courses')} className="btn-primary">
                Xem tất cả khóa học
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <header className="border-b px-4 py-6" 
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-light)' }}>
        <div className="container-wide">
          <div className="flex items-center space-x-4">
            <Link href="/courses">
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="heading-2 line-clamp-1">
                {course.title}
              </h1>
              <p className="body-base mt-1">
                Khóa học chi tiết
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container-wide py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <Card className="card-base">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Course Image */}
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden" 
                         style={{ backgroundColor: 'var(--color-interactive-light)' }}>
                      {course.courseImage ? (
                        <img 
                          src={course.courseImage} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center p-4">
                            <div className="text-xl font-bold text-interactive mb-2">{course.shortName}</div>
                            <div className="text-sm text-interactive opacity-80">Khóa học chất lượng</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Level Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="text-white" style={{ backgroundColor: 'var(--color-interactive)' }}>
                        {course.level}
                      </Badge>
                    </div>

                    {/* Popular Badge */}
                    {course.rating >= 4.5 && (
                      <div className="absolute top-3 right-3">
                        <Badge className="text-white" style={{ backgroundColor: 'var(--color-accent-500)' }}>
                          Phổ biến
                        </Badge>
                      </div>
                    )}
                  </div>

                                      {/* Course Info */}
                    <div className="space-y-4">
                      <div>
                        <h1 className="heading-2 mb-2">
                          {course.title}
                        </h1>
                        <p className="body-large text-interactive font-medium">
                          {course.instructor}
                        </p>
                      </div>

                      {/* Rating and Students */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-warning' : 'text-border'}`}
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-secondary font-medium ml-2">{course.rating}</span>
                        </div>
                        <div className="text-secondary">
                          ({course.students.toLocaleString()} học viên)
                        </div>
                      </div>

                                          {/* Course Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-secondary">{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                          </svg>
                          <span className="text-secondary">{course.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-secondary">Bắt đầu: {formatDate(course.startDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-secondary">Kết thúc: {formatDate(course.endDate)}</span>
                        </div>
                      </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle>Mô tả khóa học</CardTitle>
                <CardDescription>
                  Tìm hiểu chi tiết về nội dung và mục tiêu của khóa học
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none text-neutral-700"
                  dangerouslySetInnerHTML={{ 
                    __html: course.description.replace(/\n/g, '<br/>') 
                  }}
                />
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle>Bạn sẽ học được gì</CardTitle>
                <CardDescription>
                  Kỹ năng và kiến thức bạn sẽ đạt được sau khóa học
                </CardDescription>
              </CardHeader>
              <CardContent>
                {course.learningOutcomes.length > 0 ? (
                  <ul className="space-y-2">
                    {course.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-cabala-teal mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-neutral-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-neutral-500">Thông tin mục tiêu học tập sẽ được cập nhật sớm</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Enrollment Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-center">Đăng ký khóa học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-cabala-orange mb-2">
                    {formatPrice(course.price, course.currency)}
                  </div>
                  {course.price > 0 && (
                    <p className="text-sm text-neutral-600">Thanh toán một lần</p>
                  )}
                </div>

                {/* Enrollment Button */}
                {!user ? (
                  <Button 
                    size="lg" 
                    className="w-full bg-cabala-orange hover:bg-cabala-orange-dark"
                    onClick={() => {
                      const returnUrl = encodeURIComponent(window.location.pathname);
                      router.push(`/login?return=${returnUrl}`);
                    }}
                  >
                    Đăng nhập để đăng ký
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      // Direct SSO link - miniOrange handles enrollment and login automatically
                      const authToken = localStorage.getItem('auth_token');
                      if (authToken) {
                        window.location.href = `/api/courses/${course.id}/sso?token=${authToken}`;
                      }
                    }}
                  >
                    Bắt đầu học
                  </Button>
                )}

                {/* Course Info Summary */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Thời lượng</span>
                    <span className="text-sm font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Cấp độ</span>
                    <span className="text-sm font-medium">{course.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Học viên</span>
                    <span className="text-sm font-medium">{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Đánh giá</span>
                    <span className="text-sm font-medium">{course.rating}/5.0</span>
                  </div>
                </div>

                {/* Share */}
                <div className="border-t pt-6">
                  <p className="text-sm text-neutral-600 mb-3">Chia sẻ khóa học</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Removed enrollment modal - using direct SSO flow */}
    </div>
  );
}