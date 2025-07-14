'use client';

import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-xs sm:max-w-md lg:max-w-lg">
        {/* Avatar */}
        <div className="flex items-center mb-1">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs font-semibold">AI</span>
          </div>
          <span className="text-xs text-gray-500">Trợ lý đang trả lời...</span>
        </div>
        
        {/* Typing bubble */}
        <div className="bg-white text-gray-900 rounded-lg rounded-bl-none border border-gray-200 p-3 shadow-sm">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 