import type { Board, Piece } from './index';
import { checkCollision } from './collision';
import { getPieceCoordinates } from './pieces';

/** Move piece left; returns new piece or null if blocked */
export function moveLeft(board: Board, piece: Piece): Piece | null {
  const moved: Piece = {
    ...piece,
    position: { ...piece.position, x: piece.position.x - 1 },
  };
  return checkCollision(board, moved) ? null : moved;
}

/** Move piece right; returns new piece or null if blocked */
export function moveRight(board: Board, piece: Piece): Piece | null {
  const moved: Piece = {
    ...piece,
    position: { ...piece.position, x: piece.position.x + 1 },
  };
  return checkCollision(board, moved) ? null : moved;
}

/** Move piece down; returns new piece or null if blocked */
export function moveDown(board: Board, piece: Piece): Piece | null {
  const moved: Piece = {
    ...piece,
    position: { ...piece.position, y: piece.position.y + 1 },
  };
  return checkCollision(board, moved) ? null : moved;
}

/** Instantly drop piece to lowest valid position */
export function hardDrop(board: Board, piece: Piece): { piece: Piece; distance: number } {
  let distance = 0;
  let current = piece;
  while (true) {
    const moved = moveDown(board, current);
    if (!moved) break;
    current = moved;
    distance++;
  }
  return { piece: current, distance };
}

/** Lock a piece onto the board, returning the new board */
export function lockPiece(board: Board, piece: Piece): Board {
  const newBoard = board.map(row => [...row]);
  for (const { x, y } of getPieceCoordinates(piece)) {
    if (y >= 0 && y < newBoard.length && x >= 0 && x < newBoard[0].length) {
      newBoard[y][x] = piece.type;
    }
  }
  return newBoard;
}
