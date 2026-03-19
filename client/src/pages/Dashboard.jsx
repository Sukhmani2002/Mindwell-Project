import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TIPS = [
  "Take three deep breaths. Inhale peace, exhale tension. 🌬️",
  "You don't have to control your thoughts. You just have to stop letting them control you. 🌿",
  "Small steps every day lead to big changes. Be proud of your progress. ✨",
  "It's okay to rest. Recovery is part of the journey. 💙",
  "Your feelings are valid. Acknowledging them is a sign of strength. 🌸",
  "Gratitude turns what we have into enough. Notice three good things today. 🌻",
  "You are not your thoughts. You are the awareness behind them. ☮️",
  "Be gentle with yourself. You are a child of the universe. 🌙",
];

const modules = [
  { path: '/mood', icon: '💫', title: 'Mood Tracker', desc: 'Log your feelings & track emotional patterns', color: 'from-yellow-50 to-orange-50', border: 'border-orange-100', accent: 'text-orange-500' },
  { path: '/chat', icon: '💬', title: 'AI Chat Support', desc: 'Talk to your empathetic AI companion', color: 'from-lavender-50 to-purple-50', border: 'border-lavender-200', accent: 'text-lavender-600' },
  { path: '/meditate', icon: '🧘', title: 'Meditation', desc: 'Guided meditation & breathing exercises', color: 'from-sage-50 to-green-50', border: 'border-sage-200', accent: 'text-sage-600' },
  { path: '/music', icon: '🎵', title: 'Music Therapy', desc: 'Relaxing soundscapes for peace of mind', color: 'from-blue-50 to-calm-50', border: 'border-calm-200', accent: 'text-calm-500' },
  { path: '/games', icon: '🎮', title: 'Therapeutic Games', desc: 'Stress-relief games for mental clarity', color: 'from-pink-50 to-rose-50', border: 'border-pink-200', accent: 'text-pink-500' },
  { path: '/profile', icon: '⚙️', title: 'Settings', desc: 'Manage your profile & preferences', color: 'from-gray-50 to-slate-50', border: 'border-gray-200', accent: 'text-gray-500' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [tip, setTip] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, []);

  return (
    <div className="page-bg min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero section */}
        <div className="mb-8 animate-slideUp">
          <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sage-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-lavender-100 to-transparent rounded-tr-full opacity-50"></div>
            <div className="relative">
              <p className="font-sans text-sage-600 text-sm font-medium mb-1">{greeting} 👋</p>
              <h1 className="font-display text-4xl md:text-5xl text-gray-800 font-light mb-3">
                {user?.name?.split(' ')[0]}, <span className="text-sage-600 italic">how are you feeling today?</span>
              </h1>
              <p className="text-gray-500 font-sans text-base max-w-xl leading-relaxed">
                Your mental wellness matters. Take a moment for yourself today.
              </p>
              <Link to="/mood" className="btn-primary inline-flex items-center gap-2 mt-6">
                <span>Log Today's Mood</span> <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Daily tip */}
        <div className="mb-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="bg-gradient-to-r from-sage-500 to-lavender-600 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-20">💡</div>
            <p className="font-sans text-sage-100 text-xs font-medium mb-1 uppercase tracking-wider">Daily Reflection</p>
            <p className="font-display text-xl text-white font-light italic">{tip}</p>
          </div>
        </div>

        {/* Modules grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod, i) => (
            <Link key={mod.path} to={mod.path}
              className={`card-hover glass rounded-2xl p-6 border ${mod.border} bg-gradient-to-br ${mod.color} animate-slideUp`}
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
              <div className="text-4xl mb-3">{mod.icon}</div>
              <h3 className={`font-display text-xl font-medium ${mod.accent} mb-1`}>{mod.title}</h3>
              <p className="font-sans text-gray-500 text-sm leading-relaxed">{mod.desc}</p>
              <div className={`mt-3 flex items-center gap-1 text-xs font-sans font-medium ${mod.accent}`}>
                Open <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Wellness reminder */}
        <div className="mt-8 text-center animate-slideUp" style={{ animationDelay: '0.6s' }}>
          <p className="text-gray-400 font-sans text-sm">
            🔒 Your data is private & secure. MindWell is a supportive tool, not a replacement for professional care.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
