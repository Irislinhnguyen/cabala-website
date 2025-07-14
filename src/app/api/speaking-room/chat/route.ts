import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { categoryPrompts } from '@/data/speaking-categories';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, categoryId, conversationHistory } = await request.json();

    if (!message || !categoryId) {
      return NextResponse.json(
        { error: 'Message and category are required' },
        { status: 400 }
      );
    }

    // Get category prompt configuration
    const categoryPrompt = categoryPrompts[categoryId];
    if (!categoryPrompt) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Build conversation context
    const systemMessage = {
      role: 'system' as const,
      content: categoryPrompt.systemPrompt
    };

    // Convert conversation history to OpenAI format
    const messages = [
      systemMessage,
      ...conversationHistory.map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.8,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    // Extract encouragement and vocabulary highlights
    const encouragement = getRandomEncouragement(categoryPrompt.encouragementPhrases);
    const vocabularyHighlight = extractKeywords(message);

    // Return structured response
    return NextResponse.json({
      content: aiResponse,
      encouragement,
      vocabularyHighlight,
      metadata: {
        category: categoryId,
        model: 'gpt-4o-mini',
        tokens: completion.usage?.total_tokens
      }
    });

  } catch (error) {
    console.error('Speaking room API error:', error);
    
    // Return appropriate error response
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process speaking request' },
      { status: 500 }
    );
  }
}

// Helper function to get random encouragement
function getRandomEncouragement(encouragements: string[]): string {
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

// Helper function to extract keywords for vocabulary highlighting
function extractKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 4) // Only longer words
    .filter(word => !isCommonWord(word)); // Filter out common words
  
  // Return up to 3 keywords
  return words.slice(0, 3);
}

// Helper function to identify common words to exclude from highlighting
function isCommonWord(word: string): boolean {
  const commonWords = [
    'that', 'this', 'with', 'have', 'been', 'will', 'would', 'could', 
    'should', 'about', 'which', 'their', 'there', 'where', 'when', 
    'what', 'how', 'why', 'really', 'very', 'just', 'only', 'also',
    'because', 'before', 'after', 'during', 'while', 'since', 'until'
  ];
  
  return commonWords.includes(word.toLowerCase());
} 