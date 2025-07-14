'use client';

import React from 'react';
import { SpeakingCategory } from '@/types/speaking-room';
import { speakingCategories } from '@/data/speaking-categories';
import { Button } from '@/components/ui/Button';

interface CategorySelectorProps {
  selectedCategory: SpeakingCategory | null;
  onCategorySelect: (category: SpeakingCategory) => void;
  onStartConversation: () => void;
}

export default function CategorySelector({
  selectedCategory,
  onCategorySelect,
  onStartConversation
}: CategorySelectorProps) {
  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradient = (color: string) => {
    switch (color) {
      case 'green': return 'from-green-100 to-green-200';
      case 'blue': return 'from-blue-100 to-blue-200';
      case 'red': return 'from-red-100 to-red-200';
      case 'purple': return 'from-purple-100 to-purple-200';
      case 'teal': return 'from-teal-100 to-teal-200';
      case 'indigo': return 'from-indigo-100 to-indigo-200';
      default: return 'from-gray-100 to-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Speaking Practice</h2>
        <p className="text-gray-600">Select a category to start practicing conversation with AI</p>
      </div>

      <div className="grid gap-4">
        {speakingCategories.map((category) => (
          <div
            key={category.id}
            className={`relative rounded-lg border transition-all cursor-pointer ${
              selectedCategory?.id === category.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            } ${!category.isAvailable ? 'opacity-50' : ''}`}
            onClick={() => category.isAvailable && onCategorySelect(category)}
          >
            {!category.isAvailable && (
              <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Coming Soon
              </div>
            )}
            
            <div className={`h-20 bg-gradient-to-br ${getGradient(category.color)} rounded-t-lg flex items-center justify-center`}>
              <div className="text-center">
                <div className="text-3xl mb-1">{category.icon}</div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(category.level)}`}>
                  {category.level}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{category.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">
                {selectedCategory.icon} {selectedCategory.name}
              </h4>
              <p className="text-blue-700 text-sm">{selectedCategory.description}</p>
            </div>
            <Button
              onClick={onStartConversation}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start Talking
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 