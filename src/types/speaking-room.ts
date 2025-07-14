export interface SpeakingCategory {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  color: string;
  isAvailable: boolean;
}

export interface SpeakingSettings {
  selectedCategory: SpeakingCategory;
  textDisplayMode: 'always' | 'voice-only' | 'toggle';
  voiceSpeed: number; // 0.5 to 1.5
  enableRecording: boolean;
  autoPlayResponse: boolean;
}

export interface SpeakingMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isPlaying?: boolean;
  audioUrl?: string;
  metadata?: {
    confidence?: number;
    category?: string;
    encouragement?: string;
    vocabularyHighlight?: string[];
  };
}

export interface SpeakingSession {
  id: string;
  messages: SpeakingMessage[];
  category: SpeakingCategory;
  settings: SpeakingSettings;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  stats: {
    totalMessages: number;
    speakingTime: number; // in seconds
    vocabularyUsed: string[];
    topicsDiscussed: string[];
  };
}

export interface UserSpeakingProgress {
  totalSessions: number;
  totalSpeakingTime: number; // in minutes
  favoriteCategories: string[];
  sessionHistory: string[];
  achievements: string[];
  lastSessionDate: Date;
  streakDays: number;
}

export interface SpeakingConversationState {
  session: SpeakingSession | null;
  isRecording: boolean;
  isAIResponding: boolean;
  isAudioPlaying: boolean;
  error: string | null;
  pendingAudioUrl: string | null;
}

export type SpeakingUIView = 'chat' | 'settings' | 'categories';

export interface VoiceRecognition {
  isSupported: boolean;
  isListening: boolean;
  result: string;
  confidence: number;
  error: string | null;
}

export interface TTSSettings {
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
}

export interface CategoryPrompt {
  systemPrompt: string;
  conversationStarters: string[];
  encouragementPhrases: string[];
  topicSuggestions: string[];
} 