import { describe, it, expect } from 'vitest';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  createBoard,
  createGameState,
  type Board,
  type Cell,
} from '../index';

describe('Board Creation', () => {
  describe('createBoard', () => {
    it('should create a board with correct dimensions', () => {
      const board = createBoard();
      expect(board).toHaveLength(BOARD_HEIGHT);
      expect(board[0]).toHaveLength(BOARD_WIDTH);
    });

    it('should create a board with all null cells', () => {
      const board = createBoard();
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          expect(board[y][x]).toBeNull();
        }
      }
    });

    it('should create independent board instances', () => {
      const board1 = createBoard();
      const board2 = createBoard();
      board1[0][0] = 'T';
      expect(board2[0][0]).toBeNull();
    });
  });

  describe('Board Constants', () => {
    it('should have standard Tetris board width of 10', () => {
      expect(BOARD_WIDTH).toBe(10);
    });

    it('should have standard Tetris board height of 20', () => {
      expect(BOARD_HEIGHT).toBe(20);
    });
  });

  describe('Board Cell State', () => {
    it('should accept all tetromino types in cells', () => {
      const board = createBoard();
      const tetrominoTypes: Array<'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'> = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      
      tetrominoTypes.forEach((type, index) => {
        board[0][index] = type;
        expect(board[0][index]).toBe(type);
      });
    });

    it('should handle clearing cells back to null', () => {
      const board = createBoard();
      board[5][5] = 'T';
      expect(board[5][5]).toBe('T');
      
      board[5][5] = null;
      expect(board[5][5]).toBeNull();
    });

    it('should maintain cell state independently', () => {
      const board = createBoard();
      board[0][0] = 'I';
      board[19][9] = 'O';
      
      expect(board[0][0]).toBe('I');
      expect(board[19][9]).toBe('O');
      expect(board[10][5]).toBeNull();
    });
  });
});

describe('GameState Creation', () => {
  describe('createGameState', () => {
    it('should create initial game state with empty board', () => {
      const state = createGameState();
      expect(state.board).toBeDefined();
      expect(state.board).toHaveLength(BOARD_HEIGHT);
    });

    it('should initialize with null current piece', () => {
      const state = createGameState();
      expect(state.currentPiece).toBeNull();
    });

    it('should initialize with a next piece type', () => {
      const state = createGameState();
      expect(state.nextPiece).toBeDefined();
      expect(['I', 'O', 'T', 'S', 'Z', 'J', 'L']).toContain(state.nextPiece);
    });

    it('should initialize score to 0', () => {
      const state = createGameState();
      expect(state.score).toBe(0);
    });

    it('should initialize level to 1', () => {
      const state = createGameState();
      expect(state.level).toBe(1);
    });

    it('should initialize linesCleared to 0', () => {
      const state = createGameState();
      expect(state.linesCleared).toBe(0);
    });

    it('should initialize isGameOver to false', () => {
      const state = createGameState();
      expect(state.isGameOver).toBe(false);
    });

    it('should create independent game state instances', () => {
      const state1 = createGameState();
      const state2 = createGameState();
      state1.score = 100;
      expect(state2.score).toBe(0);
    });
  });
});
