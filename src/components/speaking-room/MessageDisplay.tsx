'use client';

import React, { useState } from 'react';
import { SpeakingMessage, SpeakingSettings } from '@/types/speaking-room';
import { Button } from '@/components/ui/Button';

interface MessageDisplayProps {
  message: SpeakingMessage;
  settings: SpeakingSettings;
  onPlayAudio?: (message: SpeakingMessage) => void;
  isPlaying?: boolean;
}

export default function MessageDisplay({
  message,
  settings,
  onPlayAudio,
  isPlaying = false
}: MessageDisplayProps) {
  const [showText, setShowText] = useState(
    settings.textDisplayMode === 'always' || message.type === 'user'
  );

  const shouldShowText = () => {
    if (message.type === 'user') return true;
    if (settings.textDisplayMode === 'always') return true;
    if (settings.textDisplayMode === 'voice-only') return false;
    if (settings.textDisplayMode === 'toggle') return showText;
    return true;
  };

  const canToggleText = () => {
    return message.type === 'ai' && settings.textDisplayMode === 'toggle';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const highlightVocabulary = (text: string, highlights: string[] = []) => {
    if (!highlights.length) return text;
    
    let highlightedText = text;
    highlights.forEach(word => {
      const regex = new RegExp(`\\b(${word})\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    });
    
    return highlightedText;
  };

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
        {/* Message Bubble */}
        <div
          className={`rounded-lg p-4 ${
            message.type === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-200 text-gray-900'
          }`}
        >
          {/* AI Voice Controls */}
          {message.type === 'ai' && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🤖</span>
                <span className="text-sm font-medium text-gray-600">AI Coach</span>
              </div>
              <div className="flex items-center space-x-2">
                {/* Play/Pause Button */}
                {onPlayAudio && (
                  <Button
                    onClick={() => onPlayAudio(message)}
                    className="p-1 text-gray-600 hover:text-gray-800"
                    variant="ghost"
                    size="sm"
                  >
                    {isPlaying ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21"/>
                      </svg>
                    )}
                  </Button>
                )}
                
                {/* Toggle Text Button */}
                {canToggleText() && (
                  <Button
                    onClick={() => setShowText(!showText)}
                    className="p-1 text-gray-600 hover:text-gray-800"
                    variant="ghost"
                    size="sm"
                    title={showText ? "Hide text" : "Show text"}
                  >
                    {showText ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 9c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5S11.17 9 12 9zM3 5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S5.33 7 4.5 7 3 6.33 3 5.5zm15 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S19.33 7 18.5 7 18 6.33 18 5.5z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Message Content */}
          {shouldShowText() ? (
            <div
              className={`whitespace-pre-wrap ${message.type === 'user' ? 'text-white' : 'text-gray-900'}`}
              dangerouslySetInnerHTML={{
                __html: highlightVocabulary(
                  message.content,
                  message.metadata?.vocabularyHighlight
                )
              }}
            />
          ) : (
            <div className="text-center py-4 text-gray-500">
              <div className="text-2xl mb-2">🔊</div>
              <p className="text-sm">Voice-only mode</p>
              <p className="text-xs">Click the eye icon to reveal text</p>
            </div>
          )}

          {/* Encouragement/Feedback */}
          {message.metadata?.encouragement && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
              <strong>💚 Coach says:</strong> {message.metadata.encouragement}
            </div>
          )}
        </div>

        {/* Message Info */}
        <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
          {message.metadata?.confidence && (
            <span className="ml-2">
              Confidence: {Math.round(message.metadata.confidence * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 