# AI Idiom Learning Setup Guide

## OpenAI API Configuration

To enable the interactive AI idiom learning feature, you need to set up your OpenAI API key.

### Step 1: Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your account
3. Create a new API key
4. Copy the API key

### Step 2: Configure Environment Variables

Create a `.env.local` file in the `cabala-website` directory with:

```env
OPENAI_API_KEY=your_actual_openai_api_key_here
```

**Important**: Replace `your_actual_openai_api_key_here` with your real API key.

### Step 3: Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## Features

The AI idiom learning system includes:

### 🔄 **3-Round Learning Process**
- **Round 1**: AI introduces vocabulary with explanations
- **Round 2**: Interactive exercises with immediate feedback
- **Round 3**: Creative sentence creation with AI evaluation

### 📱 **Mobile-First Design**
- **Desktop**: Chat interface + dashboard sidebar
- **Mobile**: Full-screen chat with modal dashboard access

### 🧠 **Smart Learning**
- Adaptive difficulty based on user performance
- Progress tracking to avoid repeating learned idioms
- Personalized feedback and encouragement

### 💬 **Natural Conversation**
- Real-time AI responses
- Contextual feedback
- Vietnamese language support

## Usage

1. **Start Learning**: Click "Bắt đầu học" to begin a new session
2. **Follow the Flow**: AI will guide you through 3 rounds
3. **Track Progress**: View your learning statistics in the dashboard
4. **Continue Learning**: System automatically selects unlearned idioms

## Troubleshooting

### Common Issues:

1. **"Có lỗi xảy ra khi xử lý yêu cầu"**
   - Check your OpenAI API key in `.env.local`
   - Verify your OpenAI account has sufficient credits

2. **AI responses are slow**
   - This is normal for the first request
   - Subsequent requests should be faster

3. **Dashboard not showing**
   - On mobile: Click the 📊 button to open dashboard
   - On desktop: Dashboard should appear on the right side

## API Usage

The system uses OpenAI's GPT-3.5-turbo model with specialized prompts for each learning round. Each session typically uses 10-20 API calls depending on user interaction.

## Future Enhancements

- [ ] Voice recognition for pronunciation practice
- [ ] Spaced repetition algorithm
- [ ] Multiplayer learning sessions
- [ ] Advanced progress analytics
- [ ] Custom idiom collections 