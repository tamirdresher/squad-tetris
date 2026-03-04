import './ScoreBoard.css';

interface ScoreBoardProps {
  score: number;
  level: number;
  linesCleared: number;
}

export function ScoreBoard({ score, level, linesCleared }: ScoreBoardProps) {
  return (
    <div className="scoreboard">
      <div className="score-item">
        <h3 className="score-label">Score</h3>
        <div className="score-value">{score.toLocaleString()}</div>
      </div>
      
      <div className="score-item">
        <h3 className="score-label">Level</h3>
        <div className="score-value">{level}</div>
      </div>
      
      <div className="score-item">
        <h3 className="score-label">Lines</h3>
        <div className="score-value">{linesCleared}</div>
      </div>
    </div>
  );
}
