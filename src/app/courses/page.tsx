'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import CourseCard from '@/components/ui/CourseCard';

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedLevel]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      
      if (data.success) {
        const visibleCourses = data.courses.filter((course: Course) => course.visible);
        setCourses(visibleCourses);
        setFilteredCourses(visibleCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    setFilteredCourses(filtered);
  };

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const levelLabels = {
    'all': 'Tất cả',
    'Beginner': 'Cơ bản',
    'Intermediate': 'Trung bình',
    'Advanced': 'Nâng cao'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cabala-neutral">
        <header className="bg-white border-b border-neutral-200 px-4 py-6">
          <div className="container mx-auto">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Trang chủ
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-cabala-navy">Tất cả khóa học</h1>
                <p className="text-neutral-600 mt-1">Khám phá các khóa học chất lượng cao tại Cabala</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-cabala-orange border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cabala-neutral">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-6">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Trang chủ
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-cabala-navy">Tất cả khóa học</h1>
              <p className="text-neutral-600 mt-1">
                Khám phá {courses.length} khóa học chất lượng cao tại Cabala
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tìm kiếm và lọc khóa học</CardTitle>
            <CardDescription>
              Sử dụng các bộ lọc bên dưới để tìm khóa học phù hợp với bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Search */}
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium text-neutral-700">
                  Tìm kiếm khóa học
                </label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Nhập tên khóa học, mô tả, hoặc tên giảng viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Level Filter */}
              <div className="space-y-2">
                <label htmlFor="level" className="text-sm font-medium text-neutral-700">
                  Cấp độ
                </label>
                <select
                  id="level"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cabala-orange focus:border-transparent"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {levelLabels[level as keyof typeof levelLabels]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-neutral-600">
              Hiển thị {filteredCourses.length} khóa học
              {searchTerm && ` cho "${searchTerm}"`}
              {selectedLevel !== 'all' && ` ở cấp độ ${levelLabels[selectedLevel as keyof typeof levelLabels]}`}
            </div>
          </CardContent>
        </Card>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-cabala-navy mb-2">
                Không tìm thấy khóa học nào
              </h3>
              <p className="text-neutral-600 mb-6">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm kết quả
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLevel('all');
                }}
              >
                Xóa bộ lọc
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {/* CTA Section */}
        {filteredCourses.length > 0 && (
          <Card className="mt-12 bg-gradient-to-r from-cabala-orange to-cabala-teal text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Sẵn sàng bắt đầu hành trình học tập?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Tham gia cộng đồng học viên Cabala và nâng cao kỹ năng của bạn ngay hôm nay
              </p>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-cabala-orange hover:bg-white/90">
                    Truy cập Dashboard
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cabala-orange">
                    Đăng ký tài khoản
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}