'use client';

import React, { useState } from 'react';
import { QuizQuestion, QuizResult } from '@/types/idiom-learning';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (result: QuizResult) => void;
  onBackToDashboard: () => void;
}

export default function QuizSection({ questions, onComplete, onBackToDashboard }: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = currentQuestionIndex + 1;
  const total = questions.length;

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate and show result
      const correctAnswers: string[] = [];
      const wrongAnswers: string[] = [];
      
      questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswer) {
          correctAnswers.push(question.id);
        } else {
          wrongAnswers.push(question.id);
        }
      });
      
      const score = Math.round((correctAnswers.length / questions.length) * 100);
      
      const result: QuizResult = {
        sessionId: `quiz-${Date.now()}`,
        score,
        totalQuestions: questions.length,
        correctAnswers,
        wrongAnswers,
        completedAt: new Date(),
      };
      
      setQuizResult(result);
      setShowResult(true);
      onComplete(result);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Xuất sắc! 🎉';
    if (score >= 60) return 'Tốt! 👍';
    return 'Cần cải thiện! 💪';
  };

  if (showResult && quizResult) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Kết quả Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl mb-4">
              {quizResult.score >= 80 ? '🎉' : quizResult.score >= 60 ? '👍' : '💪'}
            </div>
            
            <div className="space-y-4">
              <div className={`text-4xl font-bold ${getScoreColor(quizResult.score)}`}>
                {quizResult.score}%
              </div>
              <div className="text-xl text-gray-600">
                {getScoreMessage(quizResult.score)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {quizResult.correctAnswers.length}
                </div>
                <div className="text-green-800">Câu đúng</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {quizResult.wrongAnswers.length}
                </div>
                <div className="text-red-800">Câu sai</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                onClick={onBackToDashboard}
                size="lg"
                variant="secondary"
                className="px-8 py-3"
              >
                Về Dashboard
              </Button>
              <Button
                onClick={() => window.location.reload()}
                size="lg"
                className="px-8 py-3"
              >
                Học tiếp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Tiến độ Quiz
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

      {/* Quiz Question */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
            Ý nghĩa của "{currentQuestion.idiom}" là gì?
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedAnswers[currentQuestionIndex] === option
                  ? 'border-interactive bg-blue-50 text-interactive'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-base sm:text-lg">{option}</span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          variant="secondary"
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2"
        >
          ← Trước
        </Button>
        
        <span className="text-sm text-gray-500">
          Câu {currentQuestionIndex + 1} / {questions.length}
        </span>
        
        <Button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestionIndex]}
          className="px-6 py-2"
        >
          {isLastQuestion ? 'Hoàn thành' : 'Tiếp theo →'}
        </Button>
      </div>
    </div>
  );
} 