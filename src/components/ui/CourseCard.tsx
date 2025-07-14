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
  courseImage?: string;
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

  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-200 overflow-hidden h-full card-base',
      className
    )}>
      {/* Course Thumbnail */}
      <div className="relative h-36 sm:h-40 overflow-hidden" 
           style={{ backgroundColor: 'var(--color-surface)' }}>
        <style jsx>{`
          .placeholder-fallback {
            background: linear-gradient(135deg, #E55A2B 0%, #2C3E50 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
          }
          .placeholder-fallback::after {
            content: '${course.shortName || course.title}';
          }
        `}</style>
        {(course.courseImage || course.thumbnail) ? (
          // Use regular img tag for all images to avoid Next.js restrictions
          <img 
            src={`${course.courseImage || course.thumbnail}${(course.courseImage || course.thumbnail).includes('?') ? '&' : '?'}v=${Date.now()}`} 
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const imageUrl = course.courseImage || course.thumbnail;
              console.error('❌ Course image failed to load:', {
                courseId: course.id,
                courseTitle: course.title,
                imageUrl: imageUrl,
                isProxyUrl: imageUrl?.startsWith('/api/moodle/image/'),
                timestamp: new Date().toISOString()
              });
              // Fallback to CSS gradient if image fails
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.classList.add('placeholder-fallback');
              }
            }}
            onLoad={() => {
              const imageUrl = course.courseImage || course.thumbnail;
              console.log('✅ Course image loaded successfully:', {
                courseId: course.id,
                courseTitle: course.title,
                imageUrl: imageUrl,
                isProxyUrl: imageUrl?.startsWith('/api/moodle/image/'),
                timestamp: new Date().toISOString()
              });
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br flex items-center justify-center"
               style={{ 
                 background: `linear-gradient(135deg, var(--color-interactive-light) 0%, var(--color-primary-100) 100%)` 
               }}>
            <div className="text-center p-3 sm:p-4">
              <div className="text-base sm:text-lg font-bold mb-1"
                   style={{ color: 'var(--color-interactive)' }}>
                {course.shortName}
              </div>
              <div className="text-xs sm:text-sm opacity-80"
                   style={{ color: 'var(--color-interactive)' }}>
                Khóa học chất lượng
              </div>
            </div>
          </div>
        )}
        
        {/* Level Badge */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <Badge 
            variant="secondary" 
            className="text-white text-xs font-medium px-2 py-1"
            style={{ backgroundColor: 'var(--color-interactive)' }}
          >
            {course.level}
          </Badge>
        </div>

        {/* Popular Badge (Orange điểm nhấn) */}
        {course.rating >= 4.5 && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <Badge className="text-white text-xs font-medium px-2 py-1"
                   style={{ backgroundColor: 'var(--color-accent-500)' }}>
              Phổ biến
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="p-3 sm:p-4 pb-2">
        <div className="space-y-2">
          {/* Course Title */}
          <h3 className="text-sm sm:text-base font-semibold leading-tight transition-colors line-clamp-2"
              style={{ color: 'var(--color-text-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-interactive)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}>
            {course.title}
          </h3>

          {/* Instructor */}
          <p className="text-xs sm:text-sm font-medium"
             style={{ color: 'var(--color-text-secondary)' }}>
            {course.instructor}
          </p>

          {/* Rating and Students */}
          <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className="w-3 h-3"
                    style={{ color: i < Math.floor(course.rating) ? 'var(--color-accent-500)' : 'var(--color-border)' }}
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {course.rating}
              </span>
            </div>
            <div className="truncate" style={{ color: 'var(--color-text-muted)' }}>
              ({course.students.toLocaleString()})
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center space-x-1 text-xs sm:text-sm"
               style={{ color: 'var(--color-text-secondary)' }}>
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
              <div className="text-base sm:text-lg font-bold"
                   style={{ color: 'var(--color-interactive)' }}>
                Miễn phí
              </div>
            ) : (
              <div className="text-base sm:text-lg font-bold truncate"
                   style={{ color: 'var(--color-text-primary)' }}>
                {formatPrice(course.price)}
              </div>
            )}
          </div>

          {/* Enroll Button */}
          <Link href={`/courses/${course.id}`}>
            <Button 
              size="sm" 
              className="btn-primary font-medium px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap touch-manipulation"
            >
              Xem chi tiết
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;