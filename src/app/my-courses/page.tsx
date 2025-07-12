'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Enrollment {
  id: string;
  status: string;
  progress: number;
  createdAt: string;
  course: {
    id: string;
    title: string;
    description: string;
    level: string;
    duration: string;
    instructor: string;
  };
  payment?: {
    status: string;
    amount: number;
    createdAt: string;
  };
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetchMyEnrollments();
  }, []);

  const fetchMyEnrollments = async () => {
    try {
      const response = await fetch('/api/my-enrollments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setEnrollments(data.enrollments);
      } else {
        setError(data.error || 'Không thể tải danh sách khóa học');
      }
    } catch {
      setError('Lỗi mạng - vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'PENDING': { label: 'Đang chờ duyệt', variant: 'secondary' as const },
      'ACTIVE': { label: 'Đang học', variant: 'default' as const },
      'COMPLETED': { label: 'Hoàn thành', variant: 'outline' as const },
      'SUSPENDED': { label: 'Tạm dừng', variant: 'secondary' as const },
      'CANCELLED': { label: 'Đã hủy', variant: 'secondary' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      'PENDING': { label: 'Chờ xác nhận', variant: 'secondary' as const, color: 'text-yellow-600' },
      'PAID': { label: 'Đã thanh toán', variant: 'outline' as const, color: 'text-blue-600' },
      'VERIFIED': { label: 'Đã xác nhận', variant: 'default' as const, color: 'text-green-600' },
      'REJECTED': { label: 'Bị từ chối', variant: 'secondary' as const, color: 'text-red-600' },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const, color: 'text-gray-600' };
    return <Badge variant={statusInfo.variant} className={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Header 
          variant="simple" 
          title="Khóa học của tôi"
          backUrl="/dashboard"
        />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full"
               style={{ borderColor: 'var(--color-interactive)' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header 
        variant="simple" 
        title="Khóa học của tôi"
        description="Quản lý các khóa học đã đăng ký"
        backUrl="/dashboard"
      />

      <div className="container-wide py-8">
        {error && (
          <Card className="card-base mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-error mb-4">{error}</p>
                <Button onClick={fetchMyEnrollments} variant="outline">
                  Thử lại
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {enrollments.length === 0 && !error ? (
          <Card className="card-base">
            <CardContent className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: 'var(--color-text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="heading-3 mb-2">Chưa có khóa học nào</h3>
              <p className="body-base mb-6">Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học tuyệt vời của chúng tôi!</p>
              <Link href="/courses">
                <Button className="btn-primary">
                  Khám phá khóa học
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id} className="card-base overflow-hidden">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <CardTitle className="heading-3">
                          {enrollment.course.title}
                        </CardTitle>
                        {getStatusBadge(enrollment.status)}
                      </div>
                      <CardDescription className="body-base">
                        {enrollment.course.description}
                      </CardDescription>
                    </div>
                    <div className="text-left lg:text-right">
                      {enrollment.payment && (
                        <div className="space-y-1">
                          {getPaymentStatusBadge(enrollment.payment.status)}
                          <div className="body-small">
                            {formatPrice(enrollment.payment.amount)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid lg:grid-cols-4 gap-6">
                    {/* Course Info */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="body-small">Cấp độ:</span>
                          <div className="font-medium">{enrollment.course.level}</div>
                        </div>
                        <div>
                          <span className="body-small">Thời lượng:</span>
                          <div className="font-medium">{enrollment.course.duration}</div>
                        </div>
                        <div>
                          <span className="body-small">Giảng viên:</span>
                          <div className="font-medium">{enrollment.course.instructor}</div>
                        </div>
                        <div>
                          <span className="body-small">Đăng ký:</span>
                          <div className="font-medium">
                            {new Date(enrollment.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="body-small">Tiến độ:</span>
                        <span className="font-medium">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--color-border-light)' }}>
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${enrollment.progress}%`,
                            backgroundColor: 'var(--color-interactive)' 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      {enrollment.status === 'ACTIVE' && (
                        <Button className="btn-primary">
                          Tiếp tục học
                        </Button>
                      )}
                      {enrollment.status === 'PENDING' && (
                        <Button variant="outline" disabled>
                          Chờ xác nhận thanh toán
                        </Button>
                      )}
                      {enrollment.status === 'COMPLETED' && (
                        <Button variant="outline">
                          Xem chứng chỉ
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        Chi tiết khóa học
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        {enrollments.length > 0 && (
          <Card className="mt-12 card-base" style={{ backgroundColor: 'var(--color-interactive)' }}>
            <CardContent className="p-8 text-center">
              <h3 className="heading-2 mb-4 text-white">
                Tiếp tục khám phá thêm
              </h3>
              <p className="body-large mb-6 text-white opacity-90">
                Mở rộng kiến thức với những khóa học mới và thú vị
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-gray-100 transition-colors"
                  >
                    Khám phá khóa học
                  </Button>
                </Link>
                <Link href="/ai-assistants">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-primary transition-colors"
                  >
                    Trợ lý AI
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  );
}