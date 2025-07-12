'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import CourseCard from '@/components/ui/CourseCard';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: string;
}

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

interface Enrollment {
  id: string;
  status: string;
  progress: number;
  enrolledAt: string;
  course: Course;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState({ enrolled: 0, completed: 0, certificates: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Decode token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.userId,
        email: payload.email,
        firstName: payload.name.split(' ')[0],
        lastName: payload.name.split(' ').slice(1).join(' '),
        name: payload.name,
        role: payload.role || 'USER'
      });
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      return;
    }

    // Fetch courses, enrollments and stats
    fetchCourses();
    fetchUserEnrollments();
    fetchUserStats();
  }, []);

  const fetchUserEnrollments = async () => {
    try {
      const response = await fetch('/api/my-enrollments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setEnrollments(data.enrollments);
      }
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/my-enrollments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        const enrolled = data.enrollments.length;
        const completed = data.enrollments.filter((e: { status: string }) => e.status === 'COMPLETED').length;
        const certificates = completed; // For now, certificates = completed courses
        
        setStats({ enrolled, completed, certificates });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses.filter((course: Course) => course.visible));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cabala-neutral flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cabala-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cabala-neutral">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-6">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-cabala-navy">
              Chào mừng, {user?.firstName}!
            </h1>
            <p className="text-neutral-600 mt-1">
              Quản lý khóa học và tiến trình học tập của bạn
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-cabala-orange/10 text-cabala-orange border-cabala-orange">
              {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Học viên'}
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600">Họ tên</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Vai trò</p>
                  <Badge variant="outline" className="text-xs">
                    {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Học viên'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Khóa học đã đăng ký</span>
                  <span className="font-medium">{stats.enrolled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Hoàn thành</span>
                  <span className="font-medium">{stats.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Chứng chỉ</span>
                  <span className="font-medium">{stats.certificates}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Hành động nhanh</CardTitle>
                <CardDescription>
                  Các tính năng thường dùng để quản lý học tập
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className="h-auto p-4 flex flex-col items-center space-y-2" onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Tìm khóa học</span>
                  </Button>
                  <Link href="/my-courses">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 w-full">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>Khóa học của tôi</span>
                    </Button>
                  </Link>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Chứng chỉ</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Enrolled Courses */}
            {enrollments.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Khóa học đã đăng ký</CardTitle>
                  <CardDescription>
                    Các khóa học bạn đã đăng ký và có thể bắt đầu học
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {enrollments.slice(0, 4).map((enrollment) => (
                      <div key={enrollment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-cabala-navy mb-1 line-clamp-2">
                              {enrollment.course.title}
                            </h3>
                            <p className="text-sm text-neutral-600 mb-2">
                              {enrollment.course.instructor}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-neutral-500">
                              <span>Tiến độ: {enrollment.progress}%</span>
                              <span>Trạng thái: {enrollment.status === 'ACTIVE' ? 'Đang học' : enrollment.status}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
                          <div 
                            className="bg-cabala-orange h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-neutral-500">
                            Đăng ký: {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
                          </span>
                          <button
                            onClick={() => {
                              // Navigate to course access
                              window.open(`/api/courses/${enrollment.course.id}/access`, '_blank');
                            }}
                            className="bg-cabala-teal text-white px-4 py-2 text-sm rounded hover:bg-cabala-teal-dark transition-colors"
                          >
                            Tiếp tục học
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {enrollments.length > 4 && (
                    <div className="text-center mt-6">
                      <Link href="/my-courses">
                        <Button variant="outline">
                          Xem tất cả {enrollments.length} khóa học
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Available Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Khóa học có sẵn</CardTitle>
                <CardDescription>
                  Khám phá và đăng ký các khóa học từ Moodle
                </CardDescription>
              </CardHeader>
              <CardContent>
                {courses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-neutral-500">Đang tải khóa học...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {courses.slice(0, 4).map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                )}
                
                {courses.length > 4 && (
                  <div className="text-center mt-6">
                    <Button variant="outline">
                      Xem tất cả {courses.length} khóa học
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}