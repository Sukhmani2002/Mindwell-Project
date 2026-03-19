import React, { useState, useEffect } from 'react';
import { moodAPI } from '../services/api';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const MOODS = [
  { key: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { key: 'calm', emoji: '😌', label: 'Calm', color: 'bg-sage-100 border-sage-300 text-sage-700' },
  { key: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-100 border-gray-300 text-gray-600' },
  { key: 'stressed', emoji: '😰', label: 'Stressed', color: 'bg-orange-100 border-orange-300 text-orange-700' },
  { key: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { key: 'angry', emoji: '😡', label: 'Angry', color: 'bg-red-100 border-red-300 text-red-700' },
];

const MOOD_CHART_COLORS = {
  happy: '#fbbf24', calm: '#548255', neutral: '#9ca3af',
  stressed: '#f97316', sad: '#60a5fa', angry: '#f87171'
};

const MoodTracker = () => {
  const [selected, setSelected] = useState('');
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [period, setPeriod] = useState('week');
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchHistory(); }, [period]);

  const fetchHistory = async () => {
    try {
      const res = await moodAPI.history(period);
      setHistory(res.data.data);
      setStats(res.data.stats);
    } catch {}
  };

  const handleLog = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await moodAPI.log({ mood: selected, intensity, note });
      setSuccess(true);
      setSelected(''); setNote(''); setIntensity(5);
      fetchHistory();
      setTimeout(() => setSuccess(false), 3000);
    } catch {} finally { setLoading(false); }
  };

  const barData = {
    labels: Object.keys(stats).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
    datasets: [{
      label: 'Mood Count',
      data: Object.values(stats),
      backgroundColor: Object.keys(stats).map(k => MOOD_CHART_COLORS[k] || '#9ca3af'),
      borderRadius: 8,
    }]
  };

  const doughnutData = {
    labels: Object.keys(stats).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
    datasets: [{
      data: Object.values(stats),
      backgroundColor: Object.keys(stats).map(k => MOOD_CHART_COLORS[k] || '#9ca3af'),
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  return (
    <div className="page-bg min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-gray-800 mb-2">Mood Tracker</h1>
          <p className="text-gray-500 font-sans">How are you feeling right now? Your emotions matter.</p>
        </div>

        {/* Log mood */}
        <div className="glass rounded-2xl p-6 mb-6 animate-slideUp">
          <h2 className="font-display text-2xl text-gray-700 mb-4">Log Your Mood</h2>
          {success && (
            <div className="mb-4 p-3 bg-sage-50 border border-sage-200 rounded-xl text-sage-700 text-sm font-sans text-center">
              ✨ Mood logged successfully! Keep tracking your journey.
            </div>
          )}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
            {MOODS.map(m => (
              <button key={m.key} onClick={() => setSelected(m.key)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${m.color}
                  ${selected === m.key ? 'scale-105 shadow-md ring-2 ring-offset-2 ring-sage-400' : 'hover:scale-102 opacity-70 hover:opacity-100'}`}>
                <div className="text-2xl mb-1">{m.emoji}</div>
                <div className="text-xs font-sans font-medium">{m.label}</div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="space-y-4 animate-slideUp">
              <div>
                <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                  Intensity: <span className="text-sage-600">{intensity}/10</span>
                </label>
                <input type="range" min="1" max="10" value={intensity}
                  onChange={e => setIntensity(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-sage-200 accent-sage-500" />
              </div>
              <div>
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">Add a note (optional)</label>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                  placeholder="What's on your mind? How did your day go?"
                  className="input-field resize-none h-24" maxLength={500} />
              </div>
              <button onClick={handleLog} disabled={loading}
                className="btn-primary flex items-center gap-2">
                {loading ? 'Saving...' : '💾 Save Mood Entry'}
              </button>
            </div>
          )}
        </div>

        {/* History & Charts */}
        <div className="glass rounded-2xl p-6 mb-6 animate-slideUp">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-2xl text-gray-700">Mood Insights</h2>
            <select value={period} onChange={e => setPeriod(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-sage-200 text-sm font-sans bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sage-400">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {Object.keys(stats).length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-sans text-sm text-gray-500 mb-3 font-medium">Mood Distribution</h3>
                <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
              </div>
              <div>
                <h3 className="font-sans text-sm text-gray-500 mb-3 font-medium">Mood Breakdown</h3>
                <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">📊</div>
              <p className="font-sans">No mood data for this period yet. Start logging!</p>
            </div>
          )}
        </div>

        {/* Recent history */}
        <div className="glass rounded-2xl p-6 animate-slideUp">
          <h2 className="font-display text-2xl text-gray-700 mb-4">Recent Entries</h2>
          {history.length === 0 ? (
            <p className="text-gray-400 font-sans text-center py-8">No entries yet. Log your first mood above! 🌱</p>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 10).map(entry => {
                const mood = MOODS.find(m => m.key === entry.mood);
                return (
                  <div key={entry._id} className={`flex items-start gap-3 p-3 rounded-xl border ${mood?.color || 'bg-gray-50'}`}>
                    <span className="text-2xl">{mood?.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-medium text-sm capitalize">{entry.mood} — {entry.intensity}/10</span>
                        <span className="text-xs text-gray-400 font-sans">{new Date(entry.createdAt).toLocaleDateString()}</span>
                      </div>
                      {entry.note && <p className="text-xs text-gray-500 font-sans mt-1">{entry.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
