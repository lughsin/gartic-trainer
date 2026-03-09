import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Star, Timer, Undo2 } from 'lucide-react';
import { useTrainerStore } from '@/store/trainerStore';
import { scorePractice } from '@/features/trainer/scoring';
import { usePracticeCanvas } from '@/canvas/usePracticeCanvas';

const speeds = [0.5, 1, 1.5, 2];

export default function App() {
  const store = useTrainerStore();
  const word = store.selectedWord;
  const filtered = store.filteredWords();
  const [confidence, setConfidence] = useState(3);
  const [undoCount, setUndoCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const canvas = usePracticeCanvas();

  const avgScore = useMemo(() => {
    if (!store.history.length) return 0;
    return Math.round(store.history.reduce((acc, h) => acc + h.score, 0) / store.history.length);
  }, [store.history]);

  return (
    <div className="min-h-screen bg-bg text-slate-100 p-4">
      <div className="grid grid-cols-[320px_1fr_300px] gap-4">
        <aside className="bg-panel rounded-2xl p-4 shadow-neon">
          <h1 className="text-2xl font-bold text-neonCyan">Gartic Draw Trainer</h1>
          <input className="w-full mt-3 rounded-xl bg-slate-900 p-2" placeholder="Search word..." onChange={(e) => store.setQuery(e.target.value)} />
          <select className="w-full mt-2 rounded-xl bg-slate-900 p-2" onChange={(e) => store.setCategoryFilter(e.target.value)}>
            <option value="all">All categories</option>
            {[...new Set(store.words.map((w) => w.category))].map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="w-full mt-2 rounded-xl bg-slate-900 p-2" onChange={(e) => store.setDifficultyFilter(e.target.value as never)}>
            <option value="all">All difficulties</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option><option value="abstract">Abstract</option><option value="ambiguous">Ambiguous</option>
          </select>
          <div className="mt-4 max-h-[60vh] overflow-auto space-y-2">
            {filtered.slice(0, 120).map((item) => (
              <button key={item.id} onClick={() => store.selectWord(item.id)} className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700">
                <div className="font-semibold">{item.word}</div>
                <div className="text-xs text-slate-400">{item.category} · {item.difficulty}</div>
              </button>
            ))}
          </div>
        </aside>

        <main className="bg-panel rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">{word.word}</h2>
              <p className="text-slate-300">Key feature: <span className="text-neonYellow">{word.keyFeature}</span></p>
            </div>
            <button onClick={() => store.toggleFavorite(word.id)} className="p-2 rounded-full bg-slate-800"><Star /></button>
          </div>
          <ol className="mt-4 list-decimal pl-5 space-y-2">{word.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          <div className="mt-4 flex items-center gap-2">
            {speeds.map((s) => <button key={s} onClick={() => setSpeed(s)} className="px-3 py-1 rounded-lg bg-slate-800">{s}x</button>)}
            <button onClick={() => setPlaying((p) => !p)} className="px-3 py-1 rounded-lg bg-neonCyan text-slate-900 flex items-center gap-1"><Play size={16} />{playing ? 'Pause' : 'Ghost Replay'}</button>
          </div>
          <motion.canvas
            ref={canvas.canvasRef}
            width={900}
            height={520}
            className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-900"
            onPointerDown={(e) => canvas.onPointerDown({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
            onPointerMove={(e) => canvas.onPointerMove({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
            onPointerUp={canvas.onPointerUp}
            animate={playing ? { boxShadow: ['0 0 0px #000', '0 0 20px #22d3ee'] } : {}}
            transition={{ repeat: Infinity, duration: 1 / speed }}
          />
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-slate-800 flex items-center gap-2" onClick={() => { canvas.undo(); setUndoCount((u) => u + 1); }}><Undo2 size={16} />Undo</button>
            <button className="px-3 py-2 rounded-lg bg-slate-800 flex items-center gap-2" onClick={canvas.clear}><RotateCcw size={16} />Clear</button>
            <button className="px-3 py-2 rounded-lg bg-neonPink" onClick={() => setElapsed((s) => s + 5)}><Timer size={16} className="inline" /> +5s</button>
          </div>
        </main>

        <aside className="bg-panel rounded-2xl p-4 space-y-3">
          <div className="bg-slate-900 rounded-xl p-3">
            <p>Ideal strokes: {word.idealStrokes}</p>
            <p>Estimated seconds: {word.estimatedSeconds}</p>
            <p>Your strokes: {canvas.strokes.length}</p>
            <p>Undo count: {undoCount}</p>
            <p>Elapsed: {elapsed}s</p>
          </div>
          <label>Confidence {confidence}/5</label>
          <input type="range" min={1} max={5} value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} className="w-full" />
          <button
            className="w-full rounded-xl bg-neonOrange py-2 text-slate-900 font-semibold"
            onClick={() => {
              const result = scorePractice(word, elapsed || word.estimatedSeconds, canvas.strokes.length, undoCount, confidence);
              store.addHistory(result);
            }}
          >Finish Practice</button>
          <div className="bg-slate-900 rounded-xl p-3">
            <p className="text-neonCyan font-semibold">Analytics</p>
            <p>Attempts: {store.history.length}</p>
            <p>Average score: {avgScore}</p>
            <p>Weakness mode picks: {store.history.slice(-5).map((h) => h.wordId).join(', ') || '—'}</p>
          </div>
          {store.history[0] && <ul className="text-sm space-y-1">{store.history[0].feedback.map((f) => <li key={f}>• {f}</li>)}</ul>}
        </aside>
      </div>
    </div>
  );
}
