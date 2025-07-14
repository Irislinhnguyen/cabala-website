import { Idiom, LearningSession, UserProgress, QuizQuestion, QuizResult, SessionStats } from '@/types/idiom-learning';
import { idioms, getRandomIdioms } from '@/data/idioms';

// Local storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: 'idiom-learning-progress',
  CURRENT_SESSION: 'current-learning-session',
} as const;

// Initialize default user progress
export const getDefaultUserProgress = (): UserProgress => ({
  totalIdiomsLearned: 0,
  lastSessionDate: new Date(),
  completedSessions: [],
  learnedIdioms: [],
  quizResults: [],
});

// Local storage utilities
export const saveUserProgress = (progress: UserProgress): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  }
};

export const loadUserProgress = (): UserProgress => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          lastSessionDate: new Date(parsed.lastSessionDate),
        };
      } catch (error) {
        console.error('Failed to parse user progress:', error);
      }
    }
  }
  return getDefaultUserProgress();
};

export const saveCurrentSession = (session: LearningSession): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
  }
};

export const loadCurrentSession = (): LearningSession | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          startTime: new Date(parsed.startTime),
          endTime: parsed.endTime ? new Date(parsed.endTime) : undefined,
        };
      } catch (error) {
        console.error('Failed to parse current session:', error);
      }
    }
  }
  return null;
};

export const clearCurrentSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }
};

// Session management
export const createNewSession = (idiomCount: number = 3): LearningSession => {
  const sessionIdioms = getRandomIdioms(idiomCount);
  const session: LearningSession = {
    id: `session-${Date.now()}`,
    idioms: sessionIdioms,
    currentIndex: 0,
    completed: false,
    startTime: new Date(),
  };
  saveCurrentSession(session);
  return session;
};

export const updateSessionProgress = (session: LearningSession, newIndex: number): LearningSession => {
  const updatedSession = {
    ...session,
    currentIndex: newIndex,
    completed: newIndex >= session.idioms.length,
    endTime: newIndex >= session.idioms.length ? new Date() : undefined,
  };
  saveCurrentSession(updatedSession);
  return updatedSession;
};

export const completeSession = (session: LearningSession): void => {
  const progress = loadUserProgress();
  const newLearnedIdioms = session.idioms.map(idiom => idiom.id);
  
  const updatedProgress: UserProgress = {
    ...progress,
    totalIdiomsLearned: progress.totalIdiomsLearned + newLearnedIdioms.length,
    lastSessionDate: new Date(),
    completedSessions: [...progress.completedSessions, session.id],
    learnedIdioms: [...new Set([...progress.learnedIdioms, ...newLearnedIdioms])],
  };
  
  saveUserProgress(updatedProgress);
  clearCurrentSession();
};

// Quiz utilities
export const generateQuizFromSession = (session: LearningSession): QuizQuestion[] => {
  return session.idioms.map((idiom, index) => {
    // Get wrong answers from other idioms
    const wrongAnswers = idioms
      .filter(i => i.id !== idiom.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(i => i.meaning);
    
    const options = [...wrongAnswers, idiom.meaning].sort(() => 0.5 - Math.random());
    
    return {
      id: `quiz-${session.id}-${index}`,
      idiom: idiom.idiom,
      correctAnswer: idiom.meaning,
      options,
      explanation: idiom.example,
    };
  });
};

export const calculateQuizScore = (questions: QuizQuestion[], answers: string[]): QuizResult => {
  const correctAnswers: string[] = [];
  const wrongAnswers: string[] = [];
  
  questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correctAnswers.push(question.id);
    } else {
      wrongAnswers.push(question.id);
    }
  });
  
  const score = Math.round((correctAnswers.length / questions.length) * 100);
  
  return {
    sessionId: `quiz-${Date.now()}`,
    score,
    totalQuestions: questions.length,
    correctAnswers,
    wrongAnswers,
    completedAt: new Date(),
  };
};

// Progress statistics
export const getSessionStats = (progress: UserProgress): SessionStats => {
  const totalSessions = progress.completedSessions.length;
  const averageScore = progress.quizResults.length > 0 
    ? progress.quizResults.reduce((sum, result) => sum + result.score, 0) / progress.quizResults.length
    : 0;
  
  // Calculate streak (simplified - just check if last session was recent)
  const daysSinceLastSession = Math.floor(
    (new Date().getTime() - progress.lastSessionDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const streakDays = daysSinceLastSession <= 1 ? Math.max(1, totalSessions) : 0;
  
  // Get most frequently appearing idioms (simplified)
  const favoriteIdioms = progress.learnedIdioms.slice(0, 5);
  
  return {
    totalSessions,
    averageScore: Math.round(averageScore),
    streakDays,
    favoriteIdioms,
  };
};

// Format utilities
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays <= 7) return `${diffDays} ngày trước`;
  return formatDate(date);
}; 