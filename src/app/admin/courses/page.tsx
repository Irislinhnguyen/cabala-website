'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface AdminCourse {
  id: number;
  title: string;
  shortName: string;
  description: string;
  moodleImageUrl?: string;
  customImagePath?: string;
  price: number;
  currency: string;
  level: string;
  visible: boolean;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  moodleTags: string[];
  customTags: string[];
  overviewFiles?: unknown[];
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<AdminCourse>>({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');
      const data = await response.json();
      
      if (data.success) {
        // Transform the course data for admin use
        const adminCourses = data.courses.map((course: {
          id: number;
          title: string;
          shortName: string;
          description: string;
          courseImage?: string;
          customImagePath?: string;
          price: number;
          currency: string;
          level: string;
          visible: boolean;
          instructor: string;
          rating: number;
          students: number;
          duration: string;
          overviewFiles?: unknown[];
        }) => ({
          id: course.id,
          title: course.title,
          shortName: course.shortName,
          description: course.description,
          moodleImageUrl: course.courseImage,
          customImagePath: course.customImagePath,
          price: course.price,
          currency: course.currency,
          level: course.level,
          visible: course.visible,
          instructor: course.instructor,
          rating: course.rating,
          students: course.students,
          duration: course.duration,
          moodleTags: [], // Would come from Moodle API
          customTags: [], // Would come from database
          overviewFiles: course.overviewFiles,
        }));
        setCourses(adminCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: AdminCourse) => {
    setEditingCourse(course.id);
    setFormData({
      price: course.price,
      currency: course.currency,
      level: course.level,
      instructor: course.instructor,
      duration: course.duration,
      customTags: course.customTags,
    });
  };

  const handleSave = async () => {
    if (!editingCourse) return;

    try {
      const response = await fetch(`/api/courses/${editingCourse}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setCourses(courses.map(course => 
          course.id === editingCourse 
            ? { ...course, ...formData }
            : course
        ));
        
        setEditingCourse(null);
        setFormData({});
        alert('Course updated successfully!');
      } else {
        alert('Failed to save course: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  const handleImageUploaded = (courseId: number, imagePath: string) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, customImagePath: imagePath }
        : course
    ));
  };

  const handleImageRemoved = (courseId: number) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, customImagePath: undefined }
        : course
    ));
  };

  const handleCancel = () => {
    setEditingCourse(null);
    setFormData({});
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchCourses}>
            🔄 Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            ➕ Add Custom Course
          </Button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Course Image */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100">
                    {course.customImagePath ? (
                      <img 
                        src={course.customImagePath} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : course.moodleImageUrl ? (
                      <img 
                        src={course.moodleImageUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="mt-1 text-xs">
                    {course.customImagePath && (
                      <div className="text-blue-600">✓ Custom Image</div>
                    )}
                    {course.overviewFiles && course.overviewFiles.length > 0 && (
                      <div className="text-green-600">✓ {course.overviewFiles.length} files</div>
                    )}
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{course.shortName}</p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant={course.visible ? 'default' : 'secondary'}>
                        {course.visible ? 'Visible' : 'Hidden'}
                      </Badge>
                      {editingCourse === course.id ? (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleSave}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => handleEdit(course)}>
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Course Metadata */}
                  {editingCourse === course.id ? (
                    <div className="space-y-6">
                      {/* Course Image Upload */}
                      <div>
                        <ImageUpload
                          courseId={course.id.toString()}
                          currentImage={course.customImagePath}
                          onImageUploaded={(imagePath) => handleImageUploaded(course.id, imagePath)}
                          onImageRemoved={() => handleImageRemoved(course.id)}
                        />
                      </div>

                      {/* Course Metadata Form */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Price
                          </label>
                          <input
                            type="number"
                            value={formData.price || 0}
                            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Level
                          </label>
                          <select
                            value={formData.level || course.level}
                            onChange={(e) => setFormData({...formData, level: e.target.value})}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Instructor
                          </label>
                          <input
                            type="text"
                            value={formData.instructor || course.instructor}
                            onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={formData.duration || course.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Price:</span>
                        <div className="text-lg font-semibold text-green-600">
                          {course.price === 0 ? 'Free' : `${course.price.toLocaleString()} ${course.currency}`}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Level:</span>
                        <div>{course.level}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Instructor:</span>
                        <div>{course.instructor}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <div>{course.duration}</div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <span>⭐</span>
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>👥</span>
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🏷️</span>
                      <span>{course.customTags.length} tags</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              Sync with Moodle to import courses or add custom courses.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Sync Moodle Courses
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}