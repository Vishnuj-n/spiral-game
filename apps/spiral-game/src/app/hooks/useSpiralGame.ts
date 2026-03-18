import { useState, useEffect } from 'react';
import { SpiralSession } from '@spiral-game/game-types';
import { calculateScore } from '@spiral-game/game-utils';

export type GameStatus = 'playing' | 'decision' | 'finished';
export type EndReason = 'wrong_answer' | 'cashed_out' | 'completed';

export function useSpiralGame(session: SpiralSession | null) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [endReason, setEndReason] = useState<EndReason | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (session) {
      resetGame();
    }
  }, [session?.sessionId]);

  if (!session) return null;

  const currentQuestion = session.questions[currentLevelIndex];
  
  // Potential score if they answer current question correctly
  const nextScore = score + (currentQuestion?.points || 0);

  const answerQuestion = (selectedIndex: number) => {
    if (status !== 'playing' || !currentQuestion) return;

    if (selectedIndex === currentQuestion.correctIndex) {
      // Correct answer!
      const newScore = calculateScore(session.questions, currentLevelIndex + 1);
      setScore(newScore);

      if (currentLevelIndex >= session.questions.length - 1) {
        // Automatically finished, completed all questions
        setStatus('finished');
        setEndReason('completed');
      } else {
        // Move to decision phase (Continue or Cash out)
        setStatus('decision');
      }
    } else {
      // Wrong answer
      setStatus('finished');
      setEndReason('wrong_answer');
      setScore(0); // Player risked and lost everything
    }
  };

  const cashOut = () => {
    if (status !== 'decision') return;
    setStatus('finished');
    setEndReason('cashed_out');
    // Score remains the same
  };

  const continueGame = () => {
    if (status !== 'decision') return;
    setCurrentLevelIndex((prev) => prev + 1);
    setStatus('playing');
  };

  const resetGame = () => {
    setCurrentLevelIndex(0);
    setStatus('playing');
    setEndReason(null);
    setScore(0);
  };

  return {
    status,
    endReason,
    currentQuestion,
    currentLevelNumber: currentLevelIndex + 1,
    totalLevels: session.questions.length,
    score,
    nextScore,
    answerQuestion,
    cashOut,
    continueGame,
    resetGame,
  };
}
