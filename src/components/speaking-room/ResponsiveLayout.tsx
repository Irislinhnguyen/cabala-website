'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserSpeakingProgress, 
  SpeakingConversationState, 
  SpeakingSettings,
  SpeakingCategory,
  SpeakingUIView,
  VoiceRecognition
} from '@/types/speaking-room';
import { Button } from '@/components/ui/Button';
import SpeakingInterface from './SpeakingInterface';
import DashboardSection from './DashboardSection';
import CategorySelector from './CategorySelector';
import SettingsPanel from './SettingsPanel';

interface ResponsiveLayoutProps {
  userProgress: UserSpeakingProgress;
  conversationState: SpeakingConversationState;
  settings: SpeakingSettings;
  voiceRecognition: VoiceRecognition;
  selectedCategory: SpeakingCategory | null;
  onSendMessage: (message: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayAudio: (messageId: string) => void;
  onNewConversation: () => void;
  onCategorySelect: (category: SpeakingCategory) => void;
  onStartConversation: () => void;
  onSettingsChange: (settings: Partial<SpeakingSettings>) => void;
}

export default function ResponsiveLayout({
  userProgress,
  conversationState,
  settings,
  voiceRecognition,
  selectedCategory,
  onSendMessage,
  onStartRecording,
  onStopRecording,
  onPlayAudio,
  onNewConversation,
  onCategorySelect,
  onStartConversation,
  onSettingsChange
}: ResponsiveLayoutProps) {
  const [currentView, setCurrentView] = useState<SpeakingUIView>('chat');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewChange = (view: SpeakingUIView) => {
    setCurrentView(view);
    if (view !== 'chat') {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentView('chat');
  };

  const handleCategorySelection = (category: SpeakingCategory) => {
    onCategorySelect(category);
    if (isModalOpen) {
      closeModal();
    }
  };

  const handleStartConversation = () => {
    onStartConversation();
    if (isModalOpen) {
      closeModal();
    }
  };

  const hasActiveSession = conversationState.session && conversationState.session.messages.length > 0;

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
          <h1 className="text-xl font-bold text-gray-900">Speaking Room</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handleViewChange('settings')}
            variant="outline"
            size="sm"
          >
            ⚙️
          </Button>
          <Button
            onClick={() => handleViewChange('categories')}
            variant="outline"
            size="sm"
          >
            📂
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 h-full">
        {/* Dashboard Sidebar - Left Side */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Speaking Room</h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <DashboardSection
              userProgress={userProgress}
              selectedCategory={selectedCategory}
              onStartConversation={onStartConversation}
              onSelectCategory={() => handleViewChange('categories')}
              onViewSettings={() => handleViewChange('settings')}
            />
          </div>
        </div>

        {/* Main Content - Right Side */}
        <div className="flex-1 flex flex-col">
          {hasActiveSession ? (
            <SpeakingInterface
              conversationState={conversationState}
              settings={settings}
              voiceRecognition={voiceRecognition}
              onSendMessage={onSendMessage}
              onStartRecording={onStartRecording}
              onStopRecording={onStopRecording}
              onPlayAudio={onPlayAudio}
              onNewConversation={onNewConversation}
              className="h-full"
            />
          ) : (
            /* Category Selection for Desktop */
            <div className="flex-1 p-6 overflow-y-auto">
              <CategorySelector
                selectedCategory={selectedCategory}
                onCategorySelect={onCategorySelect}
                onStartConversation={onStartConversation}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
        {hasActiveSession ? (
          <SpeakingInterface
            conversationState={conversationState}
            settings={settings}
            voiceRecognition={voiceRecognition}
            onSendMessage={onSendMessage}
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
            onPlayAudio={onPlayAudio}
            onNewConversation={onNewConversation}
            className="h-full"
          />
        ) : (
          /* Mobile Category Selection */
          <div className="flex-1 p-4 overflow-y-auto">
            <CategorySelector
              selectedCategory={selectedCategory}
              onCategorySelect={onCategorySelect}
              onStartConversation={onStartConversation}
            />
          </div>
        )}

        {/* Mobile Modals */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white rounded-t-lg w-full max-h-[85vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentView === 'categories' ? 'Choose Category' : 'Settings'}
                </h2>
                <Button
                  onClick={closeModal}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 flex-1 overflow-y-auto">
                {currentView === 'categories' ? (
                  <CategorySelector
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelection}
                    onStartConversation={handleStartConversation}
                  />
                ) : currentView === 'settings' ? (
                  <SettingsPanel
                    settings={settings}
                    onSettingsChange={onSettingsChange}
                    onClose={closeModal}
                  />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Buttons - Mobile */}
      {!isModalOpen && hasActiveSession && (
        <div className="lg:hidden fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
          <Button
            onClick={() => handleViewChange('settings')}
            className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 text-white shadow-lg"
          >
            ⚙️
          </Button>
          <Button
            onClick={() => handleViewChange('categories')}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            📂
          </Button>
        </div>
      )}
    </div>
  );
} 