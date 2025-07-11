'use client';

import React, { useState, useEffect } from 'react';
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
  visible: boolean;
}

const PopularCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        
        if (data.success) {
          // Show only visible courses, limit to 6 for homepage
          const visibleCourses = data.courses
            .filter((course: Course) => course.visible)
            .slice(0, 6);
          setCourses(visibleCourses);
        } else {
          setError(data.error || 'Failed to load courses');
        }
      } catch (err) {
        setError('Network error - please try again');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-cabala-navy mb-4">
              Khóa học phổ biến
            </h2>
            <p className="text-base sm:text-lg text-neutral-600">
              Đang tải các khóa học từ Moodle...
            </p>
          </div>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-200 h-36 sm:h-40 lg:h-48 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-200 rounded w-full"></div>
                  <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
                    <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-cabala-navy mb-4">
              Khóa học phổ biến
            </h2>
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
              <p className="text-error font-medium mb-2">Không thể tải khóa học</p>
              <p className="text-sm text-neutral-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 text-cabala-orange hover:text-cabala-orange-dark text-sm font-medium touch-manipulation"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-cabala-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cabala-navy mb-3 sm:mb-4">
            Khóa học nổi bật
          </h2>
          <p className="text-base sm:text-lg text-cabala-neutral-600 max-w-2xl mx-auto px-4">
            Khám phá các khóa học phổ biến nhất từ các tổ chức giáo dục hàng đầu thế giới và các chuyên gia trong ngành
          </p>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md mx-auto shadow-sm">
              <p className="text-cabala-neutral-600 mb-2">Chưa có khóa học nào</p>
              <p className="text-sm text-cabala-neutral-500">Vui lòng quay lại sau</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            
            {/* View All Courses Button */}
            <div className="text-center">
              <button className="border border-cabala-blue text-cabala-blue hover:bg-cabala-blue hover:text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition-all touch-manipulation">
                Xem tất cả khóa học
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PopularCourses;