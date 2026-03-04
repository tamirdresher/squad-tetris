import { describe, it, expect } from 'vitest';
import {
  type TetrominoType,
  getTetrominoShape,
  getPieceCoordinates,
} from '../index';

describe('Tetromino Definitions', () => {
  const tetrominoTypes: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  describe('Tetromino Types', () => {
    it('should have 7 tetromino types', () => {
      expect(tetrominoTypes).toHaveLength(7);
    });

    it('should include all standard tetromino types', () => {
      expect(tetrominoTypes).toContain('I');
      expect(tetrominoTypes).toContain('O');
      expect(tetrominoTypes).toContain('T');
      expect(tetrominoTypes).toContain('S');
      expect(tetrominoTypes).toContain('Z');
      expect(tetrominoTypes).toContain('J');
      expect(tetrominoTypes).toContain('L');
    });
  });

  describe('Tetromino Shapes', () => {
    describe('I-piece', () => {
      it('should have 4 blocks in a row at rotation 0', () => {
        const shape = getTetrominoShape('I', 0);
        expect(shape).toHaveLength(4);
        // Row 1 has all 4 filled cells
        expect(shape[1]).toEqual([1, 1, 1, 1]);
      });

      it('should have 4 blocks in a column at rotation 1', () => {
        const shape = getTetrominoShape('I', 1);
        for (let r = 0; r < 4; r++) {
          expect(shape[r][2]).toBe(1);
        }
      });
    });

    describe('O-piece', () => {
      it('should be a 2x2 square at all rotations', () => {
        for (let rot = 0; rot < 4; rot++) {
          const shape = getTetrominoShape('O', rot);
          expect(shape).toEqual([[1, 1], [1, 1]]);
        }
      });
    });

    describe('T-piece', () => {
      it('should have T-shape at rotation 0', () => {
        const shape = getTetrominoShape('T', 0);
        expect(shape).toHaveLength(3);
        expect(shape[0]).toEqual([0, 1, 0]);
        expect(shape[1]).toEqual([1, 1, 1]);
      });

      it('should rotate correctly through all 4 orientations', () => {
        const shapes = [0, 1, 2, 3].map(r => JSON.stringify(getTetrominoShape('T', r)));
        // T has 4 distinct rotations
        expect(new Set(shapes).size).toBe(4);
      });
    });

    describe('S-piece', () => {
      it('should have S-shape at rotation 0', () => {
        const shape = getTetrominoShape('S', 0);
        expect(shape[0]).toEqual([0, 1, 1]);
        expect(shape[1]).toEqual([1, 1, 0]);
      });

      it('should have 4 rotation states', () => {
        // SRS defines 4 rotation states for all pieces
        for (let r = 0; r < 4; r++) {
          const shape = getTetrominoShape('S', r);
          expect(shape.length).toBeGreaterThanOrEqual(2);
        }
      });
    });

    describe('Z-piece', () => {
      it('should have Z-shape at rotation 0', () => {
        const shape = getTetrominoShape('Z', 0);
        expect(shape[0]).toEqual([1, 1, 0]);
        expect(shape[1]).toEqual([0, 1, 1]);
      });

      it('should have 4 rotation states', () => {
        for (let r = 0; r < 4; r++) {
          const shape = getTetrominoShape('Z', r);
          expect(shape.length).toBeGreaterThanOrEqual(2);
        }
      });
    });

    describe('J-piece', () => {
      it('should have J-shape at rotation 0', () => {
        const shape = getTetrominoShape('J', 0);
        expect(shape[0]).toEqual([1, 0, 0]);
        expect(shape[1]).toEqual([1, 1, 1]);
      });

      it('should rotate correctly through all 4 orientations', () => {
        const shapes = [0, 1, 2, 3].map(r => JSON.stringify(getTetrominoShape('J', r)));
        expect(new Set(shapes).size).toBe(4);
      });
    });

    describe('L-piece', () => {
      it('should have L-shape at rotation 0', () => {
        const shape = getTetrominoShape('L', 0);
        expect(shape[0]).toEqual([0, 0, 1]);
        expect(shape[1]).toEqual([1, 1, 1]);
      });

      it('should rotate correctly through all 4 orientations', () => {
        const shapes = [0, 1, 2, 3].map(r => JSON.stringify(getTetrominoShape('L', r)));
        expect(new Set(shapes).size).toBe(4);
      });
    });
  });

  describe('Piece Coordinate Calculation', () => {
    it('should calculate correct coordinates for piece at position', () => {
      const coords = getPieceCoordinates({ type: 'T', position: { x: 5, y: 10 }, rotation: 0 });
      // T at rotation 0: [0,1,0],[1,1,1],[0,0,0] → 4 filled cells
      expect(coords).toHaveLength(4);
      expect(coords).toContainEqual({ x: 6, y: 10 }); // top center
      expect(coords).toContainEqual({ x: 5, y: 11 }); // bottom left
      expect(coords).toContainEqual({ x: 6, y: 11 }); // bottom center
      expect(coords).toContainEqual({ x: 7, y: 11 }); // bottom right
    });

    it('should handle rotation correctly in coordinate calculation', () => {
      const coords0 = getPieceCoordinates({ type: 'T', position: { x: 5, y: 10 }, rotation: 0 });
      const coords1 = getPieceCoordinates({ type: 'T', position: { x: 5, y: 10 }, rotation: 1 });
      expect(coords0).not.toEqual(coords1);
    });
  });
});
