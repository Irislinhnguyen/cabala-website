import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

console.log('DEBUG: OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, currentRound, currentIdiom } = await request.json();

    // System prompts for different rounds
    const systemPrompts = {
      vocab: `You are an English idiom learning assistant. Your role is to teach idioms in a conversational, friendly way. 

Current task: Introduce the idiom "${currentIdiom.idiom}" to the user.

Guidelines:
- Explain the idiom's meaning in Vietnamese
- Provide the English example: "${currentIdiom.example}"
- Give practical usage context
- Keep explanations clear and engaging
- Ask if the user understands before moving to exercises
- Use emojis to make it fun
- Always respond in Vietnamese except for the English idiom and example`,

      exercise: `You are conducting exercises for the idiom "${currentIdiom.idiom}".

Current task: Create and evaluate exercises to test understanding.

Guidelines:
- Create fill-in-the-blank, multiple choice, or sentence completion exercises
- Check each answer immediately and provide feedback
- Give encouragement for correct answers
- Provide gentle corrections with explanations for wrong answers
- Adapt difficulty based on user performance
- Create 2-4 exercises depending on user performance
- Ask if they want more practice or are ready for the next round
- Always respond in Vietnamese except for English examples`,

      creation: `You are helping the user create original sentences using the idiom "${currentIdiom.idiom}".

Current task: Guide sentence creation and provide detailed feedback.

Guidelines:
- Ask the user to create an original sentence using the idiom
- Evaluate grammar, context, and correct usage
- Provide detailed feedback on their sentence
- Suggest improvements if needed
- Encourage creativity while ensuring accuracy
- If they struggle, provide hints or examples
- Celebrate successful usage
- Always respond in Vietnamese except for English examples`
    };

    const systemPrompt = systemPrompts[currentRound as keyof typeof systemPrompts];

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: { type: string; content: string }) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = response.choices[0].message.content;

    // Simple response analysis for exercise round
    let isCorrect = undefined;
    let feedback = undefined;
    
    if (currentRound === 'exercise') {
      // Basic analysis - in production, this would be more sophisticated
      const userMessage = message.toLowerCase();
      const idiomWords = currentIdiom.idiom.toLowerCase().split(' ');
      
      // Check if user's answer contains key words from the idiom
      const containsIdiomWords = idiomWords.some((word: string) => userMessage.includes(word));
      
      if (containsIdiomWords) {
        isCorrect = true;
        feedback = "Tốt lắm! Bạn đã sử dụng idiom đúng cách.";
      } else {
        isCorrect = false;
        feedback = "Hãy thử lại và chú ý đến ngữ cảnh của idiom.";
      }
    }

    return NextResponse.json({
      message: aiResponse,
      metadata: {
        round: currentRound,
        idiom: currentIdiom.idiom,
        isCorrect,
        feedback
      }
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xử lý yêu cầu' },
      { status: 500 }
    );
  }
} 