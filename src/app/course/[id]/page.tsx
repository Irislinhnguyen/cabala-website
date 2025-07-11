'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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
  visible: boolean;
}

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      
      if (data.success) {
        const foundCourse = data.courses.find((c: Course) => c.id.toString() === courseId);
        if (foundCourse) {
          setCourse(foundCourse);
        } else {
          setError('Không tìm thấy khóa học');
        }
      } else {
        setError('Không thể tải thông tin khóa học');
      }
    } catch {
      setError('Lỗi mạng - vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    setIsEnrolling(true);
    
    try {
      // Redirect to payment page with course info
      window.location.href = `/payment?courseId=${courseId}&courseName=${encodeURIComponent(course?.title || '')}&price=${course?.price || 0}`;
    } catch (err) {
      console.error('Enrollment error:', err);
      setIsEnrolling(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) {
      return 'Liên hệ để biết giá';
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cabala-neutral flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cabala-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-cabala-neutral flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Lỗi</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-neutral-600 mb-4">{error || 'Không tìm thấy khóa học'}</p>
            <Link href="/dashboard">
              <Button variant="outline">Quay lại dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cabala-neutral">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-cabala-navy">Chi tiết khóa học</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {course.level}
                    </Badge>
                    <CardTitle className="text-2xl text-cabala-navy">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {course.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1 bg-warning/10 rounded-full px-3 py-1">
                    <span className="text-warning text-sm">★</span>
                    <span className="text-sm font-medium text-cabala-navy">{course.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Course Thumbnail */}
                <div className="w-full h-64 bg-gradient-to-r from-cabala-orange to-cabala-teal rounded-lg flex items-center justify-center mb-6">
                  <div className="text-white text-center p-4">
                    <div className="text-xl font-bold mb-2">{course.shortName}</div>
                    <div className="text-sm opacity-90">Khóa học chất lượng cao</div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-cabala-neutral/30 rounded-lg">
                    <svg className="w-8 h-8 mx-auto mb-2 text-cabala-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="font-medium text-cabala-navy">{course.duration}</div>
                    <div className="text-sm text-neutral-600">Thời lượng</div>
                  </div>
                  <div className="text-center p-4 bg-cabala-neutral/30 rounded-lg">
                    <svg className="w-8 h-8 mx-auto mb-2 text-cabala-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div className="font-medium text-cabala-navy">{course.students}</div>
                    <div className="text-sm text-neutral-600">Học viên</div>
                  </div>
                  <div className="text-center p-4 bg-cabala-neutral/30 rounded-lg">
                    <svg className="w-8 h-8 mx-auto mb-2 text-cabala-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="font-medium text-cabala-navy">{course.level}</div>
                    <div className="text-sm text-neutral-600">Cấp độ</div>
                  </div>
                </div>

                {/* Instructor */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-cabala-navy mb-4">Giảng viên</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-cabala-teal rounded-full flex items-center justify-center text-white text-lg font-medium">
                      {course.instructor.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-cabala-navy">{course.instructor}</div>
                      <div className="text-sm text-neutral-600">Chuyên gia giảng dạy tại Cabala</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-center">Đăng ký khóa học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-cabala-orange mb-2">
                    {formatPrice(course.price)}
                  </div>
                  {course.price === 0 && (
                    <div className="text-sm text-neutral-500">Giá sẽ được cập nhật</div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Truy cập trọn đời</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Chứng chỉ hoàn thành</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Hỗ trợ 1-1 với giảng viên</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Cộng đồng học tập</span>
                  </div>
                </div>

                {/* Enroll Button */}
                <Button 
                  className="w-full bg-cabala-orange hover:bg-cabala-orange-dark py-3 text-base font-medium"
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    course.price === 0 ? 'Liên hệ đăng ký' : 'Đăng ký ngay'
                  )}
                </Button>

                {/* Payment Methods */}
                <div className="border-t pt-4">
                  <p className="text-sm text-neutral-600 mb-3">Phương thức thanh toán:</p>
                  <div className="flex justify-center space-x-4">
                    <div className="flex items-center space-x-2 text-xs text-neutral-500">
                      <div className="w-8 h-5 bg-blue-500 rounded text-white text-center text-xs font-bold flex items-center justify-center">VIB</div>
                      <span>Chuyển khoản</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-neutral-500">
                      <div className="w-8 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-white text-center text-xs font-bold flex items-center justify-center">QR</div>
                      <span>QR Code</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}