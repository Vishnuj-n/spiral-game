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

  const startGame = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/data.json');
      if (!response.ok) throw new Error('Failed to load local game data');
      const dataFile: SpiralDataFile = await response.json();
      if (!Array.isArray(dataFile.questions) || dataFile.questions.length === 0) {
        throw new Error('Invalid local data.json format');
      }

      const data: SpiralSession = {
        sessionId: crypto.randomUUID(),
        questions: dataFile.questions,
        createdAt: new Date().toISOString(),
      };
      
      // Cache session immediately (Sprint 9)
      localStorage.setItem('spiral_active_session', JSON.stringify(data));
      setSession(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
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
          <div className="text-center space-y-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Spiral
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-md mx-auto">
              Test your knowledge, climb the levels, and decide when to cash out.
            </p>
            <button 
              onClick={startGame} 
              disabled={loading}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Loading Local Questions...' : 'Start New Game'}
            </button>
            {error && <p className="text-red-400 mt-4 font-medium">{error}</p>}
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
