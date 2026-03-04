import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createGameState, movePiece, rotatePiece, getHardDropPosition, lockPiece, clearLines, spawnPiece, randomTetrominoType, type GameState } from '@squad-tetris/game-engine';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { useGameControls, type GameAction } from './hooks/useGameControls';
import { useGameLoop } from './hooks/useGameLoop';
import './index.css';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const state = createGameState();
    state.currentPiece = spawnPiece(state.nextPiece);
    state.nextPiece = randomTetrominoType();
    return state;
  });
  const [isPaused, setIsPaused] = useState(false);

  const lockAndSpawnNext = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.isGameOver) return prevState;
      const newBoard = lockPiece(prevState.board, prevState.currentPiece);
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);
      const newPiece = spawnPiece(prevState.nextPiece);
      const isGameOver = !movePiece(clearedBoard, newPiece, 0, 0);
      const pointsPerLine = [0, 100, 300, 500, 800];
      const points = pointsPerLine[linesCleared] * prevState.level;
      return { ...prevState, board: clearedBoard, currentPiece: isGameOver ? null : newPiece, nextPiece: randomTetrominoType(), score: prevState.score + points, linesCleared: prevState.linesCleared + linesCleared, level: Math.floor((prevState.linesCleared + linesCleared) / 10) + 1, isGameOver };
    });
  }, []);

  const handleAction = useCallback((action: GameAction) => {
    if (gameState.isGameOver) return;
    if (action === 'pause') { setIsPaused(prev => !prev); return; }
    if (isPaused) return;
    setGameState(prevState => {
      if (!prevState.currentPiece) return prevState;
      let newPiece = prevState.currentPiece;
      switch (action) {
        case 'moveLeft': newPiece = movePiece(prevState.board, prevState.currentPiece, -1, 0) || prevState.currentPiece; break;
        case 'moveRight': newPiece = movePiece(prevState.board, prevState.currentPiece, 1, 0) || prevState.currentPiece; break;
        case 'softDrop': newPiece = movePiece(prevState.board, prevState.currentPiece, 0, 1) || prevState.currentPiece; break;
        case 'rotate': newPiece = rotatePiece(prevState.board, prevState.currentPiece, 1) || prevState.currentPiece; break;
        case 'hardDrop': newPiece = getHardDropPosition(prevState.board, prevState.currentPiece); setTimeout(lockAndSpawnNext, 0); break;
      }
      return { ...prevState, currentPiece: newPiece };
    });
  }, [gameState.isGameOver, isPaused, lockAndSpawnNext]);

  const handleGravity = useCallback(() => {
    if (gameState.isGameOver || isPaused) return;
    setGameState(prevState => {
      if (!prevState.currentPiece) return prevState;
      const movedPiece = movePiece(prevState.board, prevState.currentPiece, 0, 1);
      if (!movedPiece) { lockAndSpawnNext(); return prevState; }
      return { ...prevState, currentPiece: movedPiece };
    });
  }, [gameState.isGameOver, isPaused, lockAndSpawnNext]);

  useGameControls({ onAction: handleAction, isActive: !gameState.isGameOver });
  useGameLoop({ onTick: handleGravity, isActive: !isPaused && !gameState.isGameOver, intervalMs: Math.max(100, 1000 - (gameState.level - 1) * 50) });

  return (
    <div>
      <h1>🎮 Squad Tetris</h1>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px', alignItems: 'flex-start' }}>
        <GameBoard board={gameState.board} currentPiece={gameState.currentPiece || undefined} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <NextPiece nextPiece={gameState.nextPiece} />
          <div style={{ padding: '15px', background: 'rgba(40, 40, 80, 0.6)', borderRadius: '8px', minWidth: '150px' }}>
            <div style={{ marginBottom: '10px' }}><div style={{ fontSize: '14px', opacity: 0.7 }}>Score</div><div style={{ fontSize: '24px', fontWeight: 'bold' }}>{gameState.score}</div></div>
            <div style={{ marginBottom: '10px' }}><div style={{ fontSize: '14px', opacity: 0.7 }}>Level</div><div style={{ fontSize: '20px', fontWeight: 'bold' }}>{gameState.level}</div></div>
            <div><div style={{ fontSize: '14px', opacity: 0.7 }}>Lines</div><div style={{ fontSize: '20px', fontWeight: 'bold' }}>{gameState.linesCleared}</div></div>
          </div>
          {isPaused && <div style={{ padding: '10px', background: 'rgba(160, 0, 240, 0.2)', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>PAUSED</div>}
          {gameState.isGameOver && <div style={{ padding: '15px', background: 'rgba(240, 0, 0, 0.3)', borderRadius: '8px', textAlign: 'center' }}><div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>GAME OVER</div><button onClick={() => { const newState = createGameState(); newState.currentPiece = spawnPiece(newState.nextPiece); newState.nextPiece = randomTetrominoType(); setGameState(newState); setIsPaused(false); }} style={{ padding: '8px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Play Again</button></div>}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', opacity: 0.7 }}><div>Controls: ← → ↓ for movement | ↑ or Z to rotate | Space for hard drop | P or Esc to pause</div></div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
