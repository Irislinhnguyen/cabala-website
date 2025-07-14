'use client';

import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/idiom-learning';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';
  const isCorrect = message.metadata?.isCorrect;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs sm:max-w-md lg:max-w-lg ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar */}
        {!isUser && (
          <div className="flex items-center mb-1">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs font-semibold">AI</span>
            </div>
            <span className="text-xs text-gray-500">Trợ lý</span>
          </div>
        )}
        
        {/* Message bubble */}
        <div className={`rounded-lg p-3 shadow-sm ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
        }`}>
          {/* Message content */}
          <div className="prose prose-sm max-w-none">
            {message.content.split('\n').map((line, index) => (
              <p key={index} className={`${index === 0 ? 'mt-0' : 'mt-2'} ${isUser ? 'text-white' : 'text-gray-900'}`}>
                {line}
              </p>
            ))}
          </div>
          
          {/* Metadata for exercises */}
          {message.metadata?.isCorrect !== undefined && (
            <div className={`mt-2 pt-2 border-t ${isUser ? 'border-blue-400' : 'border-gray-200'}`}>
              <div className={`flex items-center text-sm ${
                isCorrect 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                <span className="mr-1">
                  {isCorrect ? '✅' : '❌'}
                </span>
                {isCorrect ? 'Đúng rồi!' : 'Chưa đúng'}
              </div>
              {message.metadata.feedback && (
                <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-600'}`}>
                  {message.metadata.feedback}
                </p>
              )}
            </div>
          )}
          
          {/* Round indicator */}
          {message.metadata?.round && !isUser && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                {message.metadata.round === 'vocab' ? '📚 Từ vựng' : 
                 message.metadata.round === 'exercise' ? '✏️ Bài tập' : 
                 message.metadata.round === 'creation' ? '✨ Tạo câu' : 'Hoàn thành'}
              </span>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatDistanceToNow(message.timestamp, { 
            addSuffix: true, 
            locale: vi 
          })}
        </div>
      </div>
    </div>
  );
} 