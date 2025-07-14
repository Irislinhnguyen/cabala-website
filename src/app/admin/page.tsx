'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AdminStats {
  totalCourses: number;
  totalCategories: number;
  totalEnrollments: number;
  coursesWithImages: number;
  coursesNeedingReview: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // This would be an actual API call to get admin stats
      // For now, using mock data
      setTimeout(() => {
        setStats({
          totalCourses: 8,
          totalCategories: 3,
          totalEnrollments: 45,
          coursesWithImages: 5,
          coursesNeedingReview: 3,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const handleMoodleSync = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/moodle/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin_token', // You'd use proper auth
        },
        body: JSON.stringify({ action: 'sync-all' }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Moodle sync completed successfully!');
        fetchStats(); // Refresh stats
      } else {
        alert('Sync failed: ' + result.error);
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Sync failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button 
          onClick={handleMoodleSync}
          disabled={syncing}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {syncing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Syncing...
            </>
          ) : (
            <>
              🔄 Sync Moodle Data
            </>
          )}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <span className="text-2xl">📚</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCourses}</div>
            <p className="text-xs text-gray-600">
              Synced from Moodle
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses with Images</CardTitle>
            <span className="text-2xl">🖼️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.coursesWithImages}</div>
            <p className="text-xs text-gray-600">
              From Moodle overview files
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <span className="text-2xl">📁</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCategories}</div>
            <p className="text-xs text-gray-600">
              Active categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEnrollments}</div>
            <p className="text-xs text-gray-600">
              Active enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
            <span className="text-2xl">⚠️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.coursesNeedingReview}</div>
            <p className="text-xs text-gray-600">
              Courses missing pricing/tags
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moodle Status</CardTitle>
            <span className="text-2xl">🔗</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Connected</div>
            <p className="text-xs text-gray-600">
              Last sync: 2 hours ago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/admin/courses'}
            >
              📚 Manage Course Pricing & Details
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/admin/tags'}
            >
              🏷️ Configure Tag Mappings
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/admin/categories'}
            >
              📁 Organize Categories
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Course "CwC A2+" images synced</span>
                <span className="text-gray-500 text-xs">2h ago</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>New tag mapping created</span>
                <span className="text-gray-500 text-xs">4h ago</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Course pricing updated</span>
                <span className="text-gray-500 text-xs">1d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}