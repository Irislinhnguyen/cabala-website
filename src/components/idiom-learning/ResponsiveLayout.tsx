'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserProgress, UIView } from '@/types/idiom-learning';
import ChatInterface from './ChatInterface';
import DashboardSection from './DashboardSection';
import { Button } from '@/components/ui/Button';

interface ResponsiveLayoutProps {
  userProgress: UserProgress;
  conversationState: any;
  onSendMessage: (message: string) => void;
  onStartNewSession: () => void;
  onStartLearning: () => void;
  onReviewIdioms: () => void;
}

export default function ResponsiveLayout({
  userProgress,
  conversationState,
  onSendMessage,
  onStartNewSession,
  onStartLearning,
  onReviewIdioms
}: ResponsiveLayoutProps) {
  const [currentView, setCurrentView] = useState<UIView>('chat');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const handleViewChange = (view: UIView) => {
    setCurrentView(view);
    if (view === 'dashboard') {
      setIsDashboardOpen(true);
    }
  };

  const closeDashboard = () => {
    setIsDashboardOpen(false);
    setCurrentView('chat');
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center">
          <Link 
            href="/ai-assistants"
            className="mr-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Học Idiom với AI</h1>
        </div>
        <Button
          onClick={() => handleViewChange('dashboard')}
          variant="outline"
          className="text-sm"
        >
          📊 Dashboard
        </Button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 h-full">
        {/* Dashboard Sidebar - Left Side */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <DashboardSection
              userProgress={userProgress}
              onStartLearning={onStartLearning}
              onReviewIdioms={onReviewIdioms}
            />
          </div>
        </div>

        {/* Chat Interface - Right Side */}
        <div className="flex-1 flex flex-col">
          <ChatInterface
            conversationState={conversationState}
            onSendMessage={onSendMessage}
            onStartNewSession={onStartNewSession}
            className="h-full"
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
        {/* Chat Interface - Mobile */}
        <div className="flex-1">
          <ChatInterface
            conversationState={conversationState}
            onSendMessage={onSendMessage}
            onStartNewSession={onStartNewSession}
            className="h-full"
          />
        </div>

        {/* Dashboard Modal - Mobile */}
        {isDashboardOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white rounded-t-lg w-full max-h-[85vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
                <Button
                  onClick={closeDashboard}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 flex-1 overflow-y-auto">
                <DashboardSection
                  userProgress={userProgress}
                  onStartLearning={() => {
                    onStartLearning();
                    closeDashboard();
                  }}
                  onReviewIdioms={() => {
                    onReviewIdioms();
                    closeDashboard();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Dashboard Button - Mobile Alternative */}
      {!isDashboardOpen && (
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => handleViewChange('dashboard')}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
          >
            📊
          </Button>
        </div>
      )}
    </div>
  );
} 