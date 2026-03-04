import { BOARD_WIDTH, BOARD_HEIGHT, type Board, type Piece } from './index';
import { getPieceCoordinates } from './pieces';

/** Check if a piece collides with walls, floor, or existing blocks */
export function checkCollision(board: Board, piece: Piece): boolean {
  const coords = getPieceCoordinates(piece);
  for (const { x, y } of coords) {
    if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
      return true;
    }
    // Allow cells above the board (y < 0) during spawn
    if (y < 0) continue;
    if (board[y][x] !== null) {
      return true;
    }
  }
  return false;
}

/** Inverse of checkCollision — true if position is valid */
export function isValidPosition(board: Board, piece: Piece): boolean {
  return !checkCollision(board, piece);
}
