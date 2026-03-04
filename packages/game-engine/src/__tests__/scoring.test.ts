import { describe, it, expect } from 'vitest';
import {
  createBoard,
  createGameState,
  BOARD_WIDTH,
  findFullLines,
  clearLines,
  clearLinesAndScore,
  isGameOver,
  type Board,
  type GameState,
} from '../index';

describe('Line Clearing', () => {
  describe('Line Detection', () => {
    it('should detect a full line', () => {
      const board = createBoard();
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[19][x] = 'T';
      }
      expect(findFullLines(board)).toEqual([19]);
    });

    it('should detect multiple full lines', () => {
      const board = createBoard();
      for (let y = 17; y < 20; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[y][x] = 'T';
        }
      }
      expect(findFullLines(board)).toEqual([17, 18, 19]);
    });

    it('should not detect partial lines', () => {
      const board = createBoard();
      for (let x = 0; x < BOARD_WIDTH - 1; x++) {
        board[19][x] = 'T';
      }
      expect(findFullLines(board)).toEqual([]);
    });

    it('should detect non-consecutive full lines', () => {
      const board = createBoard();
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[17][x] = 'T';
        board[19][x] = 'T';
      }
      // Row 18 is NOT full
      expect(findFullLines(board)).toEqual([17, 19]);
    });
  });

  describe('Line Removal', () => {
    it('should remove a single full line', () => {
      const board = createBoard();
      board[18][5] = 'S'; // Block above the line to be cleared
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[19][x] = 'T';
      }
      const newBoard = clearLines(board, [19]);
      // The block at row 18 should drop to row 19
      expect(newBoard[19][5]).toBe('S');
      // Top row should be empty
      expect(newBoard[0]).toEqual(new Array(BOARD_WIDTH).fill(null));
    });

    it('should drop blocks above cleared lines', () => {
      const board = createBoard();
      board[15][5] = 'T';
      board[16][5] = 'S';
      for (let y = 17; y < 20; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[y][x] = 'T';
        }
      }
      const newBoard = clearLines(board, [17, 18, 19]);
      expect(newBoard[18][5]).toBe('T'); // Dropped by 3
      expect(newBoard[19][5]).toBe('S'); // Dropped by 3
    });

    it('should create empty rows at top after clearing', () => {
      const board = createBoard();
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[19][x] = 'T';
      }
      const newBoard = clearLines(board, [19]);
      expect(newBoard[0]).toEqual(new Array(BOARD_WIDTH).fill(null));
    });

    it('should handle clearing multiple non-consecutive lines', () => {
      const board = createBoard();
      board[18][5] = 'S'; // Between the two cleared rows
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[17][x] = 'T';
        board[19][x] = 'T';
      }
      const newBoard = clearLines(board, [17, 19]);
      // Row 18 (the S block) should drop by 1 (only row 19 below it was cleared)
      // After removing rows 17 and 19: row 18 remains, gets shifted down by 2 empty rows added at top
      expect(newBoard[19][5]).toBe('S');
    });
  });
});

describe('Scoring System', () => {
  describe('Single Line Clear', () => {
    it('should award 100 points for single line at level 1', () => {
      const state = createGameState();
      const newState = clearLinesAndScore(state, 1);
      expect(newState.score).toBe(100);
    });

    it('should award 200 points for single line at level 2', () => {
      const state = { ...createGameState(), level: 2 };
      const newState = clearLinesAndScore(state, 1);
      expect(newState.score).toBe(200);
    });
  });

  describe('Double Line Clear', () => {
    it('should award 300 points for double at level 1', () => {
      const state = createGameState();
      const newState = clearLinesAndScore(state, 2);
      expect(newState.score).toBe(300);
    });
  });

  describe('Triple Line Clear', () => {
    it('should award 500 points for triple at level 1', () => {
      const state = createGameState();
      const newState = clearLinesAndScore(state, 3);
      expect(newState.score).toBe(500);
    });
  });

  describe('Tetris (4 Lines)', () => {
    it('should award 800 points for tetris at level 1', () => {
      const state = createGameState();
      const newState = clearLinesAndScore(state, 4);
      expect(newState.score).toBe(800);
    });

    it('should award 1600 points for tetris at level 2', () => {
      const state = { ...createGameState(), level: 2 };
      const newState = clearLinesAndScore(state, 4);
      expect(newState.score).toBe(1600);
    });
  });

  describe('Lines Cleared Counter', () => {
    it('should increment linesCleared by number of lines cleared', () => {
      const state = createGameState();
      const newState = clearLinesAndScore(state, 3);
      expect(newState.linesCleared).toBe(3);
    });

    it('should accumulate linesCleared across multiple clears', () => {
      const state = createGameState();
      let newState = clearLinesAndScore(state, 2);
      newState = clearLinesAndScore(newState, 1);
      expect(newState.linesCleared).toBe(3);
    });
  });

  describe('Level Progression', () => {
    it('should increase level after clearing 10 lines', () => {
      const state = { ...createGameState(), linesCleared: 9 };
      const newState = clearLinesAndScore(state, 1);
      expect(newState.level).toBe(2);
    });

    it('should increase level multiple times', () => {
      const state = { ...createGameState(), linesCleared: 18 };
      const newState = clearLinesAndScore(state, 4);
      expect(newState.level).toBe(3);
    });

    it('should not increase level before threshold', () => {
      const state = { ...createGameState(), linesCleared: 5 };
      const newState = clearLinesAndScore(state, 2);
      expect(newState.level).toBe(1);
    });
  });

  describe('Scoring Edge Cases', () => {
    it('should handle zero lines cleared', () => {
      const state = createGameState();
      const newState = clearLinesAndScore(state, 0);
      expect(newState.score).toBe(0);
      expect(newState.linesCleared).toBe(0);
    });

    it('should accumulate score correctly', () => {
      const state = { ...createGameState(), score: 500 };
      const newState = clearLinesAndScore(state, 2);
      expect(newState.score).toBe(800);
    });
  });

  describe('Soft Drop and Hard Drop Points', () => {
    it.todo('should award 1 point per cell for soft drop');
    it.todo('should award 2 points per cell for hard drop');
  });
});

describe('Game Over Detection', () => {
  it('should detect game over when piece cannot spawn', () => {
    const board = createBoard();
    for (let x = 3; x < 7; x++) {
      board[0][x] = 'T';
    }
    expect(isGameOver(board)).toBe(true);
  });

  it('should not trigger game over with clear spawn area', () => {
    const board = createBoard();
    // Fill bottom half only
    for (let y = 10; y < 20; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[y][x] = 'T';
      }
    }
    expect(isGameOver(board)).toBe(false);
  });
});
