import { describe, it, expect } from 'vitest';
import { createBoard, BOARD_WIDTH, BOARD_HEIGHT, checkCollision, type Piece, type Board } from '../index';

describe('Collision Detection', () => {
  describe('Wall Collisions', () => {
    it('should detect collision with left wall', () => {
      const board = createBoard();
      const piece: Piece = { type: 'I', position: { x: -1, y: 10 }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(true);
    });

    it('should detect collision with right wall', () => {
      const board = createBoard();
      const piece: Piece = { type: 'I', position: { x: BOARD_WIDTH, y: 10 }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(true);
    });

    it('should allow piece at left edge without collision', () => {
      const board = createBoard();
      const piece: Piece = { type: 'O', position: { x: 0, y: 10 }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(false);
    });

    it('should allow piece at right edge without collision', () => {
      const board = createBoard();
      const piece: Piece = { type: 'O', position: { x: 8, y: 10 }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(false);
    });
  });

  describe('Floor Collisions', () => {
    it('should detect collision with floor', () => {
      const board = createBoard();
      const piece: Piece = { type: 'O', position: { x: 4, y: BOARD_HEIGHT }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(true);
    });

    it('should allow piece at bottom row without collision', () => {
      const board = createBoard();
      const piece: Piece = { type: 'O', position: { x: 4, y: BOARD_HEIGHT - 2 }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(false);
    });
  });

  describe('Piece-to-Piece Collisions', () => {
    it('should detect collision with existing blocks', () => {
      const board = createBoard();
      board[19][5] = 'T';
      const piece: Piece = { type: 'O', position: { x: 4, y: 18 }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(true);
    });

    it('should allow piece next to existing blocks without collision', () => {
      const board = createBoard();
      board[19][5] = 'T';
      const piece: Piece = { type: 'O', position: { x: 6, y: 18 }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(false);
    });

    it('should allow piece above existing blocks without collision', () => {
      const board = createBoard();
      board[19][5] = 'T';
      const piece: Piece = { type: 'O', position: { x: 4, y: 16 }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle piece partially off-board top (valid during spawn)', () => {
      const board = createBoard();
      // I at rotation 0 has filled cells at row 1 of matrix, so at y=-1 the
      // filled cells land on board row 0 — should be valid
      const piece: Piece = { type: 'I', position: { x: 4, y: -1 }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(false);
    });

    it('should detect collision for rotated piece near wall', () => {
      const board = createBoard();
      // Vertical I (rotation 1) at x=0: filled column is col 2 → board x=2, valid
      const piece: Piece = { type: 'I', position: { x: 0, y: 10 }, rotation: 1 };
      expect(checkCollision(board, piece)).toBe(false);
    });

    it('should detect collision for rotated piece hitting wall', () => {
      const board = createBoard();
      // Horizontal I (rotation 0) at x=8: cells at x=8,9,10,11 → x>=10 hits wall
      const piece: Piece = { type: 'I', position: { x: 8, y: 10 }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(true);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle board with scattered blocks', () => {
      const board = createBoard();
      for (let i = 0; i < BOARD_WIDTH; i += 2) {
        board[19][i] = 'T';
      }
      // O-piece landing between scattered blocks (odd columns are empty)
      const piece: Piece = { type: 'O', position: { x: 1, y: 18 }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(true); // x=1,2 row 19: x=2 is filled
    });

    it('should detect collision in tight spaces', () => {
      const board = createBoard();
      for (let i = 0; i < BOARD_WIDTH; i++) {
        if (i !== 4 && i !== 5) board[19][i] = 'T';
      }
      // O-piece (2 wide) fits exactly in the gap at columns 4-5
      const piece: Piece = { type: 'O', position: { x: 4, y: 18 }, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(false);
    });
  });
});
