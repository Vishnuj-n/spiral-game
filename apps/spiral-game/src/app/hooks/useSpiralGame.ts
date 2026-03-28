import { useState, useEffect } from 'react';
import { SpiralSession, GameResult } from '@spiral-game/game-types';
import { calculateScore } from '@spiral-game/game-utils';

export type GameStatus = 'playing' | 'decision' | 'finished';
export type EndReason = 'wrong_answer' | 'cashed_out' | 'completed';

interface PersistedState {
  currentLevelIndex: number;
  status: GameStatus;
  endReason: EndReason | null;
  score: number;
}

export function useSpiralGame(session: SpiralSession | null) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [endReason, setEndReason] = useState<EndReason | null>(null);
  const [score, setScore] = useState(0);

  // Load state from localStorage on session mount (Sprint 9)
  useEffect(() => {
    if (session?.sessionId) {
      const saved = localStorage.getItem(`spiral_game_state_${session.sessionId}`);
      if (saved) {
        try {
          const parsed: PersistedState = JSON.parse(saved);
          setCurrentLevelIndex(parsed.currentLevelIndex);
          setStatus(parsed.status);
          setEndReason(parsed.endReason);
          setScore(parsed.score);
        } catch {
          console.error("Failed to parse game state");
        }
      } else {
        // Only reset if NO explicit saved state exists for THIS session
        resetGame();
      }
    }
  }, [session?.sessionId]);

  // Save state continuously (Sprint 9)
  useEffect(() => {
    if (session?.sessionId) {
      const stateToSave: PersistedState = { currentLevelIndex, status, endReason, score };
      localStorage.setItem(`spiral_game_state_${session.sessionId}`, JSON.stringify(stateToSave));
    }
  }, [session?.sessionId, currentLevelIndex, status, endReason, score]);

  const persistResult = (finalScore: number, levelsReached: number, cashedOut: boolean) => {
    if (!session) return;

    const payload: GameResult = {
      sessionId: session.sessionId,
      finalScore,
      levelsReached,
      cashedOut,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(`spiral_result_${session.sessionId}`, JSON.stringify(payload));
  };

  const handleGameOver = (finalScore: number, isCashedOut: boolean, reason: EndReason) => {
    setStatus('finished');
    setEndReason(reason);
    setScore(finalScore);
    persistResult(finalScore, currentLevelIndex, isCashedOut);
  };

  if (!session) return null;

  const currentQuestion = session.questions[currentLevelIndex];
  const nextScore = score + (currentQuestion?.points || 0);

  const answerQuestion = (selectedIndex: number) => {
    if (status !== 'playing' || !currentQuestion) return;

    if (selectedIndex === currentQuestion.correctIndex) {
      const newScore = calculateScore(session.questions, currentLevelIndex + 1);
      setScore(newScore);

      if (currentLevelIndex >= session.questions.length - 1) {
        handleGameOver(newScore, false, 'completed');
      } else {
        setStatus('decision');
      }
    } else {
      // Wrong answer - lose everything!
      handleGameOver(0, false, 'wrong_answer');
    }
  };

  const CASHOUT_PENALTY = 0.20; // 20% penalty for cashing out early

  const cashOut = () => {
    if (status !== 'decision') return;
    const penalizedScore = Math.floor(score * (1 - CASHOUT_PENALTY));
    handleGameOver(penalizedScore, true, 'cashed_out');
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

  // Called when playing again to forcefully clear local storage for old session
  const clearSessionCache = () => {
    if (session?.sessionId) {
      localStorage.removeItem(`spiral_game_state_${session.sessionId}`);
      localStorage.removeItem('spiral_active_session');
    }
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
    clearSessionCache,
  };
}
