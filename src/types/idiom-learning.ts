export interface Idiom {
  id: string;
  idiom: string;
  meaning: string;
  example: string;
  note?: string;
}

export interface LearningSession {
  id: string;
  idioms: Idiom[];
  currentIndex: number;
  completed: boolean;
  startTime: Date;
  endTime?: Date;
}

export interface QuizQuestion {
  id: string;
  idiom: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

export interface QuizResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: string[];
  wrongAnswers: string[];
  completedAt: Date;
}

export interface UserProgress {
  totalIdiomsLearned: number;
  lastSessionDate: Date;
  completedSessions: string[];
  learnedIdioms: string[];
  quizResults: QuizResult[];
}

export interface LearningState {
  currentSession: LearningSession | null;
  userProgress: UserProgress;
  isLoading: boolean;
  error: string | null;
}

export type LearningSection = 'dashboard' | 'learning' | 'quiz' | 'review';

// New types for chat interface
export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    round?: 'vocab' | 'exercise' | 'creation' | 'completed';
    idiom?: string;
    isCorrect?: boolean;
    feedback?: string;
  };
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  currentIdiom: Idiom | null;
  currentRound: 'vocab' | 'exercise' | 'creation' | 'completed';
  exerciseCount: number;
  userPerformance: {
    correctAnswers: number;
    totalAnswers: number;
    needsMorePractice: boolean;
  };
  isActive: boolean;
  createdAt: Date;
}

export interface AIConversationState {
  session: ChatSession | null;
  isTyping: boolean;
  error: string | null;
  pendingMessage: string;
}

export type UIView = 'chat' | 'dashboard' | 'both';

export interface NavigationState {
  currentSection: LearningSection;
  canNavigate: boolean;
}

export interface SessionStats {
  totalSessions: number;
  averageScore: number;
  streakDays: number;
  favoriteIdioms: string[];
} 