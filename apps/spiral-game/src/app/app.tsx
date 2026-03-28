import { useState, useEffect } from 'react';
import { SpiralSession } from '@spiral-game/game-types';
import { useSpiralGame } from './hooks/useSpiralGame';
import { QuestionCard } from './components/QuestionCard';

type SpiralDataFile = {
  questions: SpiralSession['questions'];
};

export function App() {
  const [session, setSession] = useState<SpiralSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [jsonUrl, setJsonUrl] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [inputMode, setInputMode] = useState<'url' | 'json' | 'default'>('default');

  const game = useSpiralGame(session);

  // Restore session from cache
  useEffect(() => {
    const cached = localStorage.getItem('spiral_active_session');
    if (cached) {
      try {
        setSession(JSON.parse(cached));
      } catch(e) {}
    }
  }, []);

  const startWithSessionData = (questions: SpiralSession['questions']) => {
    try {
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid format: requires a questions array');
      }

      const data: SpiralSession = {
        sessionId: crypto.randomUUID(),
        questions: questions,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('spiral_active_session', JSON.stringify(data));
      setSession(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  };

  const startFromDefault = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/data.json');
      if (!response.ok) throw new Error('Failed to load local game data');
      const dataFile: SpiralDataFile = await response.json();
      startWithSessionData(dataFile.questions);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const startFromUrl = async () => {
    if (!jsonUrl) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(jsonUrl);
      if (!response.ok) throw new Error('Failed to load data from URL');
      const dataFile = await response.json();
      startWithSessionData(dataFile.questions || dataFile);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch external URL');
    } finally {
      setLoading(false);
    }
  };

  const startFromJSON = () => {
    setError(null);
    if (!jsonText.trim()) return setError('Please paste JSON data first');
    try {
      const parsed = JSON.parse(jsonText);
      startWithSessionData(parsed.questions || parsed);
    } catch (err: any) {
      setError('Invalid JSON format');
    }
  };

  const handlePlayAgain = () => {
    if (game) game.clearSessionCache();
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex-grow flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-5xl mx-auto">
        {!session && (
          <div className="text-center space-y-8 animate-fade-in-up w-full max-w-2xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
              Spiral
            </h1>
            
            <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-xl space-y-6">
              <div className="flex justify-center space-x-4 mb-6">
                <button onClick={() => setInputMode('default')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${inputMode === 'default' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Demo</button>
                <button onClick={() => setInputMode('url')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${inputMode === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Load API</button>
                <button onClick={() => setInputMode('json')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${inputMode === 'json' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Paste JSON</button>
              </div>

              {inputMode === 'default' && (
                <div className="space-y-4">
                  <p className="text-slate-400">Play a quick demo game using our pre-built sample questions.</p>
                  <button onClick={startFromDefault} disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    {loading ? 'Loading...' : 'Start Demo Game'}
                  </button>
                </div>
              )}

              {inputMode === 'url' && (
                <div className="space-y-4 text-left">
                  <label className="block text-sm font-medium text-slate-300">API Endpoint URL</label>
                  <input type="url" value={jsonUrl} onChange={e => setJsonUrl(e.target.value)} placeholder="https://your-api.com/generate?topic=react" className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <p className="text-xs text-slate-500 -mt-2">Ensure the API returns JSON with a format like {'{ "questions": [...] }'} and has CORS enabled.</p>
                  <button onClick={startFromUrl} disabled={loading || !jsonUrl} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                    {loading ? 'Fetching Questions...' : 'Load & Play'}
                  </button>
                </div>
              )}

              {inputMode === 'json' && (
                <div className="space-y-4 text-left">
                  <label className="block text-sm font-medium text-slate-300">Raw JSON Payload</label>
                  <textarea value={jsonText} onChange={e => setJsonText(e.target.value)} placeholder='{ "questions": [ { "level": 1, ... } ] }' rows={6} className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"></textarea>
                  <button onClick={startFromJSON} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    Parse & Play
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mx-auto max-w-lg mt-4 p-4 bg-red-900/50 border border-red-500/50 rounded-2xl text-red-200 font-medium">
                {error}
              </div>
            )}
          </div>
        )}

        {session && game && game.status === 'playing' && game.currentQuestion && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <QuestionCard 
              question={game.currentQuestion}
              currentScore={game.score}
              nextScore={game.nextScore}
              currentLevel={game.currentLevelNumber}
              totalLevels={game.totalLevels}
              onAnswer={(idx) => game.answerQuestion(idx)}
            />
          </div>
        )}

        {session && game && game.status === 'decision' && (
          <div className="text-center space-y-8 animate-fade-in">
            <h2 className="text-4xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
              Correct!
            </h2>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 max-w-lg mx-auto shadow-2xl">
              <p className="text-slate-300 text-lg mb-2">You currently have <strong className="text-white text-2xl">{game.score}</strong> points.</p>
              <p className="text-amber-400 text-sm mb-6 font-medium">⚠️ Cashing out now will apply a 20% penalty — you will receive <strong className="text-white">{Math.floor(game.score * 0.8)}</strong> pts.</p>
              <p className="text-slate-400 mb-8">Risk it all for the next level, or lock in your reduced score now?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={game.cashOut}
                  className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 font-bold rounded-xl transition-all"
                >
                  Cash Out ({Math.floor(game.score * 0.8)} pts)
                </button>
                <button 
                  onClick={game.continueGame}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
                >
                  Risk It & Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {session && game && game.status === 'finished' && (
          <div className="text-center space-y-8 animate-fade-in">
            {game.endReason === 'wrong_answer' && (
              <h2 className="text-4xl font-bold text-red-500 mb-2">Game Over!</h2>
            )}
            {game.endReason === 'cashed_out' && (
              <h2 className="text-4xl font-bold text-blue-400 mb-2">Smart Choice!</h2>
            )}
            {game.endReason === 'completed' && (
              <h2 className="text-4xl font-bold text-yellow-400 mb-2 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">Spiral Master!</h2>
            )}

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 max-w-lg mx-auto shadow-2xl">
              <p className="text-slate-400 text-lg mb-4">
                {game.endReason === 'wrong_answer' && 'You answered incorrectly.'}
                {game.endReason === 'cashed_out' && 'You successfully cashed out.'}
                {game.endReason === 'completed' && 'You completed all the levels!'}
              </p>
              <div className="py-6 border-y border-slate-800 my-6">
                <p className="text-sm text-slate-500 uppercase tracking-widest mb-2">Final Score</p>
                <div className="text-6xl font-black text-white">{game.score}</div>
              </div>
              <p className="text-slate-400 mb-8">Level Reached: {game.currentLevelNumber} / {game.totalLevels}</p>
              
              <button 
                onClick={handlePlayAgain}
                className="px-8 py-3 bg-slate-100 hover:bg-white text-slate-900 font-bold rounded-xl transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
