'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { VoiceRecognition } from '@/types/speaking-room';

interface VoiceControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onTextSubmit: (text: string) => void;
  voiceRecognition: VoiceRecognition;
  disabled?: boolean;
}

export default function VoiceControls({
  isRecording,
  onStartRecording,
  onStopRecording,
  onTextSubmit,
  voiceRecognition,
  disabled = false
}: VoiceControlsProps) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  // Update input with voice recognition result
  useEffect(() => {
    if (voiceRecognition.result && !isRecording) {
      setInputText(voiceRecognition.result);
    }
  }, [voiceRecognition.result, isRecording]);

  // Clear input when starting to record
  useEffect(() => {
    if (isRecording) {
      setInputText('');
    }
  }, [isRecording]);

  // Clear voice recognition result when input is manually changed
  useEffect(() => {
    if (inputText !== voiceRecognition.result && voiceRecognition.result) {
      // User manually edited the recognized text
    }
  }, [inputText, voiceRecognition.result]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !disabled) {
      onTextSubmit(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 space-y-3">
      {/* Voice Recognition Status */}
      {(isRecording || (voiceRecognition.result && !isRecording)) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          {isRecording && (
            <div className="flex items-center justify-between text-blue-700">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium">🎙️ Recording... (click red button when done)</span>
              </div>
              <span className="text-xs text-blue-600">Speak naturally with pauses</span>
            </div>
          )}
          {voiceRecognition.result && !isRecording && (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-2 text-green-700">
              <div>
                <span className="text-sm font-medium">✅ Ready to send: </span>
                <span className="text-sm">{voiceRecognition.result}</span>
              </div>
              <Button
                onClick={() => setInputText('')}
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-800 ml-2"
                title="Clear and try again"
              >
                ✕
              </Button>
            </div>
          )}
          {voiceRecognition.error && (
            <div className="text-red-700">
              <span className="text-sm font-medium">Error: </span>
              <span className="text-sm">{voiceRecognition.error}</span>
            </div>
          )}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-end space-x-3">
          {/* Text Input */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isRecording ? "Speak now..." : "Type your message or use voice..."}
              disabled={disabled || isRecording}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none min-h-[50px] max-h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              rows={1}
            />
          </div>

          {/* Voice Button */}
          <Button
            type="button"
            onClick={isRecording ? onStopRecording : onStartRecording}
            disabled={disabled || !voiceRecognition.isSupported}
            className={`h-12 w-12 rounded-full flex items-center justify-center ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            title={!voiceRecognition.isSupported ? "Voice recognition not supported" : isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            )}
          </Button>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={disabled || !inputText.trim()}
            className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </Button>
        </div>

        {/* Helper Text */}
        <div className="text-xs text-gray-500 space-y-1">
          {!voiceRecognition.isSupported && (
            <p className="text-amber-600">⚠️ Voice recognition is not supported in your browser</p>
          )}
          <p>💡 Press Enter to send, Shift+Enter for new line</p>
          <p>🎤 Start recording → Speak naturally with pauses → Click red button to stop → Review → Send</p>
        </div>
      </form>
    </div>
  );
} 