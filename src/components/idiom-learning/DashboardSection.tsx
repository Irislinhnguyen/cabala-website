'use client';

import React from 'react';
import Link from 'next/link';
import { UserProgress, SessionStats } from '@/types/idiom-learning';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatRelativeTime, getSessionStats } from '@/lib/idiom-learning';

interface DashboardSectionProps {
  userProgress: UserProgress;
  onStartLearning: () => void;
  onReviewIdioms: () => void;
}

export default function DashboardSection({ 
  userProgress, 
  onStartLearning, 
  onReviewIdioms 
}: DashboardSectionProps) {
  const stats = getSessionStats(userProgress);
  const totalIdioms = 150;
  const progressPercent = Math.round((userProgress.totalIdiomsLearned / totalIdioms) * 100);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Back Navigation */}
      <div className="border-b border-gray-200 pb-4">
        <Link 
          href="/ai-assistants"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Trợ lý AI
        </Link>
        <h3 className="text-lg font-semibold text-gray-900 mt-2">Học Idiom</h3>
      </div>

      {/* Progress Overview - Compact */}
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {userProgress.totalIdiomsLearned}<span className="text-lg text-gray-500">/{totalIdioms}</span>
          </div>
          <p className="text-sm text-gray-600">Idioms đã học</p>
          
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progressPercent}% hoàn thành</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-green-600">{stats.totalSessions}</div>
            <div className="text-xs text-green-600">Phiên học</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-blue-600">{stats.averageScore}%</div>
            <div className="text-xs text-blue-600">Điểm TB</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-orange-600">{stats.streakDays}</div>
            <div className="text-xs text-orange-600">Ngày streak</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={onStartLearning}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3"
        >
          <span className="mr-2">🚀</span>
          Bắt đầu học mới
        </Button>
        
        <Button 
          onClick={onReviewIdioms}
          variant="outline"
          className="w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
          disabled={userProgress.totalIdiomsLearned === 0}
        >
          <span className="mr-2">📖</span>
          Ôn tập idioms
        </Button>
      </div>

      {/* Recent Activity - Minimal */}
      {userProgress.lastSessionDate && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Hoạt động gần đây</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Phiên cuối:</span>
              <span className="text-gray-900">{formatRelativeTime(userProgress.lastSessionDate)}</span>
            </div>
            {userProgress.quizResults.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Quiz cuối:</span>
                <span className={`font-medium ${
                  userProgress.quizResults[userProgress.quizResults.length - 1]?.score >= 80 
                    ? 'text-green-600' 
                    : userProgress.quizResults[userProgress.quizResults.length - 1]?.score >= 60 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
                }`}>
                  {userProgress.quizResults[userProgress.quizResults.length - 1]?.score}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Learning Tips - Minimal */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-purple-900 mb-2 flex items-center">
          💡 Mẹo học hiệu quả
        </h3>
        <ul className="text-xs text-purple-700 space-y-1">
          <li>• Học đều đặn mỗi ngày</li>
          <li>• Tạo câu ví dụ riêng</li>
          <li>• Ôn tập thường xuyên</li>
        </ul>
      </div>

      {/* Achievement Badge */}
      {progressPercent >= 10 && (
        <div className="text-center">
          <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full text-sm">
            <span className="mr-1">🏆</span>
            {progressPercent >= 50 ? 'Chuyên gia Idiom!' : 
             progressPercent >= 25 ? 'Học viên tích cực!' : 
             'Khởi đầu tốt!'}
          </div>
        </div>
      )}
    </div>
  );
} 