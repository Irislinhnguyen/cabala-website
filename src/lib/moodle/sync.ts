// Moodle Course Synchronization
import { prisma } from '@/lib/prisma';
import { MoodleClient } from './client';
import { slugify } from '@/lib/utils';
import fs from 'fs/promises';
import path from 'path';

export class MoodleSyncService {
  private moodleClient: MoodleClient;

  constructor(moodleClient: MoodleClient) {
    this.moodleClient = moodleClient;
  }

  // Download and save image locally
  private async downloadAndSaveImage(
    imageUrl: string, 
    courseId: number, 
    filename: string
  ): Promise<{
    localPath: string;
    mimeType: string;
    fileSize: number;
  } | null> {
    try {
      console.log(`📥 Downloading image: ${filename} for course ${courseId}`);
      
      // Get Moodle credentials for authenticated download
      const baseUrl = process.env.MOODLE_URL;
      const token = process.env.MOODLE_TOKEN;
      
      if (!baseUrl || !token) {
        console.error('❌ Missing Moodle configuration for image download');
        return null;
      }

      // Add token to URL if not already present
      const authenticatedUrl = imageUrl.includes('?') 
        ? `${imageUrl}&token=${token}` 
        : `${imageUrl}?token=${token}`;

      // Fetch the image
      const response = await fetch(authenticatedUrl, {
        headers: {
          'User-Agent': 'Cabala-Website/1.0',
          'Accept': 'image/*,*/*;q=0.8',
        },
      });

      if (!response.ok) {
        console.error(`❌ Failed to download image: ${response.status} ${response.statusText}`);
        return null;
      }

      // Get image data
      const imageBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      
      // Generate safe filename
      const ext = this.getFileExtension(filename, contentType);
      const safeFilename = `course-${courseId}-${Date.now()}${ext}`;
      const relativePath = `course-images/${safeFilename}`;
      const fullPath = path.join(process.cwd(), 'public', relativePath);

      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      // Save the file
      await fs.writeFile(fullPath, Buffer.from(imageBuffer));

      console.log(`✅ Image saved: ${relativePath} (${imageBuffer.byteLength} bytes)`);

      return {
        localPath: `/${relativePath}`, // Store with leading slash for web serving
        mimeType: contentType,
        fileSize: imageBuffer.byteLength,
      };
    } catch (error) {
      console.error(`❌ Error downloading image for course ${courseId}:`, error);
      return null;
    }
  }

  // Get file extension from filename or content type
  private getFileExtension(filename: string, contentType: string): string {
    // Try to get extension from filename first
    const fileExt = path.extname(filename).toLowerCase();
    if (fileExt) return fileExt;

    // Fallback to content type
    switch (contentType.toLowerCase()) {
      case 'image/jpeg':
      case 'image/jpg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'image/gif':
        return '.gif';
      case 'image/webp':
        return '.webp';
      default:
        return '.jpg'; // Default fallback
    }
  }

  // Check if image needs to be updated
  private shouldUpdateImage(
    overviewFile: any, 
    existingLastModified?: Date,
    existingFileSize?: number
  ): boolean {
    if (!existingLastModified || !existingFileSize) {
      return true; // No existing image, need to download
    }

    const moodleLastModified = new Date(overviewFile.timemodified * 1000);
    const moodleFileSize = overviewFile.filesize;

    // Update if Moodle image is newer or different size
    return moodleLastModified > existingLastModified || moodleFileSize !== existingFileSize;
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
      console.log('🔍 Syncing courses with images from Moodle...');
      // Use the new method that includes overview files (images)
      const moodleCourses = await this.moodleClient.getAllCoursesWithImages();
      
      for (const moodleCourse of moodleCourses) {
        // Skip site course (id = 1)
        if (moodleCourse.id === 1) continue;

        // Find matching category
        const categories = await prisma.category.findMany();
        const matchingCategory = categories.find(cat => 
          cat.name.toLowerCase().includes(moodleCourse.categoryid.toString()) ||
          cat.id === moodleCourse.categoryid.toString()
        );

        // Get existing course data for comparison
        const existingCourse = await prisma.course.findUnique({
          where: { moodleCourseId: moodleCourse.id },
          select: {
            localImagePath: true,
            imageLastModified: true,
            imageFileSize: true,
          }
        });

        // Process course images
        const imageData = this.moodleClient.processOverviewFiles(moodleCourse.overviewfiles);
        console.log(`🖼️ Course ${moodleCourse.fullname}:`);
        console.log(`   - Overview files: ${moodleCourse.overviewfiles?.length || 0}`);
        console.log(`   - Processed images: ${imageData.allImages.length}`);
        console.log(`   - Primary image: ${imageData.primaryImage ? 'YES' : 'NO'}`);

        // Download image locally if needed
        let localImageData = null;
        if (imageData.metadata.length > 0) {
          const primaryImageFile = imageData.metadata.find(file => 
            file.mimetype.startsWith('image/') && 
            (file.filename.toLowerCase().includes('course') || 
             file.filename.toLowerCase().includes('overview') ||
             imageData.metadata.length === 1)
          );

          if (primaryImageFile) {
            console.log(`   - Found primary image file: ${primaryImageFile.filename}`);
            
            // Check if we need to update the image
            const shouldUpdate = this.shouldUpdateImage(
              primaryImageFile,
              existingCourse?.imageLastModified,
              existingCourse?.imageFileSize
            );

            if (shouldUpdate) {
              console.log(`   - Downloading new/updated image...`);
              localImageData = await this.downloadAndSaveImage(
                primaryImageFile.fileurl,
                moodleCourse.id,
                primaryImageFile.filename
              );
              
              if (localImageData) {
                console.log(`   - ✅ Image downloaded successfully: ${localImageData.localPath}`);
              } else {
                console.log(`   - ❌ Failed to download image`);
              }
            } else {
              console.log(`   - ⏭️ Image is up to date, skipping download`);
              // Keep existing local image data
              if (existingCourse?.localImagePath) {
                localImageData = {
                  localPath: existingCourse.localImagePath,
                  mimeType: primaryImageFile.mimetype,
                  fileSize: primaryImageFile.filesize,
                };
              }
            }
          }
        }

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
          
          // Course images from Moodle
          moodleImageUrl: imageData.primaryImage,
          overviewFiles: imageData.metadata.length > 0 ? imageData.metadata : null,
          
          // Local image storage
          localImagePath: localImageData?.localPath || existingCourse?.localImagePath,
          imageMimeType: localImageData?.mimeType,
          imageLastModified: localImageData ? 
            new Date(imageData.metadata.find(f => f.mimetype.startsWith('image/'))?.timemodified * 1000) : 
            existingCourse?.imageLastModified,
          imageFileSize: localImageData?.fileSize || existingCourse?.imageFileSize,
          
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
            // Update image data
            moodleImageUrl: courseData.moodleImageUrl,
            overviewFiles: courseData.overviewFiles,
            // Update local image storage
            localImagePath: courseData.localImagePath,
            imageMimeType: courseData.imageMimeType,
            imageLastModified: courseData.imageLastModified,
            imageFileSize: courseData.imageFileSize,
            // SEO fields
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