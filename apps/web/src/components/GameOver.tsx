import type { GameState } from '@squad-tetris/game-engine';
import './GameOver.css';

interface GameOverProps {
  gameState: GameState;
  onPlayAgain: () => void;
}

export function GameOver({ gameState, onPlayAgain }: GameOverProps) {
  const { score, level, linesCleared } = gameState;

  // Get high score from localStorage
  const highScore = parseInt(localStorage.getItem('tetris-high-score') || '0', 10);
  const isNewHighScore = score > highScore;

  // Update high score if needed
  if (isNewHighScore) {
    localStorage.setItem('tetris-high-score', score.toString());
  }

  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h1 className="game-over-title">GAME OVER</h1>
        
        {isNewHighScore && <div className="new-high-score">🎉 New High Score!</div>}
        
        <div className="game-over-stats">
          <div className="stat">
            <span className="stat-label">Final Score</span>
            <span className="stat-value">{score.toLocaleString()}</span>
          </div>
          
          <div className="stat">
            <span className="stat-label">Level Reached</span>
            <span className="stat-value">{level}</span>
          </div>
          
          <div className="stat">
            <span className="stat-label">Lines Cleared</span>
            <span className="stat-value">{linesCleared}</span>
          </div>
          
          {highScore > 0 && !isNewHighScore && (
            <div className="stat">
              <span className="stat-label">High Score</span>
              <span className="stat-value high-score">{highScore.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        <button className="play-again-button" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}
