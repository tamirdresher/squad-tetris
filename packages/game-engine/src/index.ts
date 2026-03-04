/** Board dimensions */
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

/** Tetromino types */
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

/** Cell on the board — null means empty */
export type Cell = TetrominoType | null;

/** The game board is a 2D array of cells */
export type Board = Cell[][];

/** Position on the board */
export interface Position {
  x: number;
  y: number;
}

/** A Tetris piece with type, position, and rotation */
export interface Piece {
  type: TetrominoType;
  position: Position;
  rotation: number;
}

/** Game state for a single player */
export interface GameState {
  board: Board;
  currentPiece: Piece | null;
  nextPiece: TetrominoType;
  score: number;
  level: number;
  linesCleared: number;
  isGameOver: boolean;
}

/** Create an empty board */
export function createBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

/** Create initial game state */
export function createGameState(): GameState {
  return {
    board: createBoard(),
    currentPiece: null,
    nextPiece: 'T',
    score: 0,
    level: 1,
    linesCleared: 0,
    isGameOver: false,
  };
}

// Re-export all engine modules
export { getTetrominoShape, getPieceCoordinates, spawnPiece, randomTetrominoType } from './pieces';
export type { ShapeMatrix } from './pieces';
export { checkCollision, isValidPosition } from './collision';
export { rotatePiece, tryRotate } from './rotation';
export type { RotationResult } from './rotation';
export { findFullLines, clearLines, clearLinesAndScore, isGameOver } from './scoring';
export { moveLeft, moveRight, moveDown, hardDrop, lockPiece } from './movement';

/** Tetromino colors - standard Tetris color scheme */
export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00f0f0', // Cyan
  O: '#f0f000', // Yellow
  T: '#a000f0', // Purple
  S: '#00f000', // Green
  Z: '#f00000', // Red
  J: '#0000f0', // Blue
  L: '#f0a000', // Orange
};

/** Get the color for a tetromino type */
export function getTetrominoColor(type: TetrominoType): string {
  return TETROMINO_COLORS[type];
}
