import { 
  ChatSession, 
  ChatMessage, 
  AIConversationState, 
  Idiom,
  UserProgress 
} from '@/types/idiom-learning';
import { idioms } from '@/data/idioms';

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Get a random idiom that hasn't been learned yet
export function getNextIdiom(learnedIdioms: string[]): Idiom | null {
  const availableIdioms = idioms.filter(idiom => !learnedIdioms.includes(idiom.id));
  if (availableIdioms.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableIdioms.length);
  return availableIdioms[randomIndex];
}

// Create a new chat session
export function createChatSession(idiom: Idiom): ChatSession {
  return {
    id: generateId(),
    messages: [],
    currentIdiom: idiom,
    currentRound: 'vocab',
    exerciseCount: 0,
    userPerformance: {
      correctAnswers: 0,
      totalAnswers: 0,
      needsMorePractice: false
    },
    isActive: true,
    createdAt: new Date()
  };
}

// Create a new chat message
export function createChatMessage(
  type: 'user' | 'ai',
  content: string,
  metadata?: ChatMessage['metadata']
): ChatMessage {
  return {
    id: generateId(),
    type,
    content,
    timestamp: new Date(),
    metadata
  };
}

// Add message to session
export function addMessageToSession(
  session: ChatSession,
  message: ChatMessage
): ChatSession {
  return {
    ...session,
    messages: [...session.messages, message]
  };
}

// Update session round
export function updateSessionRound(
  session: ChatSession,
  round: ChatSession['currentRound']
): ChatSession {
  return {
    ...session,
    currentRound: round
  };
}

// Update user performance
export function updateUserPerformance(
  session: ChatSession,
  isCorrect: boolean
): ChatSession {
  const newPerformance = {
    ...session.userPerformance,
    totalAnswers: session.userPerformance.totalAnswers + 1,
    correctAnswers: session.userPerformance.correctAnswers + (isCorrect ? 1 : 0)
  };

  // Determine if user needs more practice
  const accuracy = newPerformance.correctAnswers / newPerformance.totalAnswers;
  newPerformance.needsMorePractice = accuracy < 0.7; // 70% accuracy threshold

  return {
    ...session,
    userPerformance: newPerformance,
    exerciseCount: session.exerciseCount + 1
  };
}

// Complete session and update user progress
export function completeSession(
  session: ChatSession,
  userProgress: UserProgress
): UserProgress {
  if (!session.currentIdiom) return userProgress;

  const updatedProgress = {
    ...userProgress,
    totalIdiomsLearned: userProgress.totalIdiomsLearned + 1,
    lastSessionDate: new Date(),
    learnedIdioms: [...userProgress.learnedIdioms, session.currentIdiom.id]
  };

  // Save to localStorage
  localStorage.setItem('idiom-learning-progress', JSON.stringify(updatedProgress));

  return updatedProgress;
}

// Load conversation state from localStorage
export function loadConversationState(): AIConversationState {
  if (typeof window === 'undefined') {
    return {
      session: null,
      isTyping: false,
      error: null,
      pendingMessage: ''
    };
  }

  try {
    const saved = localStorage.getItem('idiom-chat-session');
    if (saved) {
      const session = JSON.parse(saved);
      // Convert date strings back to Date objects
      session.createdAt = new Date(session.createdAt);
      session.messages = session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));

      return {
        session,
        isTyping: false,
        error: null,
        pendingMessage: ''
      };
    }
  } catch (error) {
    console.error('Error loading conversation state:', error);
  }

  return {
    session: null,
    isTyping: false,
    error: null,
    pendingMessage: ''
  };
}

// Save conversation state to localStorage
export function saveConversationState(state: AIConversationState): void {
  if (typeof window === 'undefined') return;

  try {
    if (state.session) {
      localStorage.setItem('idiom-chat-session', JSON.stringify(state.session));
    } else {
      localStorage.removeItem('idiom-chat-session');
    }
  } catch (error) {
    console.error('Error saving conversation state:', error);
  }
}

// Send message to AI API
export async function sendMessageToAI(
  message: string,
  session: ChatSession
): Promise<{ response: string; metadata?: any }> {
  const response = await fetch('/api/idiom-learning/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      conversationHistory: session.messages,
      currentRound: session.currentRound,
      currentIdiom: session.currentIdiom,
      userPerformance: session.userPerformance
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message to AI');
  }

  const data = await response.json();
  return {
    response: data.message,
    metadata: data.metadata
  };
}

// Determine if session should progress to next round
export function shouldProgressToNextRound(session: ChatSession): boolean {
  const { currentRound, exerciseCount, userPerformance } = session;

  switch (currentRound) {
    case 'vocab':
      // Progress after user acknowledges understanding
      return true; // Will be handled by AI conversation flow
    
    case 'exercise':
      // Progress after sufficient practice (2-4 exercises based on performance)
      const minExercises = userPerformance.needsMorePractice ? 3 : 2;
      const maxExercises = 4;
      return exerciseCount >= minExercises && exerciseCount <= maxExercises;
    
    case 'creation':
      // Progress after successful sentence creation
      return userPerformance.correctAnswers > 0;
    
    default:
      return false;
  }
}

// Get next round
export function getNextRound(currentRound: ChatSession['currentRound']): ChatSession['currentRound'] {
  switch (currentRound) {
    case 'vocab':
      return 'exercise';
    case 'exercise':
      return 'creation';
    case 'creation':
      return 'completed';
    default:
      return 'completed';
  }
} 