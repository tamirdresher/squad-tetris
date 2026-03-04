import type { TetrominoType } from '@squad-tetris/game-engine';
import { getTetrominoColor, getTetrominoShape } from '@squad-tetris/game-engine';
import './NextPiece.css';

interface NextPieceProps {
  nextPiece: TetrominoType;
}

export function NextPiece({ nextPiece }: NextPieceProps) {
  const shape = getTetrominoShape(nextPiece, 0);
  const color = getTetrominoColor(nextPiece);

  return (
    <div className="next-piece-container">
      <h3 className="next-piece-title">Next</h3>
      <div className="next-piece-preview">
        {shape.map((row, y) => (
          <div key={y} className="next-piece-row">
            {row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={`next-cell ${cell ? 'filled' : 'empty'}`}
                style={{
                  backgroundColor: cell ? color : 'transparent',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
