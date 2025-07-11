import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { cn } from '@/lib/utils';

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

interface CourseCardProps {
  course: Course;
  className?: string;
}

const CourseCard = ({ course, className }: CourseCardProps) => {
  const formatPrice = (price: number) => {
    if (price === 0) {
      return 'Liên hệ để biết giá';
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-200 overflow-hidden border border-cabala-neutral-200 bg-white h-full',
      className
    )}>
      {/* Course Thumbnail */}
      <div className="relative h-36 sm:h-40 overflow-hidden bg-cabala-blue-50">
        <div className="w-full h-full bg-gradient-to-br from-cabala-blue-100 to-cabala-blue-200 flex items-center justify-center">
          <div className="text-center p-3 sm:p-4">
            <div className="text-base sm:text-lg font-bold text-cabala-blue mb-1">{course.shortName}</div>
            <div className="text-xs sm:text-sm text-cabala-blue-600 opacity-80">Khóa học chất lượng</div>
          </div>
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <Badge 
            variant="secondary" 
            className="bg-cabala-blue text-white text-xs font-medium px-2 py-1"
          >
            {course.level}
          </Badge>
        </div>

        {/* Popular Badge (Orange điểm nhấn) */}
        {course.rating >= 4.5 && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <Badge className="bg-cabala-orange text-white text-xs font-medium px-2 py-1">
              Phổ biến
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="p-3 sm:p-4 pb-2">
        <div className="space-y-2">
          {/* Course Title */}
          <h3 className="text-sm sm:text-base font-semibold text-cabala-navy leading-tight group-hover:text-cabala-blue transition-colors line-clamp-2">
            {course.title}
          </h3>

          {/* Instructor */}
          <p className="text-xs sm:text-sm text-cabala-neutral-600 font-medium">
            {course.instructor}
          </p>

          {/* Rating and Students */}
          <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(course.rating) ? 'text-warning' : 'text-cabala-neutral-300'}`}
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-cabala-neutral-600 font-medium">{course.rating}</span>
            </div>
            <div className="text-cabala-neutral-500 truncate">
              ({course.students.toLocaleString()})
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center space-x-1 text-xs sm:text-sm text-cabala-neutral-600">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate">{course.duration}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 pt-2 mt-auto">
        <div className="flex items-center justify-between gap-2">
          {/* Price */}
          <div className="space-y-1 flex-1 min-w-0">
            {course.price === 0 ? (
              <div className="text-base sm:text-lg font-bold text-cabala-blue">Miễn phí</div>
            ) : (
              <div className="text-base sm:text-lg font-bold text-cabala-navy truncate">
                {formatPrice(course.price)}
              </div>
            )}
          </div>

          {/* Enroll Button */}
          <Link href={`/course/${course.id}`}>
            <Button 
              size="sm" 
              className="bg-cabala-blue hover:bg-cabala-blue-dark text-white font-medium px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap touch-manipulation"
            >
              Đăng ký ngay
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;