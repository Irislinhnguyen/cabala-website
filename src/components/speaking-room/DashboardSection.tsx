'use client';

import React from 'react';
import { UserSpeakingProgress, SpeakingCategory } from '@/types/speaking-room';
import { Button } from '@/components/ui/Button';

interface DashboardSectionProps {
  userProgress: UserSpeakingProgress;
  selectedCategory: SpeakingCategory | null;
  onStartConversation: () => void;
  onSelectCategory: () => void;
  onViewSettings: () => void;
}

export default function DashboardSection({
  userProgress,
  selectedCategory,
  onStartConversation,
  onSelectCategory,
  onViewSettings
}: DashboardSectionProps) {
  const formatSpeakingTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Current Category */}
      {selectedCategory ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{selectedCategory.icon}</span>
              <div>
                <h3 className="font-semibold text-blue-900">{selectedCategory.name}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelBadge(selectedCategory.level)}`}>
                  {selectedCategory.level}
                </span>
              </div>
            </div>
          </div>
          <p className="text-blue-700 text-sm mb-4">{selectedCategory.description}</p>
          <div className="flex space-x-2">
            <Button
              onClick={onStartConversation}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start Talking
            </Button>
            <Button
              onClick={onSelectCategory}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Change
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-4xl mb-3">🎤</div>
          <h3 className="font-semibold text-gray-900 mb-2">Ready to Practice?</h3>
          <p className="text-gray-600 text-sm mb-4">Choose a speaking category to get started</p>
          <Button
            onClick={onSelectCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Choose Category
          </Button>
        </div>
      )}

      {/* Progress Stats */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Your Progress</h4>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{userProgress.totalSessions}</div>
            <div className="text-xs text-gray-600">Sessions</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {formatSpeakingTime(userProgress.totalSpeakingTime)}
            </div>
            <div className="text-xs text-gray-600">Speaking</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-600">{userProgress.streakDays}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </div>
        </div>

        {/* Achievements */}
        {userProgress.achievements.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h5 className="font-medium text-yellow-800 mb-2">Recent Achievement</h5>
            <div className="text-sm text-yellow-700">
              🏆 {userProgress.achievements[userProgress.achievements.length - 1]}
            </div>
          </div>
        )}

        {/* Favorite Categories */}
        {userProgress.favoriteCategories.length > 0 && (
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Favorite Topics</h5>
            <div className="flex flex-wrap gap-2">
              {userProgress.favoriteCategories.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Quick Actions</h4>
        <div className="space-y-2">
          <Button
            onClick={onViewSettings}
            variant="outline"
            className="w-full text-left justify-start"
          >
            <span className="mr-2">⚙️</span>
            Voice & Display Settings
          </Button>
          <Button
            variant="outline"
            className="w-full text-left justify-start"
            disabled
          >
            <span className="mr-2">📊</span>
            View Progress Report
            <span className="ml-auto text-xs text-gray-500">Soon</span>
          </Button>
          <Button
            variant="outline"
            className="w-full text-left justify-start"
            disabled
          >
            <span className="mr-2">🎯</span>
            Set Learning Goals
            <span className="ml-auto text-xs text-gray-500">Soon</span>
          </Button>
        </div>
      </div>

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <div className="text-center">
          <div className="text-2xl mb-2">💪</div>
          <h5 className="font-medium text-green-800 mb-1">Keep Going!</h5>
          <p className="text-sm text-green-700">
            Every conversation makes you more confident. You're doing great!
          </p>
        </div>
      </div>
    </div>
  );
} 