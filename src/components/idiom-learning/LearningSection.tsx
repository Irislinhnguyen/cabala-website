'use client';

import React from 'react';
import { Idiom, LearningSession } from '@/types/idiom-learning';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface LearningSectionProps {
  session: LearningSession;
  onNext: () => void;
  onStartQuiz: () => void;
}

export default function LearningSection({ session, onNext, onStartQuiz }: LearningSectionProps) {
  const currentIdiom = session.idioms[session.currentIndex];
  const isLastIdiom = session.currentIndex === session.idioms.length - 1;
  const progress = session.currentIndex + 1;
  const total = session.idioms.length;

  if (!currentIdiom) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">Không có idiom nào để học...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Tiến độ học
          </span>
          <span className="text-sm font-medium text-interactive">
            {progress}/{total}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-interactive h-2 rounded-full transition-all duration-500"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Learning Card */}
      <Card className="mb-8">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {currentIdiom.idiom}
          </CardTitle>
          <div className="w-16 h-1 bg-interactive mx-auto rounded-full" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Meaning */}
          <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 Ý nghĩa
            </h3>
            <p className="text-blue-800 text-base sm:text-lg">
              {currentIdiom.meaning}
            </p>
          </div>

          {/* Example */}
          <div className="bg-green-50 p-4 sm:p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              📝 Ví dụ
            </h3>
            <p className="text-green-800 text-base sm:text-lg italic">
              "{currentIdiom.example}"
            </p>
          </div>

          {/* Usage Note */}
          {currentIdiom.note && (
            <div className="bg-yellow-50 p-4 sm:p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                ⚠️ Lưu ý sử dụng
              </h3>
              <p className="text-yellow-800 text-base sm:text-lg">
                {currentIdiom.note}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center pt-4">
            {!isLastIdiom ? (
              <Button
                onClick={onNext}
                size="lg"
                className="px-8 py-3 text-lg font-medium"
              >
                Tiếp theo →
              </Button>
            ) : (
              <Button
                onClick={onStartQuiz}
                size="lg"
                variant="success"
                className="px-8 py-3 text-lg font-medium bg-green-600 hover:bg-green-700"
              >
                Bắt đầu Quiz! 🎯
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Learning Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">
            💡 Mẹo học tập
          </h3>
          <ul className="space-y-2 text-purple-800">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Đọc to idiom và ý nghĩa để ghi nhớ tốt hơn</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Tạo câu ví dụ riêng của bạn với idiom này</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Kết hợp idiom với tình huống thực tế</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 