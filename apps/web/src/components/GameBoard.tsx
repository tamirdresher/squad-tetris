import type { Board, Piece } from '@squad-tetris/game-engine';
import { getTetrominoColor, getTetrominoShape } from '@squad-tetris/game-engine';
import './GameBoard.css';

interface GameBoardProps {
  board: Board;
  currentPiece?: Piece;
}

export function GameBoard({ board, currentPiece }: GameBoardProps) {
  // Create a visual board that merges the static board with the current piece
  const visualBoard = board.map(row => [...row]);

  // Overlay the current piece on the visual board
  if (currentPiece) {
    const shape = getTetrominoShape(currentPiece.type, currentPiece.rotation);
    shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const boardY = currentPiece.position.y + dy;
          const boardX = currentPiece.position.x + dx;
          if (
            boardY >= 0 &&
            boardY < visualBoard.length &&
            boardX >= 0 &&
            boardX < visualBoard[0].length
          ) {
            visualBoard[boardY][boardX] = currentPiece.type;
          }
        }
      });
    });
  }

  return (
    <div className="game-board-container">
      <div className="game-board">
        {visualBoard.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`cell ${cell ? 'filled' : 'empty'}`}
              style={{
                backgroundColor: cell ? getTetrominoColor(cell) : undefined,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
