'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import CourseCard from '@/components/ui/CourseCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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

  const filterCourses = useCallback(() => {
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
  }, [courses, searchTerm, selectedLevel]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [filterCourses]);

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const levelLabels = {
    'all': 'Tất cả',
    'Beginner': 'Cơ bản',
    'Intermediate': 'Trung bình',
    'Advanced': 'Nâng cao'
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Header 
          variant="simple" 
          title="Tất cả khóa học"
          description="Khám phá các khóa học chất lượng cao tại Cabala"
          backUrl="/"
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
      <Header variant="full" />

      {/* Page Title Section */}
      <section className="py-12" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="text-center">
            <h1 className="heading-1 mb-4">Tất cả khóa học</h1>
            <p className="body-large max-w-3xl mx-auto">
              Khám phá {courses.length} khóa học chất lượng cao tại Cabala
            </p>
          </div>
        </div>
      </section>

      <div className="container-wide py-8">
        {/* Filters */}
        <Card className="card-base mb-8">
          <CardHeader>
            <CardTitle className="heading-3">Tìm kiếm và lọc khóa học</CardTitle>
            <CardDescription>
              Sử dụng các bộ lọc bên dưới để tìm khóa học phù hợp với bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Search */}
              <div className="space-y-2">
                <label htmlFor="search" className="label-base">
                  Tìm kiếm khóa học
                </label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Nhập tên khóa học, mô tả, hoặc tên giảng viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-base"
                />
              </div>

              {/* Level Filter */}
              <div className="space-y-2">
                <label htmlFor="level" className="label-base">
                  Cấp độ
                </label>
                <select
                  id="level"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                  style={{ 
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)'
                  }}
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
            <div className="mt-4 body-small">
              Hiển thị {filteredCourses.length} khóa học
              {searchTerm && ` cho "${searchTerm}"`}
              {selectedLevel !== 'all' && ` ở cấp độ ${levelLabels[selectedLevel as keyof typeof levelLabels]}`}
            </div>
          </CardContent>
        </Card>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <Card className="card-base">
            <CardContent className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: 'var(--color-text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="heading-3 mb-2">
                Không tìm thấy khóa học nào
              </h3>
              <p className="body-base mb-6">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {/* CTA Section */}
        {filteredCourses.length > 0 && (
          <Card className="mt-12 card-base" style={{ backgroundColor: 'var(--color-interactive)' }}>
            <CardContent className="p-8 text-center">
              <h3 className="heading-2 mb-4 text-white">
                Sẵn sàng bắt đầu hành trình học tập?
              </h3>
              <p className="body-large mb-6 text-white opacity-90">
                Tham gia cộng đồng học viên Cabala và nâng cao kỹ năng của bạn ngay hôm nay
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-gray-100 transition-colors"
                  >
                    Truy cập Dashboard
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-primary transition-colors"
                  >
                    Đăng ký tài khoản
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