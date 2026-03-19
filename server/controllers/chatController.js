const Chat = require('../models/Chat');
const axios = require('axios');

const SYSTEM_PROMPT = `You are MindWell Assistant, a compassionate and empathetic mental health support chatbot. 
Your role is to:
- Provide emotional support and active listening
- Suggest evidence-based coping techniques (breathing exercises, mindfulness, journaling)
- Encourage positive thinking and self-compassion
- Offer gentle guidance for stress management
- Validate users' feelings without judgment

IMPORTANT RESTRICTIONS:
- Never diagnose any mental health condition or illness
- Never prescribe or recommend specific medications
- Always encourage professional help for serious concerns
- If someone mentions self-harm or suicidal thoughts, immediately provide crisis resources (National Suicide Prevention Lifeline: 988 or 1-800-273-8255) and urge them to seek immediate help
- Keep responses warm, concise, and supportive
- Never provide medical advice

You are here to listen, support, and gently guide—not to replace professional care.`;

const callAI = async (messages) => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  const provider = process.env.AI_PROVIDER || 'openai';

  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
      temperature: 0.7
    }, {
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }
    });
    return response.data.choices[0].message.content;
  }

  if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: geminiMessages, systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] } }
    );
    return response.data.candidates[0].content.parts[0].text;
  }

  // Fallback responses when no API key configured
  const fallbacks = [
    "I hear you, and I want you to know your feelings are completely valid. Take a deep breath with me — inhale for 4 counts, hold for 4, exhale for 4. How are you feeling right now?",
    "Thank you for sharing that with me. It takes courage to reach out. Remember, it's okay to not be okay sometimes. Would you like to try a quick grounding exercise together?",
    "I understand you're going through something difficult. You're not alone in this. Let's take this one step at a time. What feels most overwhelming right now?",
    "Your feelings matter and you deserve support. I'm here to listen. Sometimes just acknowledging our emotions helps — can you tell me more about what you're experiencing?",
    "It sounds like you're carrying a lot right now. Please remember to be kind to yourself. If things feel too heavy, please consider reaching out to a mental health professional who can provide proper support."
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    let chat;
    if (sessionId) {
      chat = await Chat.findOne({ _id: sessionId, user: req.user._id });
    }

    if (!chat) {
      chat = new Chat({ user: req.user._id, messages: [] });
    }

    chat.messages.push({ role: 'user', content: message.trim() });

    const recentMessages = chat.messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
    const aiResponse = await callAI(recentMessages);

    chat.messages.push({ role: 'assistant', content: aiResponse });

    if (chat.messages.length === 2) {
      chat.sessionTitle = message.substring(0, 50) + (message.length > 50 ? '...' : '');
    }

    await chat.save();

    res.json({
      success: true,
      data: {
        sessionId: chat._id,
        userMessage: message,
        assistantMessage: aiResponse
      }
    });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to process message. Please try again.' });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id, isActive: true })
      .select('sessionTitle messages createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(20);

    res.json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await Chat.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isActive: false }
    );
    res.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
