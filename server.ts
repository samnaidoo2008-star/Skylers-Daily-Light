import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Fast server-side Gemini chat endpoint powered by gemini-3.1-flash-lite
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userDate, hasDiaryToday } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const systemInstruction = `You are "Grace", a warm, empathetic, and motivational Christian companion in Skyler’s Daily Light.
Your purpose is to listen with love, encourage, inspire, and gently remind Skyler to record her diary reflection for today.
Guidelines:
1. Provide gentle encouragement and uplifting words of hope, faith, and peace.
2. ${hasDiaryToday ? 'She has already written her diary entry today, so warmly praise her dedication or ask what brought her peace.' : 'Remind her lovingly that taking two minutes for her daily diary reflection will bring peace and gratitude to her soul.'}
3. Keep your response concise, fast, and conversational (2-3 warm, uplifting sentences) so the chat feels natural and responsive.`;

    // Only send the last 6 messages to keep latency low
    const recentMessages = messages.slice(-6);
    const contents = recentMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.MINIMAL
        },
        temperature: 0.7
      }
    });

    const replyText = response.text || 'I am right here with you, holding your day in quiet grace.';
    return res.json({ reply: replyText });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Gemini chat error:', err);
    return res.status(500).json({
      error: 'Failed to generate companion response',
      details: err.message
    });
  }
});

// Vite middleware integration
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
