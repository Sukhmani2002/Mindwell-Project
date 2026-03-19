import React, { useState, useRef, useEffect } from 'react';

// Using freely available audio from the web (royalty-free nature sounds via URL)
const TRACKS = [
  { id: 1, title: 'Gentle Rain', category: 'Rain Sounds', emoji: '🌧️', color: '#60a5fa',
    // Using a simple audio oscillator as placeholder — real app would use actual audio files
    frequency: 200, type: 'rain' },
  { id: 2, title: 'Ocean Waves', category: 'Ocean Waves', emoji: '🌊', color: '#0ea5e9',
    frequency: 150, type: 'ocean' },
  { id: 3, title: 'Forest Birds', category: 'Forest Sounds', emoji: '🌲', color: '#548255',
    frequency: 800, type: 'forest' },
  { id: 4, title: 'Meditation Bells', category: 'Meditation Music', emoji: '🔔', color: '#8b5cf6',
    frequency: 440, type: 'bells' },
  { id: 5, title: 'Piano Serenity', category: 'Piano Relaxation', emoji: '🎹', color: '#f97316',
    frequency: 261, type: 'piano' },
  { id: 6, title: 'Tibetan Bowls', category: 'Meditation Music', emoji: '🪬', color: '#a78bfa',
    frequency: 396, type: 'bowls' },
];

const useAudioContext = () => {
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);

  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctxRef.current;
  };

  const stop = () => {
    nodesRef.current.forEach(n => { try { n.stop(); } catch {} });
    nodesRef.current = [];
  };

  const play = (track, volume = 0.5) => {
    stop();
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.connect(ctx.destination);

    // Create layered oscillators to simulate nature sounds
    const layers = track.type === 'rain' ? [
      { freq: 100, type: 'sawtooth', gain: 0.02 },
      { freq: 200, type: 'sawtooth', gain: 0.015 },
      { freq: 400, type: 'sawtooth', gain: 0.01 },
    ] : track.type === 'ocean' ? [
      { freq: 80, type: 'sawtooth', gain: 0.025 },
      { freq: 160, type: 'sawtooth', gain: 0.015 },
    ] : track.type === 'bells' || track.type === 'bowls' ? [
      { freq: track.frequency, type: 'sine', gain: 0.08 },
      { freq: track.frequency * 2, type: 'sine', gain: 0.04 },
    ] : [
      { freq: track.frequency, type: 'sine', gain: 0.05 },
      { freq: track.frequency * 1.25, type: 'sine', gain: 0.03 },
    ];

    layers.forEach(l => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = l.type;
      osc.frequency.setValueAtTime(l.freq, ctx.currentTime);

      if (track.type === 'rain' || track.type === 'ocean') {
        // Add LFO for movement
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.3, ctx.currentTime);
        lfoGain.gain.setValueAtTime(l.freq * 0.3, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        nodesRef.current.push(lfo);
      }

      g.gain.setValueAtTime(l.gain, ctx.currentTime);
      osc.connect(g);
      g.connect(gainNode);
      osc.start();
      nodesRef.current.push(osc);
    });

    return gainNode;
  };

  return { play, stop };
};

const Music = () => {
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [loop, setLoop] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const gainRef = useRef(null);
  const audio = useAudioContext();

  const categories = ['All', ...new Set(TRACKS.map(t => t.category))];
  const filtered = activeCategory === 'All' ? TRACKS : TRACKS.filter(t => t.category === activeCategory);

  const togglePlay = (track) => {
    if (playing?.id === track.id) {
      audio.stop();
      setPlaying(null);
    } else {
      gainRef.current = audio.play(track, volume);
      setPlaying(track);
    }
  };

  const handleVolume = (v) => {
    setVolume(v);
    if (gainRef.current) gainRef.current.gain.setValueAtTime(v, gainRef.current.context.currentTime);
  };

  useEffect(() => () => audio.stop(), []);

  return (
    <div className="page-bg min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-gray-800 mb-2">Music Therapy</h1>
          <p className="text-gray-500 font-sans">Healing soundscapes for your mind and soul</p>
        </div>

        {/* Now playing banner */}
        {playing && (
          <div className="glass rounded-2xl p-5 mb-6 border border-sage-200 animate-slideUp">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
                style={{ background: playing.color + '20' }}>
                {playing.emoji}
              </div>
              <div className="flex-1">
                <p className="font-sans text-xs text-gray-400 mb-0.5">Now Playing</p>
                <h3 className="font-display text-xl text-gray-800">{playing.title}</h3>
                <p className="text-xs text-gray-500 font-sans">{playing.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1 rounded-full animate-pulse"
                      style={{ height: `${8 + Math.random() * 16}px`, background: playing.color, animationDelay: `${i * 0.15}s` }}></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm">🔇</span>
              <input type="range" min="0" max="1" step="0.01" value={volume}
                onChange={e => handleVolume(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none accent-sage-500" />
              <span className="text-sm">🔊</span>
              <button onClick={() => setLoop(!loop)}
                className={`px-3 py-1 rounded-lg text-xs font-sans font-medium transition-colors
                  ${loop ? 'bg-sage-100 text-sage-700' : 'bg-gray-100 text-gray-500'}`}>
                🔁 Loop
              </button>
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-all
                ${activeCategory === cat ? 'bg-sage-500 text-white' : 'bg-white border border-sage-200 text-gray-600 hover:bg-sage-50'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Track grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(track => {
            const isPlaying = playing?.id === track.id;
            return (
              <button key={track.id} onClick={() => togglePlay(track)}
                className={`p-5 rounded-2xl text-left transition-all card-hover border-2
                  ${isPlaying ? 'border-2 shadow-lg scale-105' : 'border-transparent bg-white hover:border-gray-100'}`}
                style={isPlaying ? { borderColor: track.color, background: track.color + '10' } : {}}>
                <div className="text-4xl mb-3">{track.emoji}</div>
                <h3 className="font-display text-lg text-gray-700 mb-0.5">{track.title}</h3>
                <p className="text-xs text-gray-400 font-sans mb-3">{track.category}</p>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm transition-transform
                  ${isPlaying ? 'scale-110' : ''}`}
                  style={{ background: track.color }}>
                  {isPlaying ? '⏸' : '▶'}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 p-4 glass rounded-2xl text-center">
          <p className="text-xs text-gray-400 font-sans">
            🎵 Sounds generated using Web Audio API. For the best experience, use headphones in a quiet space.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Music;
