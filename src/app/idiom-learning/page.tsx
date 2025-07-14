'use client';

import React, { useState, useEffect } from 'react';
// Remove Header and Footer imports since we don't need them
import ResponsiveLayout from '@/components/idiom-learning/ResponsiveLayout';
import { 
  UserProgress, 
  AIConversationState,
  ChatSession
} from '@/types/idiom-learning';
import {
  loadUserProgress
} from '@/lib/idiom-learning';
import {
  loadConversationState,
  saveConversationState,
  getNextIdiom,
  createChatSession,
  createChatMessage,
  addMessageToSession,
  updateSessionRound,
  updateUserPerformance,
  completeSession,
  sendMessageToAI,
  getNextRound
} from '@/lib/ai-conversation';

export default function IdiomLearningPage() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [conversationState, setConversationState] = useState<AIConversationState>({
    session: null,
    isTyping: false,
    error: null,
    pendingMessage: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load user progress and conversation state on component mount
  useEffect(() => {
    const progress = loadUserProgress();
    const conversation = loadConversationState();
    
    setUserProgress(progress);
    setConversationState(conversation);
    setIsLoading(false);
  }, []);

  // Save conversation state when it changes
  useEffect(() => {
    if (!isLoading) {
      saveConversationState(conversationState);
    }
  }, [conversationState, isLoading]);

  // Start a new AI learning session
  const handleStartNewSession = async () => {
    if (!userProgress) return;

    const nextIdiom = getNextIdiom(userProgress.learnedIdioms);
    if (!nextIdiom) {
      alert('Chúc mừng! Bạn đã học hết tất cả idioms có sẵn.');
      return;
    }

    const newSession = createChatSession(nextIdiom);
    
    // Add initial AI greeting
    const greetingMessage = createChatMessage(
      'ai',
      `Chào bạn! 🎉 Hôm nay chúng ta sẽ học idiom mới: "${nextIdiom.idiom}"\n\n` +
      `Nghĩa: ${nextIdiom.meaning}\n\n` +
      `Ví dụ: ${nextIdiom.example}\n\n` +
      `${nextIdiom.note || ''}\n\n` +
      `Bạn có hiểu idiom này không? Nếu có thể, hãy cho tôi biết bạn hiểu như thế nào về idiom này! 💭`,
      {
        round: 'vocab',
        idiom: nextIdiom.idiom
      }
    );

    const sessionWithGreeting = addMessageToSession(newSession, greetingMessage);

    setConversationState(prev => ({
      ...prev,
      session: sessionWithGreeting,
      error: null
    }));
  };

  // Send message to AI
  const handleSendMessage = async (message: string) => {
    if (!conversationState.session || conversationState.isTyping) return;

    const session = conversationState.session;

    // Add user message
    const userMessage = createChatMessage('user', message);
    const updatedSession = addMessageToSession(session, userMessage);

    setConversationState(prev => ({
      ...prev,
      session: updatedSession,
      isTyping: true,
      error: null
    }));

    try {
      // Send to AI
      const { response, metadata } = await sendMessageToAI(message, session);

      // Add AI response
      const aiMessage = createChatMessage('ai', response, metadata);
      const sessionWithAIResponse = addMessageToSession(updatedSession, aiMessage);

      // Update user performance if this was an exercise
      let finalSession = sessionWithAIResponse;
      if (metadata?.isCorrect !== undefined) {
        finalSession = updateUserPerformance(finalSession, metadata.isCorrect);
      }

      // Check if we should progress to next round
      if (shouldProgressRound(finalSession, response)) {
        const nextRound = getNextRound(finalSession.currentRound);
        
        if (nextRound === 'completed') {
          // Complete the session
          finalSession = { ...finalSession, isActive: false, currentRound: 'completed' };
          
          // Update user progress
          const updatedProgress = completeSession(finalSession, userProgress!);
          setUserProgress(updatedProgress);
          
          // Add completion message
          const completionMessage = createChatMessage(
            'ai',
            `🎉 Tuyệt vời! Bạn đã hoàn thành việc học idiom "${finalSession.currentIdiom?.idiom}"\n\n` +
            `Hãy nhấn "Bắt đầu học" để học idiom mới tiếp theo!`,
            { round: 'completed' }
          );
          
          finalSession = addMessageToSession(finalSession, completionMessage);
        } else {
          finalSession = updateSessionRound(finalSession, nextRound);
          
          // Add transition message
          const transitionMessage = createChatMessage(
            'ai',
            getTransitionMessage(nextRound, finalSession.currentIdiom?.idiom || ''),
            { round: nextRound }
          );
          
          finalSession = addMessageToSession(finalSession, transitionMessage);
        }
      }

      setConversationState(prev => ({
        ...prev,
        session: finalSession,
        isTyping: false
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      setConversationState(prev => ({
        ...prev,
        isTyping: false,
        error: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.'
      }));
    }
  };

  // Check if we should progress to next round based on AI response
  const shouldProgressRound = (session: ChatSession, aiResponse: string): boolean => {
    const { currentRound } = session;
    
    // Simple heuristics - in production, this would be more sophisticated
    switch (currentRound) {
      case 'vocab':
        return aiResponse.includes('bài tập') || aiResponse.includes('exercise');
      case 'exercise':
        return aiResponse.includes('tạo câu') || aiResponse.includes('sentence');
      case 'creation':
        return aiResponse.includes('hoàn thành') || aiResponse.includes('tuyệt vời');
      default:
        return false;
    }
  };

  // Get transition message for round changes
  const getTransitionMessage = (round: ChatSession['currentRound'], idiom: string): string => {
    switch (round) {
      case 'exercise':
        return `Tuyệt! Bây giờ chúng ta sẽ làm một số bài tập để củng cố kiến thức về idiom "${idiom}". ✏️\n\nHãy sẵn sàng nhé!`;
      case 'creation':
        return `Làm tốt lắm! 👏 Bây giờ đến phần cuối cùng: hãy tạo một câu của riêng bạn sử dụng idiom "${idiom}". ✨\n\nHãy thể hiện khả năng sáng tạo của bạn!`;
      default:
        return 'Tiếp tục thôi!';
    }
  };

  // Handle dashboard actions
  const handleStartLearning = () => {
    handleStartNewSession();
  };

  const handleReviewIdioms = () => {
    // TODO: Implement review functionality
    alert('Chức năng ôn tập sẽ được phát triển trong phiên bản tiếp theo!');
  };

  // Loading state - Fullscreen without header/footer
  if (isLoading || !userProgress) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      <ResponsiveLayout
        userProgress={userProgress}
        conversationState={conversationState}
        onSendMessage={handleSendMessage}
        onStartNewSession={handleStartNewSession}
        onStartLearning={handleStartLearning}
        onReviewIdioms={handleReviewIdioms}
      />
    </div>
  );
} 