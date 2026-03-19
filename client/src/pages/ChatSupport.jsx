import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SUGGESTIONS = [
  "I'm feeling anxious today",
  "Help me with a breathing exercise",
  "I need some coping strategies",
  "I'm feeling overwhelmed",
  "Teach me mindfulness",
];

const ChatSupport = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name?.split(' ')[0] || 'friend'}! 💙 I'm MindWell Assistant, your compassionate mental wellness companion. I'm here to listen, support, and gently guide you.\n\nRemember: I'm here to offer support, but I'm not a replacement for professional mental health care. If you're in crisis, please reach out to a licensed professional.\n\nHow are you feeling today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (msg = input) => {
    if (!msg.trim() || loading) return;
    const userMsg = { role: 'user', content: msg.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await chatAPI.send({ message: msg.trim(), sessionId });
      if (res.data.data.sessionId) setSessionId(res.data.data.sessionId);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.data.assistantMessage,
        timestamp: new Date()
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. Remember, you can also try the breathing exercises in the Meditation section. 💙",
        timestamp: new Date()
      }]);
    } finally { setLoading(false); }
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="page-bg min-h-screen pt-20 pb-4 px-4">
      <div className="max-w-3xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
        {/* Header */}
        <div className="glass rounded-2xl px-6 py-4 mb-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-lavender-400 to-sage-400 rounded-full flex items-center justify-center text-white text-lg">💬</div>
          <div>
            <h1 className="font-display text-xl text-gray-800">MindWell Assistant</h1>
            <p className="text-xs text-sage-600 font-sans flex items-center gap-1">
              <span className="w-2 h-2 bg-sage-400 rounded-full animate-pulse"></span> Always here for you
            </p>
          </div>
          <div className="ml-auto text-xs text-gray-400 font-sans text-right">
            <p>🔒 Private & confidential</p>
            <p>Not a substitute for professional care</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 glass rounded-2xl p-4 overflow-y-auto mb-3 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 animate-fadeIn ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm
                ${msg.role === 'user'
                  ? 'bg-sage-500 text-white'
                  : 'bg-gradient-to-br from-lavender-400 to-sage-400 text-white'}`}>
                {msg.role === 'user' ? user?.name?.[0] || 'U' : '💙'}
              </div>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`p-3 rounded-2xl text-sm font-sans leading-relaxed whitespace-pre-line
                  ${msg.role === 'user'
                    ? 'bg-sage-500 text-white rounded-tr-sm'
                    : 'bg-white border border-sage-100 text-gray-700 rounded-tl-sm shadow-sm'}`}>
                  {msg.content}
                </div>
                <span className="text-xs text-gray-400 font-sans mt-1 px-1">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lavender-400 to-sage-400 flex-shrink-0 flex items-center justify-center text-white text-sm">💙</div>
              <div className="bg-white border border-sage-100 rounded-2xl rounded-tl-sm p-3 shadow-sm">
                <div className="flex gap-1.5 items-center h-5">
                  {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-sage-400 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                className="flex-shrink-0 px-3 py-1.5 bg-white border border-sage-200 rounded-full text-xs font-sans text-sage-600 hover:bg-sage-50 transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="glass rounded-2xl p-3 flex gap-3 items-end">
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Share what's on your mind... (Enter to send)"
            className="flex-1 bg-transparent text-gray-700 font-sans text-sm resize-none focus:outline-none max-h-28 min-h-[44px]"
            rows={1} />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="w-10 h-10 bg-sage-500 rounded-xl flex items-center justify-center text-white hover:bg-sage-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0">
            →
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 font-sans mt-2 px-4">
          If you're in crisis, call 988 (Suicide & Crisis Lifeline) or text HOME to 741741
        </p>
      </div>
    </div>
  );
};

export default ChatSupport;
