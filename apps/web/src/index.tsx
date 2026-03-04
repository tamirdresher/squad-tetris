import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createGameState } from '@squad-tetris/game-engine';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { Lobby } from './components/Lobby';
import './index.css';

type View = 'lobby' | 'game';

function App() {
  const [currentView, setCurrentView] = useState<View>('lobby');

  if (currentView === 'lobby') {
    return <Lobby onJoinGame={() => setCurrentView('game')} />;
  }

  // Create sample game state for demo
  const gameState = createGameState();
  
  // Add a sample current piece (T-piece at position 3,0)
  gameState.currentPiece = {
    type: 'T',
    position: { x: 3, y: 0 },
    rotation: 0,
  };

  return (
    <div>
      <h1>🎮 Squad Tetris</h1>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
        <GameBoard board={gameState.board} currentPiece={gameState.currentPiece} />
        <NextPiece nextPiece={gameState.nextPiece} />
      </div>
      <button 
        onClick={() => setCurrentView('lobby')}
        style={{ 
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'block',
          margin: '2rem auto'
        }}
      >
        Back to Lobby
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
