import { SpeakingCategory, CategoryPrompt } from '@/types/speaking-room';

export const speakingCategories: SpeakingCategory[] = [
  {
    id: 'basic-english',
    name: 'Basic English',
    description: 'Perfect for beginners learning everyday conversation',
    level: 'beginner',
    icon: '🌱',
    color: 'green',
    isAvailable: false // Coming soon
  },
  {
    id: 'intermediate',
    name: 'Intermediate Conversation',
    description: 'Build confidence with natural, flowing conversations',
    level: 'intermediate',
    icon: '💬',
    color: 'blue',
    isAvailable: true // MVP working option
  },
  {
    id: 'ielts-prep',
    name: 'IELTS Preparation',
    description: 'Practice speaking tasks for IELTS exam success',
    level: 'advanced',
    icon: '🎯',
    color: 'red',
    isAvailable: false // Coming soon
  },
  {
    id: 'job-interview',
    name: 'Job Interview',
    description: 'Master interview skills and boost your confidence',
    level: 'intermediate',
    icon: '💼',
    color: 'purple',
    isAvailable: false // Coming soon
  },
  {
    id: 'travel-english',
    name: 'Travel English',
    description: 'Essential conversations for travelers',
    level: 'beginner',
    icon: '✈️',
    color: 'teal',
    isAvailable: false // Coming soon
  },
  {
    id: 'business-english',
    name: 'Business English',
    description: 'Professional communication for workplace success',
    level: 'advanced',
    icon: '📊',
    color: 'indigo',
    isAvailable: false // Coming soon
  }
];

export const categoryPrompts: Record<string, CategoryPrompt> = {
  'intermediate': {
    systemPrompt: `You are a confident and encouraging English conversation coach for intermediate level students (B1-B2). Your personality:

    **CONFIDENCE COACHING APPROACH:**
    - Act as a supportive conversation partner, not a strict teacher
    - Ask engaging questions and show genuine interest in their responses
    - Give positive feedback on vocabulary choices and natural expressions
    - Encourage natural communication over textbook perfection
    - Only address grammar when it seriously impacts communication
    - Always invite students to share more and keep conversations flowing

    **YOUR STYLE:**
    - Be warm, encouraging, and genuinely interested in what they say
    - Celebrate good vocabulary usage: "I love how you used 'fascinating' there!"
    - Ask follow-up questions to keep them talking: "Tell me more about that..."
    - Focus on meaning and communication, not perfect grammar
    - Use natural, conversational English yourself
    - Show enthusiasm for their progress and efforts

    **CONVERSATION FLOW:**
    1. Listen to their content, not just their language
    2. Respond to what they're saying with genuine interest
    3. Highlight good word choices and natural expressions
    4. Ask engaging follow-up questions
    5. Only correct grammar if it's seriously problematic
    6. Always end with an invitation to share more

    Keep conversations natural, encouraging, and focused on building their confidence to speak more!`,

    conversationStarters: [
      "Hi there! I'm excited to have a conversation with you today. What's something interesting that happened to you recently?",
      "Hello! Tell me about something you're passionate about. I'd love to hear what makes you excited!",
      "Hi! What's been the highlight of your week so far? I'm really curious to know!",
      "Hello there! If you could travel anywhere right now, where would you go and why?",
      "Hi! What's something new you've learned recently? I find people's learning journeys fascinating!"
    ],

    encouragementPhrases: [
      "That's such an interesting perspective!",
      "I love how you expressed that!",
      "You're speaking so naturally!",
      "Great vocabulary choice there!",
      "That's a wonderful way to put it!",
      "I can really hear your passion for this topic!",
      "You're doing fantastic!",
      "What a great example!"
    ],

    topicSuggestions: [
      "Your hobbies and interests",
      "Travel experiences or dream destinations",
      "Food and cooking adventures",
      "Movies, books, or shows you enjoy",
      "Weekend plans and activities",
      "Learning experiences",
      "Cultural differences you've noticed",
      "Technology in daily life",
      "Future goals and dreams",
      "Memorable moments"
    ]
  }
};

export const getAvailableCategories = (): SpeakingCategory[] => {
  return speakingCategories.filter(category => category.isAvailable);
};

export const getCategoryById = (id: string): SpeakingCategory | undefined => {
  return speakingCategories.find(category => category.id === id);
};

export const getDefaultCategory = (): SpeakingCategory => {
  return speakingCategories.find(category => category.id === 'intermediate')!;
}; 