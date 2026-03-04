// Type declarations for @squad-tetris/game-engine
// Mirrors packages/game-engine/src/index.ts until the package builds its own dist/
declare module '@squad-tetris/game-engine' {
  export const BOARD_WIDTH = 10;
  export const BOARD_HEIGHT = 20;

  export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
  export type Cell = TetrominoType | null;
  export type Board = Cell[][];

  export interface Position {
    x: number;
    y: number;
  }

  export interface Piece {
    type: TetrominoType;
    position: Position;
    rotation: number;
  }

  export interface GameState {
    board: Board;
    currentPiece: Piece | null;
    nextPiece: TetrominoType;
    score: number;
    level: number;
    linesCleared: number;
    isGameOver: boolean;
  }

  export function createBoard(): Board;
  export function createGameState(): GameState;
}
