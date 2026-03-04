import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGameState } from '@squad-tetris/game-engine';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import './index.css';

function App() {
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
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
