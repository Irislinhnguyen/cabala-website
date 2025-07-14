'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { SpeakingConversationState, SpeakingSettings, VoiceRecognition } from '@/types/speaking-room';
import { Button } from '@/components/ui/Button';
import VoiceControls from './VoiceControls';
import MessageDisplay from './MessageDisplay';

interface SpeakingInterfaceProps {
  conversationState: SpeakingConversationState;
  settings: SpeakingSettings;
  voiceRecognition: VoiceRecognition;
  onSendMessage: (message: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayAudio: (messageId: string) => void;
  onNewConversation: () => void;
  className?: string;
}

export default function SpeakingInterface({
  conversationState,
  settings,
  voiceRecognition,
  onSendMessage,
  onStartRecording,
  onStopRecording,
  onPlayAudio,
  onNewConversation,
  className = ''
}: SpeakingInterfaceProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [conversationState.session?.messages]);

  const handleMessageSubmit = (text: string) => {
    onSendMessage(text);
  };

  const handlePlayMessage = (messageId: string) => {
    onPlayAudio(messageId);
  };

  const isDisabled = conversationState.isRecording || conversationState.isAIResponding || conversationState.isAudioPlaying;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center text-sm text-gray-600">
              <Link href="/ai-assistants" className="hover:text-gray-900 transition-colors">
                AI Assistants
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Speaking Room</span>
            </div>
            
            {/* Mobile Back Button */}
            <div className="lg:hidden">
              <Link 
                href="/ai-assistants"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Category Badge */}
            <div className="hidden sm:flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span className="mr-2">{settings.selectedCategory.icon}</span>
              {settings.selectedCategory.name}
            </div>

            {/* New Conversation Button */}
            <Button
              onClick={onNewConversation}
              variant="outline"
              size="sm"
              disabled={isDisabled}
            >
              New Topic
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        {conversationState.session?.messages.length === 0 ? (
          /* Welcome State */
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">{settings.selectedCategory.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {settings.selectedCategory.name}
              </h3>
              <p className="text-gray-600 mb-6">{settings.selectedCategory.description}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">🎯 Tips for Great Conversations:</h4>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Speak naturally - don't worry about perfect grammar</li>
                  <li>• Share your thoughts and experiences</li>
                  <li>• Ask questions when you're curious</li>
                  <li>• Use the voice settings to match your comfort level</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className="space-y-4">
            {conversationState.session?.messages.map((message) => (
              <MessageDisplay
                key={message.id}
                message={message}
                settings={settings}
                onPlayAudio={(msg) => handlePlayMessage(msg.id)}
                isPlaying={conversationState.isAudioPlaying && conversationState.pendingAudioUrl === message.audioUrl}
              />
            ))}

            {/* AI Typing Indicator */}
            {conversationState.isAIResponding && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🤖</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {conversationState.error && (
        <div className="bg-red-50 border border-red-200 p-3 mx-4">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <span className="text-red-700 text-sm">{conversationState.error}</span>
          </div>
        </div>
      )}

      {/* Voice Controls */}
      <VoiceControls
        isRecording={conversationState.isRecording}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        onTextSubmit={handleMessageSubmit}
        voiceRecognition={voiceRecognition}
        disabled={isDisabled}
      />
    </div>
  );
} 