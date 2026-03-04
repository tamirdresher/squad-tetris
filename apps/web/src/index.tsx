import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGameState } from '@squad-tetris/game-engine';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { ScoreBoard } from './components/ScoreBoard';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import './index.css';

function App() {
  const { theme, toggleTheme } = useTheme();

  // Create sample game state for demo
  const gameState = createGameState();
  
  // Add a sample current piece (T-piece at position 3,0)
  gameState.currentPiece = {
    type: 'T',
    position: { x: 3, y: 0 },
    rotation: 0,
  };

  // Add sample score data for demo
  gameState.score = 1500;
  gameState.level = 3;
  gameState.linesCleared = 25;

  return (
    <div>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <h1>🎮 Squad Tetris</h1>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px', alignItems: 'flex-start' }}>
        <GameBoard board={gameState.board} currentPiece={gameState.currentPiece} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <NextPiece nextPiece={gameState.nextPiece} />
          <ScoreBoard 
            score={gameState.score}
            level={gameState.level}
            linesCleared={gameState.linesCleared}
          />
        </div>
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
