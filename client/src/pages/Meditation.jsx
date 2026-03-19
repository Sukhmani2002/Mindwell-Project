import React, { useState, useEffect, useRef } from 'react';

const BREATHING = [
  { id: '478', name: '4-7-8 Breathing', desc: 'Calms nervous system', phases: [
    { label: 'Inhale', duration: 4, color: '#548255' },
    { label: 'Hold', duration: 7, color: '#8b5cf6' },
    { label: 'Exhale', duration: 8, color: '#0ea5e9' },
  ]},
  { id: 'box', name: 'Box Breathing', desc: 'Used by Navy SEALs for focus', phases: [
    { label: 'Inhale', duration: 4, color: '#548255' },
    { label: 'Hold', duration: 4, color: '#f97316' },
    { label: 'Exhale', duration: 4, color: '#0ea5e9' },
    { label: 'Hold', duration: 4, color: '#8b5cf6' },
  ]},
  { id: 'deep', name: 'Deep Breathing', desc: 'Simple relaxation technique', phases: [
    { label: 'Inhale', duration: 5, color: '#548255' },
    { label: 'Exhale', duration: 5, color: '#0ea5e9' },
  ]},
];

const MEDITATIONS = [
  { id: 'm5', title: '5-Minute Meditation', duration: 300, icon: '🌅', desc: 'Quick mindfulness reset', script: [
    { time: 0, text: "Find a comfortable position. Close your eyes gently. 🌿" },
    { time: 30, text: "Focus on your breath. Breathe naturally, without force." },
    { time: 60, text: "With each exhale, release any tension you're holding." },
    { time: 120, text: "Your mind may wander — that's okay. Gently bring it back." },
    { time: 180, text: "Feel the stillness within. You are safe, at peace." },
    { time: 240, text: "Begin to bring gentle awareness back to the room." },
    { time: 280, text: "Slowly open your eyes. Carry this peace with you. 🌸" },
  ]},
  { id: 'm10', title: '10-Minute Relaxation', duration: 600, icon: '🌊', desc: 'Deep body scan relaxation', script: [
    { time: 0, text: "Settle into stillness. Take three deep breaths. 🌊" },
    { time: 60, text: "Scan your body from head to toe. Release tension where you find it." },
    { time: 150, text: "Breathe into any area of discomfort. Let it soften." },
    { time: 240, text: "Imagine a warm, healing light filling your body with each inhale." },
    { time: 360, text: "You are fully relaxed. Rest in this moment of peace." },
    { time: 480, text: "Feel gratitude for this moment of self-care." },
    { time: 570, text: "Gently return. You are restored and at ease. 🌸" },
  ]},
];

const BreathingExercise = ({ exercise }) => {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setCount(prev => {
          const phase = exercise.phases[phaseIdx];
          if (prev + 1 >= phase.duration) {
            setPhaseIdx(pi => {
              const next = (pi + 1) % exercise.phases.length;
              if (next === 0) setCycles(c => c + 1);
              return next;
            });
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, phaseIdx, exercise]);

  const phase = exercise.phases[phaseIdx];
  const progress = (count / phase.duration) * 100;

  const reset = () => { setRunning(false); setPhaseIdx(0); setCount(0); setCycles(0); };

  return (
    <div className="text-center">
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="6"/>
          <circle cx="50" cy="50" r="45" fill="none" stroke={phase.color} strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress/100)}`}
            className="transition-all duration-1000" strokeLinecap="round"/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-display font-light text-gray-700">{phase.duration - count}</div>
          <div className="text-sm font-sans font-medium" style={{ color: phase.color }}>{phase.label}</div>
          {cycles > 0 && <div className="text-xs text-gray-400 font-sans mt-1">{cycles} cycles</div>}
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={() => setRunning(!running)}
          className={`px-6 py-2 rounded-xl font-sans text-sm font-medium transition-all ${running ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'btn-primary'}`}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={reset} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-sans hover:bg-gray-200 transition-colors">
          ↺ Reset
        </button>
      </div>
    </div>
  );
};

const MeditationTimer = ({ med }) => {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && elapsed < med.duration) {
      intervalRef.current = setInterval(() => setElapsed(prev => {
        if (prev + 1 >= med.duration) { setRunning(false); return med.duration; }
        return prev + 1;
      }), 1000);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [running, elapsed, med.duration]);

  const currentScript = med.script.filter(s => s.time <= elapsed).slice(-1)[0];
  const remaining = med.duration - elapsed;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const progress = (elapsed / med.duration) * 100;

  return (
    <div className="text-center">
      <div className="relative w-44 h-44 mx-auto mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="5"/>
          <circle cx="50" cy="50" r="42" fill="none" stroke="#548255" strokeWidth="5"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress/100)}`}
            className="transition-all duration-1000" strokeLinecap="round"/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-display font-light text-gray-700">{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</div>
          <div className="text-xs text-sage-600 font-sans">remaining</div>
        </div>
      </div>
      {currentScript && <p className="text-sm text-gray-600 font-sans italic mb-4 px-6 min-h-[40px]">{currentScript.text}</p>}
      <div className="flex gap-3 justify-center">
        <button onClick={() => setRunning(!running)}
          className={`px-6 py-2 rounded-xl font-sans text-sm font-medium ${running ? 'bg-orange-100 text-orange-700' : 'btn-primary'}`}>
          {elapsed >= med.duration ? '✓ Complete' : running ? '⏸ Pause' : elapsed > 0 ? '▶ Resume' : '▶ Begin'}
        </button>
        {elapsed > 0 && <button onClick={() => { setRunning(false); setElapsed(0); }}
          className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-sans hover:bg-gray-200">↺</button>}
      </div>
    </div>
  );
};

const Meditation = () => {
  const [activeTab, setActiveTab] = useState('breathing');
  const [activeExercise, setActiveExercise] = useState(BREATHING[0]);
  const [activeMed, setActiveMed] = useState(MEDITATIONS[0]);

  return (
    <div className="page-bg min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-gray-800 mb-2">Meditation & Breathing</h1>
          <p className="text-gray-500 font-sans">Find your inner calm through mindful practice</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[['breathing', '🌬️ Breathing'], ['meditation', '🧘 Meditation']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-5 py-2 rounded-xl font-sans text-sm font-medium transition-all
                ${activeTab === key ? 'bg-sage-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-sage-50 border border-sage-200'}`}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'breathing' && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {BREATHING.map(ex => (
              <button key={ex.id} onClick={() => setActiveExercise(ex)}
                className={`p-4 rounded-2xl border-2 text-left transition-all card-hover
                  ${activeExercise.id === ex.id ? 'border-sage-400 bg-sage-50' : 'border-gray-200 bg-white hover:border-sage-200'}`}>
                <div className="font-display text-lg text-gray-700 mb-1">{ex.name}</div>
                <div className="text-xs text-gray-500 font-sans">{ex.desc}</div>
                <div className="flex gap-1 mt-2">
                  {ex.phases.map((p, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full font-sans" style={{ background: p.color + '20', color: p.color }}>
                      {p.label} {p.duration}s
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'meditation' && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {MEDITATIONS.map(m => (
              <button key={m.id} onClick={() => setActiveMed(m)}
                className={`p-4 rounded-2xl border-2 text-left transition-all card-hover
                  ${activeMed.id === m.id ? 'border-sage-400 bg-sage-50' : 'border-gray-200 bg-white hover:border-sage-200'}`}>
                <div className="text-3xl mb-2">{m.icon}</div>
                <div className="font-display text-lg text-gray-700">{m.title}</div>
                <div className="text-xs text-gray-500 font-sans">{m.desc} • {m.duration/60} minutes</div>
              </button>
            ))}
          </div>
        )}

        {/* Active exercise */}
        <div className="glass rounded-2xl p-8">
          {activeTab === 'breathing' ? (
            <>
              <h2 className="font-display text-2xl text-center text-gray-700 mb-6">{activeExercise.name}</h2>
              <BreathingExercise exercise={activeExercise} />
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl text-center text-gray-700 mb-2">{activeMed.icon} {activeMed.title}</h2>
              <p className="text-center text-gray-500 font-sans text-sm mb-6">{activeMed.desc}</p>
              <MeditationTimer med={activeMed} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Meditation;
