import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- BUBBLE POP GAME ---
const BubblePop = () => {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(false);

  const addBubble = useCallback(() => {
    const id = Date.now() + Math.random();
    const size = 40 + Math.random() * 60;
    setBubbles(prev => [...prev.slice(-20), {
      id, size,
      left: 5 + Math.random() * 85,
      duration: 6 + Math.random() * 8,
      delay: 0,
      color: ['#a78bfa', '#548255', '#60a5fa', '#f97316', '#f472b6'][Math.floor(Math.random() * 5)]
    }]);
  }, []);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(addBubble, 800);
    return () => clearInterval(interval);
  }, [active, addBubble]);

  const pop = (id) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-xl text-gray-700">Bubble Pop</h3>
          <p className="text-xs text-gray-500 font-sans">Pop bubbles to release stress</p>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl text-sage-600">{score}</div>
          <div className="text-xs text-gray-400 font-sans">bubbles popped</div>
        </div>
      </div>
      <div className="relative bg-gradient-to-b from-calm-50 to-lavender-50 rounded-2xl overflow-hidden h-64 border border-calm-200">
        {bubbles.map(b => (
          <button key={b.id} onClick={() => pop(b.id)}
            className="absolute rounded-full transition-transform hover:scale-95 active:scale-75 cursor-pointer"
            style={{
              width: b.size, height: b.size, left: `${b.left}%`,
              bottom: '-80px', background: `radial-gradient(circle at 35% 35%, ${b.color}aa, ${b.color}44)`,
              border: `2px solid ${b.color}66`, animation: `bubble-float ${b.duration}s linear`,
              boxShadow: `inset -4px -4px 8px rgba(255,255,255,0.3), 0 0 12px ${b.color}44`
            }} />
        ))}
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button onClick={() => setActive(true)} className="btn-primary">Start Popping! 🫧</button>
          </div>
        )}
      </div>
      {active && <div className="flex gap-2 mt-3">
        <button onClick={() => { setActive(false); setBubbles([]); setScore(0); }} className="btn-secondary text-sm px-4 py-2">Reset</button>
      </div>}
    </div>
  );
};

// --- MEMORY MATCH ---
const CARD_EMOJIS = ['🌸', '🌿', '🦋', '🌊', '⭐', '🌙', '🕊️', '🌺'];
const MemoryMatch = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);

  const init = () => {
    const deck = [...CARD_EMOJIS, ...CARD_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji }));
    setCards(deck); setFlipped([]); setMatched([]); setMoves(0); setStarted(true);
  };

  const flip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(i => cards[i]);
      if (a.emoji === b.emoji) {
        setMatched(prev => [...prev, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const won = matched.length === cards.length && cards.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-xl text-gray-700">Memory Match</h3>
          <p className="text-xs text-gray-500 font-sans">Improve focus and memory</p>
        </div>
        {started && <div className="text-right">
          <div className="font-display text-xl text-lavender-600">{moves}</div>
          <div className="text-xs text-gray-400 font-sans">moves</div>
        </div>}
      </div>
      {!started ? (
        <div className="text-center py-10">
          <div className="text-5xl mb-3">🧩</div>
          <button onClick={init} className="btn-primary">Start Game</button>
        </div>
      ) : won ? (
        <div className="text-center py-10">
          <div className="text-5xl mb-3">🎉</div>
          <p className="font-display text-2xl text-gray-700 mb-2">You did it!</p>
          <p className="text-gray-500 font-sans text-sm mb-4">Completed in {moves} moves</p>
          <button onClick={init} className="btn-primary">Play Again</button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {cards.map((card, i) => {
            const isFlipped = flipped.includes(i) || matched.includes(i);
            return (
              <button key={card.id} onClick={() => flip(i)}
                className={`h-14 rounded-xl text-xl transition-all duration-300 border-2 font-sans
                  ${isFlipped ? 'bg-lavender-50 border-lavender-300 scale-95' : 'bg-white border-gray-200 hover:border-lavender-200 hover:bg-lavender-50'}
                  ${matched.includes(i) ? 'opacity-50' : ''}`}>
                {isFlipped ? card.emoji : '❓'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- COLOR BREATHING ---
const ColorBreathing = () => {
  const [phase, setPhase] = useState('ready');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const intervalRef = useRef(null);

  const PHASES = [
    { name: 'Inhale', duration: 4, color: '#548255', size: '1.4' },
    { name: 'Hold', duration: 4, color: '#8b5cf6', size: '1.4' },
    { name: 'Exhale', duration: 4, color: '#0ea5e9', size: '1' },
    { name: 'Hold', duration: 4, color: '#f97316', size: '1' },
  ];
  const phaseIdx = ['Inhale', 'Hold after inhale', 'Exhale', 'Hold after exhale'].indexOf(phase);
  const currentPhase = PHASES[Math.max(0, phaseIdx)] || PHASES[0];

  const start = () => {
    setPhase('Inhale'); setCount(4); setCycle(0);
    let pi = 0, c = 4;
    intervalRef.current = setInterval(() => {
      c--;
      if (c <= 0) {
        pi = (pi + 1) % PHASES.length;
        if (pi === 0) setCycle(prev => prev + 1);
        c = PHASES[pi].duration;
        setPhase(['Inhale', 'Hold after inhale', 'Exhale', 'Hold after exhale'][pi]);
      }
      setCount(c);
    }, 1000);
  };

  const stop = () => { clearInterval(intervalRef.current); setPhase('ready'); setCount(4); };
  useEffect(() => () => clearInterval(intervalRef.current), []);

  const pIdx = ['Inhale', 'Hold after inhale', 'Exhale', 'Hold after exhale'].indexOf(phase);
  const cp = PHASES[Math.max(0, pIdx)] || PHASES[0];

  return (
    <div className="text-center">
      <h3 className="font-display text-xl text-gray-700 mb-1">Color Breathing</h3>
      <p className="text-xs text-gray-500 font-sans mb-4">Follow the expanding circle</p>
      <div className="flex items-center justify-center h-52">
        <div className="relative flex items-center justify-center">
          {[1,2,3].map(i => (
            <div key={i} className="absolute rounded-full opacity-20 transition-all duration-1000"
              style={{
                width: `${80 + i*40}px`, height: `${80 + i*40}px`,
                background: cp.color,
                transform: `scale(${phase === 'ready' ? 1 : cp.size})`,
                animationDelay: `${i * 0.2}s`
              }} />
          ))}
          <div className="w-24 h-24 rounded-full flex flex-col items-center justify-center text-white relative z-10 transition-all duration-1000"
            style={{ background: cp.color, transform: `scale(${phase === 'ready' ? 1 : cp.size})` }}>
            <div className="font-display text-3xl font-light">{count}</div>
            <div className="text-xs font-sans">{phase === 'ready' ? 'Ready' : phase.split(' ')[0]}</div>
          </div>
        </div>
      </div>
      {cycle > 0 && <p className="text-xs text-gray-400 font-sans mb-2">{cycle} complete cycles</p>}
      <button onClick={phase === 'ready' ? start : stop}
        className={phase === 'ready' ? 'btn-primary' : 'btn-secondary'}>
        {phase === 'ready' ? '▶ Start Breathing' : '⏹ Stop'}
      </button>
    </div>
  );
};

// --- ZEN GARDEN ---
const ZEN_ITEMS = ['🪨', '🌸', '🌿', '⭐', '🔮', '🌙'];
const ZenGarden = () => {
  const [grid, setGrid] = useState(Array(6*5).fill(null));
  const [selected, setSelected] = useState('🪨');

  const place = (idx) => {
    const newGrid = [...grid];
    newGrid[idx] = newGrid[idx] === selected ? null : selected;
    setGrid(newGrid);
  };

  return (
    <div>
      <h3 className="font-display text-xl text-gray-700 mb-1">Zen Garden</h3>
      <p className="text-xs text-gray-500 font-sans mb-4">Arrange stones and flowers for relaxation</p>
      <div className="flex gap-2 mb-3">
        {ZEN_ITEMS.map(item => (
          <button key={item} onClick={() => setSelected(item)}
            className={`w-9 h-9 rounded-lg text-xl transition-all border-2
              ${selected === item ? 'border-sage-400 bg-sage-50 scale-110' : 'border-transparent bg-white hover:bg-gray-50'}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-1 bg-amber-50 rounded-2xl p-3 border border-amber-100">
        {grid.map((cell, i) => (
          <button key={i} onClick={() => place(i)}
            className="w-full aspect-square rounded-lg text-xl flex items-center justify-center transition-all
              hover:bg-amber-100 bg-amber-50/50 border border-amber-100">
            {cell || <span className="opacity-0 hover:opacity-20 text-amber-300 text-xs">·</span>}
          </button>
        ))}
      </div>
      <button onClick={() => setGrid(Array(30).fill(null))}
        className="mt-3 text-xs text-gray-400 font-sans hover:text-gray-600 underline">Clear garden</button>
    </div>
  );
};

const GAME_TABS = [
  { id: 'bubble', label: '🫧 Bubble Pop', component: BubblePop },
  { id: 'memory', label: '🧩 Memory Match', component: MemoryMatch },
  { id: 'breathe', label: '🌈 Color Breathing', component: ColorBreathing },
  { id: 'zen', label: '🪨 Zen Garden', component: ZenGarden },
];

const Games = () => {
  const [active, setActive] = useState('bubble');
  const ActiveGame = GAME_TABS.find(g => g.id === active)?.component || BubblePop;

  return (
    <div className="page-bg min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-gray-800 mb-2">Therapeutic Games</h1>
          <p className="text-gray-500 font-sans">Playful stress relief and mindfulness activities</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {GAME_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActive(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-sans text-sm font-medium transition-all
                ${active === tab.id ? 'bg-sage-500 text-white shadow-md' : 'bg-white border border-sage-200 text-gray-600 hover:bg-sage-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl p-6 animate-slideUp">
          <ActiveGame />
        </div>
      </div>
    </div>
  );
};

export default Games;
