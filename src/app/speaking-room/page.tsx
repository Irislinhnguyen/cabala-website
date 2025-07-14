'use client';

import React, { useState, useEffect, useRef } from 'react';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
import ResponsiveLayout from '@/components/speaking-room/ResponsiveLayout';
import { 
  UserSpeakingProgress, 
  SpeakingConversationState,
  SpeakingSettings,
  SpeakingSession,
  SpeakingMessage,
  SpeakingCategory,
  VoiceRecognition
} from '@/types/speaking-room';
import { getDefaultCategory, getCategoryById, categoryPrompts } from '@/data/speaking-categories';

export default function SpeakingRoomPage() {
  // Core State
  const [userProgress, setUserProgress] = useState<UserSpeakingProgress | null>(null);
  const [conversationState, setConversationState] = useState<SpeakingConversationState>({
    session: null,
    isRecording: false,
    isAIResponding: false,
    isAudioPlaying: false,
    error: null,
    pendingAudioUrl: null
  });
  const [settings, setSettings] = useState<SpeakingSettings | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SpeakingCategory | null>(null);
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognition>({
    isSupported: false,
    isListening: false,
    result: '',
    confidence: 0,
    error: null
  });
  const [isLoading, setIsLoading] = useState(true);

  // Refs for voice functionality
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize on component mount
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = () => {
    // Load user progress
    const progress = loadUserProgress();
    setUserProgress(progress);

    // Initialize default category and settings
    const defaultCategory = getDefaultCategory();
    setSelectedCategory(defaultCategory);

    const defaultSettings = createDefaultSettings(defaultCategory);
    setSettings(defaultSettings);

    // Initialize voice recognition
    initializeVoiceRecognition();

    setIsLoading(false);
  };

  const loadUserProgress = (): UserSpeakingProgress => {
    const saved = localStorage.getItem('speaking-room-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          lastSessionDate: new Date(parsed.lastSessionDate)
        };
      } catch (e) {
        console.error('Error loading user progress:', e);
      }
    }

    // Default progress
    return {
      totalSessions: 0,
      totalSpeakingTime: 0,
      favoriteCategories: [],
      sessionHistory: [],
      achievements: [],
      lastSessionDate: new Date(),
      streakDays: 0
    };
  };

  const saveUserProgress = (progress: UserSpeakingProgress) => {
    localStorage.setItem('speaking-room-progress', JSON.stringify(progress));
    setUserProgress(progress);
  };

  const createDefaultSettings = (category: SpeakingCategory): SpeakingSettings => {
    return {
      selectedCategory: category,
      textDisplayMode: 'always',
      voiceSpeed: 1.0,
      enableRecording: true,
      autoPlayResponse: true
    };
  };

  const initializeVoiceRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Keep listening through pauses
      recognitionRef.current.interimResults = false; // Don't show interim results
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event: any) => {
        // Accumulate all final results - don't show anything until manually stopped
        let accumulatedText = '';

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            accumulatedText += event.results[i][0].transcript + ' ';
          }
        }

        // Store accumulated text but don't show it yet (user doesn't want to see their words while speaking)
        if (accumulatedText.trim()) {
          // Store in a ref or state that we can access when manually stopping
          setVoiceRecognition(prev => ({
            ...prev,
            result: accumulatedText.trim(),
            confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0.9
          }));
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        setVoiceRecognition(prev => ({
          ...prev,
          error: event.error,
          isListening: false
        }));

        // Stop recording state on error
        setConversationState(prev => ({
          ...prev,
          isRecording: false
        }));
      };

      recognitionRef.current.onend = () => {
        setVoiceRecognition(prev => ({
          ...prev,
          isListening: false
        }));

        // Ensure recording state is stopped
        setConversationState(prev => ({
          ...prev,
          isRecording: false
        }));
      };

      setVoiceRecognition(prev => ({
        ...prev,
        isSupported: true
      }));
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  };

  // Voice Recording Handlers
  const handleStartRecording = () => {
    if (recognitionRef.current && !voiceRecognition.isListening) {
      // Clear previous results and start fresh
      setVoiceRecognition(prev => ({
        ...prev,
        result: '',
        error: null,
        isListening: true
      }));
      
      setConversationState(prev => ({
        ...prev,
        isRecording: true
      }));
      
      recognitionRef.current.start();
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current && voiceRecognition.isListening) {
      recognitionRef.current.stop();
      
      // Update both states immediately when manually stopping
      setVoiceRecognition(prev => ({
        ...prev,
        isListening: false
      }));
      
      setConversationState(prev => ({
        ...prev,
        isRecording: false
      }));
    }
  };

  // Message Handling
  const handleSendMessage = async (message: string) => {
    if (!settings || !conversationState.session) return;

    // Add user message
    const userMessage: SpeakingMessage = {
      id: `msg-${Date.now()}-user`,
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    const updatedSession = {
      ...conversationState.session,
      messages: [...conversationState.session.messages, userMessage]
    };

    setConversationState(prev => ({
      ...prev,
      session: updatedSession,
      isAIResponding: true,
      error: null
    }));

    try {
      // Send to AI API (placeholder for now)
      const aiResponse = await sendToAI(message, settings.selectedCategory);
      
      // Add AI message
      const aiMessage: SpeakingMessage = {
        id: `msg-${Date.now()}-ai`,
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        metadata: {
          encouragement: aiResponse.encouragement,
          vocabularyHighlight: aiResponse.vocabularyHighlight
        }
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage]
      };

      setConversationState(prev => ({
        ...prev,
        session: finalSession,
        isAIResponding: false
      }));

      // Auto-play AI response if enabled
      if (settings.autoPlayResponse) {
        playTextToSpeech(aiResponse.content);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setConversationState(prev => ({
        ...prev,
        isAIResponding: false,
        error: 'Failed to get AI response. Please try again.'
      }));
    }
  };

  // Send message to OpenAI API
  const sendToAI = async (message: string, category: SpeakingCategory) => {
    const conversationHistory = conversationState.session?.messages || [];
    
    const response = await fetch('/api/speaking-room/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        categoryId: category.id,
        conversationHistory: conversationHistory.map(msg => ({
          type: msg.type,
          content: msg.content
        }))
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.content,
      encouragement: data.encouragement,
      vocabularyHighlight: data.vocabularyHighlight
    };
  };

  const extractKeywords = (text: string): string[] => {
    // Simple keyword extraction (can be enhanced)
    const words = text.toLowerCase().split(/\s+/);
    const keywords = words.filter(word => word.length > 4 && !['that', 'this', 'with', 'have', 'would', 'could', 'should'].includes(word));
    return keywords.slice(0, 3);
  };

  // Text-to-Speech
  const playTextToSpeech = (text: string) => {
    if (!synthRef.current || !settings) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.voiceSpeed;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setConversationState(prev => ({
        ...prev,
        isAudioPlaying: true
      }));
    };

    utterance.onend = () => {
      setConversationState(prev => ({
        ...prev,
        isAudioPlaying: false
      }));
    };

    synthRef.current.speak(utterance);
  };

  // Audio Playback
  const handlePlayAudio = (messageId: string) => {
    const message = conversationState.session?.messages.find(m => m.id === messageId);
    if (message && message.type === 'ai') {
      playTextToSpeech(message.content);
    }
  };

  // Conversation Management
  const handleNewConversation = () => {
    if (!settings) return;

    const prompt = categoryPrompts[settings.selectedCategory.id];
    const starters = prompt?.conversationStarters || ["Hello! How are you today?"];
    const randomStarter = starters[Math.floor(Math.random() * starters.length)];

    const newSession: SpeakingSession = {
      id: `session-${Date.now()}`,
      messages: [{
        id: `msg-${Date.now()}-ai`,
        type: 'ai',
        content: randomStarter,
        timestamp: new Date()
      }],
      category: settings.selectedCategory,
      settings,
      startTime: new Date(),
      isActive: true,
      stats: {
        totalMessages: 0,
        speakingTime: 0,
        vocabularyUsed: [],
        topicsDiscussed: []
      }
    };

    setConversationState(prev => ({
      ...prev,
      session: newSession,
      error: null
    }));

    // Auto-play welcome message
    if (settings.autoPlayResponse) {
      playTextToSpeech(randomStarter);
    }
  };

  // Category and Settings Management
  const handleCategorySelect = (category: SpeakingCategory) => {
    setSelectedCategory(category);
    if (settings) {
      const updatedSettings = { ...settings, selectedCategory: category };
      setSettings(updatedSettings);
    }
  };

  const handleStartConversation = () => {
    handleNewConversation();
  };

  const handleSettingsChange = (newSettings: Partial<SpeakingSettings>) => {
    if (settings) {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
    }
  };

  // Loading state
  if (isLoading || !userProgress || !settings) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Speaking Room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      <ResponsiveLayout
        userProgress={userProgress}
        conversationState={conversationState}
        settings={settings}
        voiceRecognition={voiceRecognition}
        selectedCategory={selectedCategory}
        onSendMessage={handleSendMessage}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onPlayAudio={handlePlayAudio}
        onNewConversation={handleNewConversation}
        onCategorySelect={handleCategorySelect}
        onStartConversation={handleStartConversation}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
} 