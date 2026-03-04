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

/** Tetromino shape definitions - each type has 4 rotation states */
export const TETROMINO_SHAPES: Record<TetrominoType, number[][][]> = {
  I: [
    // Rotation 0: Horizontal
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    // Rotation 1: Vertical
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    // Rotation 2: Horizontal
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    // Rotation 3: Vertical
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  O: [
    // All rotations are the same for O-piece
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
  ],
  T: [
    // Rotation 0: T pointing up
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    // Rotation 1: T pointing right
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    // Rotation 2: T pointing down
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    // Rotation 3: T pointing left
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  S: [
    // Rotation 0
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    // Rotation 1
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    // Rotation 2
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    // Rotation 3
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  Z: [
    // Rotation 0
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    // Rotation 1
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    // Rotation 2
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    // Rotation 3
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
  J: [
    // Rotation 0
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    // Rotation 1
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    // Rotation 2
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    // Rotation 3
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  L: [
    // Rotation 0
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    // Rotation 1
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    // Rotation 2
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    // Rotation 3
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
};

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

/** Get the shape matrix for a tetromino at a specific rotation */
export function getTetrominoShape(type: TetrominoType, rotation: number): number[][] {
  const normalizedRotation = ((rotation % 4) + 4) % 4;
  return TETROMINO_SHAPES[type][normalizedRotation];
}

/** Get the color for a tetromino type */
export function getTetrominoColor(type: TetrominoType): string {
  return TETROMINO_COLORS[type];
}

/** Check if a piece position is valid (no collision) */
export function isValidPosition(board: Board, piece: Piece): boolean {
  const shape = getTetrominoShape(piece.type, piece.rotation);
  
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[dy].length; dx++) {
      if (shape[dy][dx]) {
        const boardY = piece.position.y + dy;
        const boardX = piece.position.x + dx;
        
        // Check boundaries
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return false;
        }
        
        // Allow piece above board (boardY < 0) during spawn
        if (boardY >= 0 && board[boardY][boardX] !== null) {
          return false;
        }
      }
    }
  }
  
  return true;
}

/** Move piece in a direction, returns new piece if valid, null otherwise */
export function movePiece(board: Board, piece: Piece, dx: number, dy: number): Piece | null {
  const newPiece: Piece = {
    ...piece,
    position: {
      x: piece.position.x + dx,
      y: piece.position.y + dy,
    },
  };
  
  return isValidPosition(board, newPiece) ? newPiece : null;
}

/** Rotate piece, returns new piece if valid, null otherwise */
export function rotatePiece(board: Board, piece: Piece, direction: 1 | -1 = 1): Piece | null {
  const newPiece: Piece = {
    ...piece,
    rotation: piece.rotation + direction,
  };
  
  return isValidPosition(board, newPiece) ? newPiece : null;
}

/** Calculate hard drop position (lowest valid position) */
export function getHardDropPosition(board: Board, piece: Piece): Piece {
  let dropPiece = piece;
  let testPiece = movePiece(board, dropPiece, 0, 1);
  
  while (testPiece !== null) {
    dropPiece = testPiece;
    testPiece = movePiece(board, dropPiece, 0, 1);
  }
  
  return dropPiece;
}

/** Lock piece into board, returns new board */
export function lockPiece(board: Board, piece: Piece): Board {
  const newBoard = board.map(row => [...row]);
  const shape = getTetrominoShape(piece.type, piece.rotation);
  
  shape.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      if (cell) {
        const boardY = piece.position.y + dy;
        const boardX = piece.position.x + dx;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.type;
        }
      }
    });
  });
  
  return newBoard;
}

/** Clear completed lines, returns new board and count of cleared lines */
export function clearLines(board: Board): { board: Board; linesCleared: number } {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  
  // Add empty rows at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
  }
  
  return { board: newBoard, linesCleared };
}

/** Generate random tetromino type */
export function randomTetrominoType(): TetrominoType {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return types[Math.floor(Math.random() * types.length)];
}

/** Create a new piece at spawn position */
export function spawnPiece(type: TetrominoType): Piece {
  return {
    type,
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    rotation: 0,
  };
}

// Export scoring functions
export { calculateScore, calculateLevel } from './scoring';
