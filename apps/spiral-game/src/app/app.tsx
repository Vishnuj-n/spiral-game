import { useState } from 'react';
import { SpiralSession, Question } from '@spiral-game/game-types';

export function App() {
  const [session, setSession] = useState<SpiralSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app we would upload a PDF file using FormData
      const response = await fetch('http://localhost:3333/generate/spiral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate game');
      }

      const data: SpiralSession = await response.json();
      setSession(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', color: '#e5e7eb', backgroundColor: '#111827', minHeight: '100vh' }}>
      <h1>Spiral Game</h1>
      
      {!session && (
        <div>
          <p>Welcome to Spiral Game! Click below to simulate uploading a PDF and starting a game.</p>
          <button 
            onClick={startGame} 
            disabled={loading}
            style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? 'Generating...' : 'Generate New Game'}
          </button>
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
      )}

      {session && (
        <div>
          <h2>Game Session Active</h2>
          <p><strong>Session ID:</strong> {session.sessionId}</p>
          <p><strong>Created At:</strong> {new Date(session.createdAt).toLocaleString()}</p>
          <h3>Questions Loaded ({session.questions.length}):</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {session.questions.map((q: Question) => (
              <li key={q.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #374151', borderRadius: '8px', background: '#1f2937' }}>
                <strong>Level {q.level}</strong>: {q.question} <br/>
                <span style={{color: '#9ca3af', fontSize: '0.9em'}}>(Score points: {q.points})</span>
                <ul style={{ marginTop: '0.5rem' }}>
                  {q.options.map((opt, i) => (
                    <li key={i} style={{ color: i === q.correctIndex ? '#10b981' : 'inherit' }}>
                      {opt} {i === q.correctIndex && '✓'}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
