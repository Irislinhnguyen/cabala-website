// Moodle Course Synchronization
import { prisma } from '@/lib/prisma';
import { MoodleClient } from './client';
import { slugify } from '@/lib/utils';

export class MoodleSyncService {
  private moodleClient: MoodleClient;

  constructor(moodleClient: MoodleClient) {
    this.moodleClient = moodleClient;
  }

  // Sync categories from Moodle to local database
  async syncCategories(): Promise<void> {
    try {
      const moodleCategories = await this.moodleClient.getAllCategories();
      
      for (const moodleCategory of moodleCategories) {
        // Skip root category (id = 0)
        if (moodleCategory.id === 0) continue;

        await prisma.category.upsert({
          where: { slug: slugify(moodleCategory.name) },
          update: {
            name: moodleCategory.name,
            description: moodleCategory.description,
          },
          create: {
            name: moodleCategory.name,
            slug: slugify(moodleCategory.name),
            description: moodleCategory.description,
            sortOrder: moodleCategory.sortorder,
            isActive: moodleCategory.visible === 1,
          },
        });
      }

      console.log(`Synced ${moodleCategories.length} categories from Moodle`);
    } catch (error) {
      console.error('Error syncing categories:', error);
      throw error;
    }
  }

  // Sync courses from Moodle to local database
  async syncCourses(): Promise<void> {
    try {
      const moodleCourses = await this.moodleClient.getAllCourses();
      
      for (const moodleCourse of moodleCourses) {
        // Skip site course (id = 1)
        if (moodleCourse.id === 1) continue;

        // Find matching category
        const categories = await prisma.category.findMany();
        const matchingCategory = categories.find(cat => 
          cat.name.toLowerCase().includes(moodleCourse.categoryid.toString()) ||
          cat.id === moodleCourse.categoryid.toString()
        );

        const courseData = {
          moodleCourseId: moodleCourse.id,
          title: moodleCourse.fullname,
          slug: slugify(moodleCourse.shortname || moodleCourse.fullname),
          description: moodleCourse.summary,
          shortDescription: this.truncateText(moodleCourse.summary, 200),
          language: moodleCourse.lang || 'vi',
          isActive: moodleCourse.visible === 1,
          isVisible: moodleCourse.visible === 1,
          categoryId: matchingCategory?.id || null,
          // Set default pricing - will be updated by admin later
          price: 0,
          currency: 'VND',
          level: 'BEGINNER' as const,
          // SEO fields
          metaTitle: moodleCourse.fullname,
          metaDescription: this.truncateText(moodleCourse.summary, 160),
          keywords: this.extractKeywords(moodleCourse.fullname + ' ' + moodleCourse.summary),
        };

        await prisma.course.upsert({
          where: { moodleCourseId: moodleCourse.id },
          update: {
            title: courseData.title,
            description: courseData.description,
            shortDescription: courseData.shortDescription,
            isActive: courseData.isActive,
            isVisible: courseData.isVisible,
            language: courseData.language,
            metaTitle: courseData.metaTitle,
            metaDescription: courseData.metaDescription,
            keywords: courseData.keywords,
          },
          create: courseData,
        });
      }

      console.log(`Synced ${moodleCourses.length} courses from Moodle`);
    } catch (error) {
      console.error('Error syncing courses:', error);
      throw error;
    }
  }

  // Sync user enrollments from Moodle
  async syncUserEnrollments(userId: string, moodleUserId: number): Promise<void> {
    try {
      const moodleEnrollments = await this.moodleClient.getUserEnrollments(moodleUserId);
      
      for (const enrollment of moodleEnrollments) {
        // Find the local course
        const localCourse = await prisma.course.findUnique({
          where: { moodleCourseId: enrollment.courseid },
        });

        if (!localCourse) {
          console.warn(`Course with Moodle ID ${enrollment.courseid} not found locally`);
          continue;
        }

        // Create or update enrollment
        await prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: userId,
              courseId: localCourse.id,
            },
          },
          update: {
            status: enrollment.status === 0 ? 'ACTIVE' : 'SUSPENDED',
            moodleEnrollmentId: enrollment.id,
          },
          create: {
            userId: userId,
            courseId: localCourse.id,
            status: enrollment.status === 0 ? 'ACTIVE' : 'SUSPENDED',
            moodleEnrollmentId: enrollment.id,
          },
        });
      }

      console.log(`Synced ${moodleEnrollments.length} enrollments for user ${userId}`);
    } catch (error) {
      console.error('Error syncing user enrollments:', error);
      throw error;
    }
  }

  // Enroll user in Moodle course
  async enrollUserInMoodle(userId: string, courseId: string): Promise<void> {
    try {
      // Get user and course data
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const course = await prisma.course.findUnique({ where: { id: courseId } });

      if (!user || !course) {
        throw new Error('User or course not found');
      }

      if (!user.moodleUserId) {
        throw new Error('User is not linked to Moodle');
      }

      // Enroll in Moodle
      await this.moodleClient.enrollUser(course.moodleCourseId, user.moodleUserId);

      // Update local enrollment
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: courseId,
          },
        },
        update: {
          status: 'ACTIVE',
        },
        create: {
          userId: userId,
          courseId: courseId,
          status: 'ACTIVE',
        },
      });

      console.log(`Enrolled user ${userId} in course ${courseId}`);
    } catch (error) {
      console.error('Error enrolling user in Moodle:', error);
      throw error;
    }
  }

  // Update course analytics
  async updateCourseAnalytics(): Promise<void> {
    try {
      const courses = await prisma.course.findMany({
        include: {
          enrollments: true,
          reviews: true,
        },
      });

      for (const course of courses) {
        const enrollmentCount = course.enrollments.length;
        const totalReviews = course.reviews.length;
        const averageRating = totalReviews > 0 
          ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
          : 0;

        await prisma.course.update({
          where: { id: course.id },
          data: {
            enrollmentCount,
            totalReviews,
            averageRating,
          },
        });
      }

      console.log(`Updated analytics for ${courses.length} courses`);
    } catch (error) {
      console.error('Error updating course analytics:', error);
      throw error;
    }
  }

  // Full sync - categories, courses, and analytics
  async fullSync(): Promise<void> {
    console.log('Starting full Moodle synchronization...');
    
    try {
      // Test connection first
      const isConnected = await this.moodleClient.testConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to Moodle');
      }

      // Sync in order
      await this.syncCategories();
      await this.syncCourses();
      await this.updateCourseAnalytics();

      console.log('Full synchronization completed successfully');
    } catch (error) {
      console.error('Full synchronization failed:', error);
      throw error;
    }
  }

  // Helper methods
  private truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  private extractKeywords(text: string): string[] {
    if (!text) return [];
    
    // Simple keyword extraction
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['and', 'or', 'but', 'the', 'is', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word));

    // Remove duplicates and return first 10
    return Array.from(new Set(words)).slice(0, 10);
  }
}

// Factory function
export function createMoodleSyncService(moodleClient: MoodleClient): MoodleSyncService {
  return new MoodleSyncService(moodleClient);
}