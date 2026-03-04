import type { TetrominoType, Position, Piece } from './index';

/** Shape matrix: 2D array where 1 = filled cell, 0 = empty */
export type ShapeMatrix = number[][];

/** All 7 tetrominoes with 4 rotation states each (SRS standard) */
const SHAPES: Record<TetrominoType, ShapeMatrix[]> = {
  I: [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ],
  O: [
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
  ],
  T: [
    [[0,1,0],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,1],[0,1,0]],
    [[0,1,0],[1,1,0],[0,1,0]],
  ],
  S: [
    [[0,1,1],[1,1,0],[0,0,0]],
    [[0,1,0],[0,1,1],[0,0,1]],
    [[0,0,0],[0,1,1],[1,1,0]],
    [[1,0,0],[1,1,0],[0,1,0]],
  ],
  Z: [
    [[1,1,0],[0,1,1],[0,0,0]],
    [[0,0,1],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,0],[0,1,1]],
    [[0,1,0],[1,1,0],[1,0,0]],
  ],
  J: [
    [[1,0,0],[1,1,1],[0,0,0]],
    [[0,1,1],[0,1,0],[0,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]],
    [[0,1,0],[0,1,0],[1,1,0]],
  ],
  L: [
    [[0,0,1],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,0],[0,1,1]],
    [[0,0,0],[1,1,1],[1,0,0]],
    [[1,1,0],[0,1,0],[0,1,0]],
  ],
};

const ALL_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

/** Get the shape matrix for a tetromino at a given rotation */
export function getTetrominoShape(type: TetrominoType, rotation: number): ShapeMatrix {
  const normalized = ((rotation % 4) + 4) % 4;
  return SHAPES[type][normalized];
}

/** Get absolute board coordinates for all filled cells of a piece */
export function getPieceCoordinates(piece: Piece): Position[] {
  const shape = getTetrominoShape(piece.type, piece.rotation);
  const coords: Position[] = [];
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        coords.push({ x: piece.position.x + col, y: piece.position.y + row });
      }
    }
  }
  return coords;
}

/** Spawn a new piece at top-center of the board */
export function spawnPiece(type: TetrominoType): Piece {
  return {
    type,
    position: { x: 3, y: 0 },
    rotation: 0,
  };
}

/** Pick a random tetromino type */
export function randomTetrominoType(): TetrominoType {
  return ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)];
}
