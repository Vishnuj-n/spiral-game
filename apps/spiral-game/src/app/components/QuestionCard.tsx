import { useState } from 'react';
import { Question } from '@spiral-game/game-types';

interface QuestionCardProps {
  question: Question;
  currentScore: number;
  nextScore: number;
  currentLevel: number;
  totalLevels: number;
  onAnswer: (index: number) => void;
}

export function QuestionCard({ question, currentScore, nextScore, currentLevel, totalLevels, onAnswer }: QuestionCardProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null) return; // Prevent multiple clicks
    setSelectedIdx(idx);
    // Add small delay for animation before processing answer
    setTimeout(() => {
      onAnswer(idx);
      setSelectedIdx(null);
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 px-6 py-4 flex justify-between items-center border-b border-white/10">
        <div className="text-blue-300 font-bold tracking-widest text-sm uppercase">
          Level <span className="text-white text-lg ml-1">{currentLevel}</span> <span className="opacity-50 text-xs">/ {totalLevels}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-purple-300 uppercase tracking-wider">Score</span>
          <span className="text-2xl font-black text-white">{currentScore} <span className="text-sm font-medium opacity-50">pts</span></span>
        </div>
      </div>

      {/* Question Body */}
      <div className="p-8">
        <h2 className="text-2xl md:text-3xl font-medium text-white leading-tight mb-8">
          {question.question}
        </h2>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const statusClass = 
              isSelected && idx === question.correctIndex ? 'bg-green-500/80 border-green-400 text-white' :
              isSelected && idx !== question.correctIndex ? 'bg-red-500/80 border-red-400 text-white' :
              selectedIdx !== null && idx === question.correctIndex ? 'bg-green-500/80 border-green-400 text-white animate-pulse' :
              'bg-white/5 border-white/10 hover:bg-white/20 text-gray-200 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]';

            return (
              <button
                key={idx}
                disabled={selectedIdx !== null}
                onClick={() => handleSelect(idx)}
                className={`py-4 px-6 rounded-xl border text-left text-lg font-medium transition-all duration-300 transform active:scale-95 ${statusClass} ${selectedIdx !== null ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 mr-4 text-sm opacity-70">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Potential Score */}
      <div className="px-6 py-4 bg-black/40 text-center text-sm text-gray-400 border-t border-white/5">
        Correct answer awards <span className="text-green-400 font-bold mx-1">+{question.points}</span> points. Total will be <span className="text-white font-bold">{nextScore}</span>.
      </div>
    </div>
  );
}
