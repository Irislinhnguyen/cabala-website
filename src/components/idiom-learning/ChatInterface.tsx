'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType, ChatSession, AIConversationState } from '@/types/idiom-learning';
import { Button } from '@/components/ui/Button';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface ChatInterfaceProps {
  conversationState: AIConversationState;
  onSendMessage: (message: string) => void;
  onStartNewSession: () => void;
  className?: string;
}

export default function ChatInterface({ 
  conversationState, 
  onSendMessage, 
  onStartNewSession,
  className = ''
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive - ONLY within chat container
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const height = container.clientHeight;
      const maxScrollTop = scrollHeight - height;
      
      // Smooth scroll to bottom within the container only
      container.scrollTo({
        top: maxScrollTop,
        behavior: 'smooth'
      });
    }
  }, [conversationState.session?.messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !conversationState.isTyping) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">AI</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Trợ lý học Idiom</h3>
              <p className="text-sm text-gray-500">
                {conversationState.session?.isActive ? 'Đang học' : 'Sẵn sàng học'}
              </p>
            </div>
          </div>
          
          {conversationState.session?.isActive && (
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Vòng {conversationState.session.currentRound === 'vocab' ? '1' : 
                     conversationState.session.currentRound === 'exercise' ? '2' : 
                     conversationState.session.currentRound === 'creation' ? '3' : 'Hoàn thành'}
              </p>
              {conversationState.session.currentIdiom && (
                <p className="text-xs text-gray-400 max-w-32 truncate">
                  {conversationState.session.currentIdiom.idiom}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area - Fixed container with proper scrolling */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {!conversationState.session?.isActive ? (
          // Welcome state
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chào mừng bạn đến với trợ lý học Idiom!
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Tôi sẽ giúp bạn học idioms tiếng Anh qua 3 vòng: Từ vựng, Bài tập, và Tạo câu. 
              Bạn có sẵn sàng bắt đầu không?
            </p>
            <Button 
              onClick={onStartNewSession}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Bắt đầu học
            </Button>
          </div>
        ) : (
          // Chat messages
          <>
            {conversationState.session.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
              />
            ))}
            
            {conversationState.isTyping && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      {conversationState.session?.isActive && (
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu trả lời của bạn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={conversationState.isTyping}
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || conversationState.isTyping}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Gửi
            </Button>
          </form>
          
          {conversationState.error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              {conversationState.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 