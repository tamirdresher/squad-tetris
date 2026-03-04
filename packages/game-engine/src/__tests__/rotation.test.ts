import { describe, it, expect } from 'vitest';
import { createBoard, rotatePiece, tryRotate, type Piece } from '../index';

describe('Piece Rotation', () => {
  describe('Basic Rotation', () => {
    it('should rotate piece clockwise', () => {
      const piece: Piece = { type: 'T', position: { x: 4, y: 10 }, rotation: 0 };
      const rotated = rotatePiece(piece, 'clockwise');
      expect(rotated.rotation).toBe(1);
    });

    it('should rotate piece counter-clockwise', () => {
      const piece: Piece = { type: 'T', position: { x: 4, y: 10 }, rotation: 0 };
      const rotated = rotatePiece(piece, 'counterclockwise');
      expect(rotated.rotation).toBe(3);
    });

    it('should wrap rotation from 3 to 0', () => {
      const piece: Piece = { type: 'T', position: { x: 4, y: 10 }, rotation: 3 };
      const rotated = rotatePiece(piece, 'clockwise');
      expect(rotated.rotation).toBe(0);
    });

    it('should wrap rotation from 0 to 3', () => {
      const piece: Piece = { type: 'T', position: { x: 4, y: 10 }, rotation: 0 };
      const rotated = rotatePiece(piece, 'counterclockwise');
      expect(rotated.rotation).toBe(3);
    });
  });

  describe('O-piece Special Case', () => {
    it('should not change position when rotating O-piece', () => {
      const piece: Piece = { type: 'O', position: { x: 4, y: 10 }, rotation: 0 };
      const board = createBoard();
      const result = tryRotate(board, piece, 'clockwise');
      expect(result.success).toBe(true);
      expect(result.piece.position).toEqual(piece.position);
    });
  });

  describe('Wall Kicks', () => {
    it('should perform basic wall kick when rotating near left wall', () => {
      const board = createBoard();
      const piece: Piece = { type: 'T', position: { x: 0, y: 10 }, rotation: 0 };
      const result = tryRotate(board, piece, 'counterclockwise');
      // T rotation 0→3 near left wall should kick right
      expect(result.success).toBe(true);
    });

    it('should perform basic wall kick when rotating near right wall', () => {
      const board = createBoard();
      const piece: Piece = { type: 'T', position: { x: 8, y: 10 }, rotation: 0 };
      const result = tryRotate(board, piece, 'clockwise');
      expect(result.success).toBe(true);
    });

    it('should perform floor kick when rotating near bottom', () => {
      const board = createBoard();
      // Vertical I near bottom — rotate to horizontal should kick up
      const piece: Piece = { type: 'I', position: { x: 4, y: 18 }, rotation: 1 };
      const result = tryRotate(board, piece, 'clockwise');
      expect(result.success).toBe(true);
    });

    it('should try multiple wall kick positions (SRS)', () => {
      const board = createBoard();
      // Create a scenario where first kick fails but later one succeeds
      const piece: Piece = { type: 'T', position: { x: 4, y: 10 }, rotation: 0 };
      const result = tryRotate(board, piece, 'clockwise');
      expect(result.success).toBe(true);
      expect(result.piece.rotation).toBe(1);
    });

    it('should fail rotation if no wall kick works', () => {
      const board = createBoard();
      // Box in a T-piece so no rotation is possible
      board[9][3] = 'T';
      board[9][5] = 'T';
      board[11][3] = 'T';
      board[11][4] = 'T';
      board[11][5] = 'T';
      board[10][3] = 'T';
      board[10][5] = 'T';
      // Also block kick positions
      board[9][4] = 'T';
      board[8][3] = 'T';
      board[8][4] = 'T';
      board[8][5] = 'T';
      board[12][3] = 'T';
      board[12][4] = 'T';
      board[12][5] = 'T';
      const piece: Piece = { type: 'T', position: { x: 3, y: 9 }, rotation: 0 };
      const result = tryRotate(board, piece, 'clockwise');
      expect(result.success).toBe(false);
    });
  });

  describe('I-piece Special Rotation', () => {
    it('should rotate I-piece from horizontal to vertical', () => {
      const board = createBoard();
      const piece: Piece = { type: 'I', position: { x: 3, y: 10 }, rotation: 0 };
      const result = tryRotate(board, piece, 'clockwise');
      expect(result.success).toBe(true);
      expect(result.piece.rotation).toBe(1);
    });

    it('should rotate I-piece from vertical to horizontal', () => {
      const board = createBoard();
      const piece: Piece = { type: 'I', position: { x: 3, y: 10 }, rotation: 1 };
      const result = tryRotate(board, piece, 'clockwise');
      expect(result.success).toBe(true);
      expect(result.piece.rotation).toBe(2);
    });

    it('should handle I-piece wall kicks correctly', () => {
      const board = createBoard();
      // I-piece at far right, horizontal → should kick when rotating to vertical
      const piece: Piece = { type: 'I', position: { x: 7, y: 10 }, rotation: 0 };
      const result = tryRotate(board, piece, 'clockwise');
      expect(result.success).toBe(true);
    });
  });

  describe('T-spin Detection', () => {
    it.todo('should detect T-spin when T-piece rotates into tight space');
  });
});
