import type { Board, Piece, Position } from './index';
import { checkCollision } from './collision';

type KickData = Position[];

// SRS wall kick offsets for JLSTZ pieces (our coord system: +x right, +y down)
const JLSTZ_KICKS: Record<string, KickData> = {
  '0>1': [{x:0,y:0},{x:-1,y:0},{x:-1,y:-1},{x:0,y:2},{x:-1,y:2}],
  '1>0': [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:-2},{x:1,y:-2}],
  '1>2': [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:-2},{x:1,y:-2}],
  '2>1': [{x:0,y:0},{x:-1,y:0},{x:-1,y:-1},{x:0,y:2},{x:-1,y:2}],
  '2>3': [{x:0,y:0},{x:1,y:0},{x:1,y:-1},{x:0,y:2},{x:1,y:2}],
  '3>2': [{x:0,y:0},{x:-1,y:0},{x:-1,y:1},{x:0,y:-2},{x:-1,y:-2}],
  '3>0': [{x:0,y:0},{x:-1,y:0},{x:-1,y:-1},{x:0,y:2},{x:-1,y:2}],
  '0>3': [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:-2},{x:1,y:-2}],
};

// SRS wall kick offsets for I-piece
const I_KICKS: Record<string, KickData> = {
  '0>1': [{x:0,y:0},{x:-2,y:0},{x:1,y:0},{x:-2,y:1},{x:1,y:-2}],
  '1>0': [{x:0,y:0},{x:2,y:0},{x:-1,y:0},{x:2,y:-1},{x:-1,y:2}],
  '1>2': [{x:0,y:0},{x:-1,y:0},{x:2,y:0},{x:-1,y:-2},{x:2,y:1}],
  '2>1': [{x:0,y:0},{x:1,y:0},{x:-2,y:0},{x:1,y:2},{x:-2,y:-1}],
  '2>3': [{x:0,y:0},{x:2,y:0},{x:-1,y:0},{x:2,y:-1},{x:-1,y:2}],
  '3>2': [{x:0,y:0},{x:-2,y:0},{x:1,y:0},{x:-2,y:1},{x:1,y:-2}],
  '3>0': [{x:0,y:0},{x:1,y:0},{x:-2,y:0},{x:1,y:2},{x:-2,y:-1}],
  '0>3': [{x:0,y:0},{x:-1,y:0},{x:2,y:0},{x:-1,y:-2},{x:2,y:1}],
};

function getKickData(type: string, from: number, to: number): KickData {
  const key = `${from}>${to}`;
  if (type === 'I') return I_KICKS[key] ?? [{x:0,y:0}];
  if (type === 'O') return [{x:0,y:0}];
  return JLSTZ_KICKS[key] ?? [{x:0,y:0}];
}

/** Rotate a piece without collision checking */
export function rotatePiece(piece: Piece, direction: 'clockwise' | 'counterclockwise'): Piece {
  const newRotation = direction === 'clockwise'
    ? (piece.rotation + 1) % 4
    : (piece.rotation + 3) % 4;
  return { ...piece, rotation: newRotation };
}

export interface RotationResult {
  success: boolean;
  piece: Piece;
}

/** Attempt rotation with SRS wall kick tests */
export function tryRotate(
  board: Board,
  piece: Piece,
  direction: 'clockwise' | 'counterclockwise',
): RotationResult {
  const rotated = rotatePiece(piece, direction);
  const kicks = getKickData(piece.type, piece.rotation, rotated.rotation);

  for (const kick of kicks) {
    const kicked: Piece = {
      ...rotated,
      position: { x: rotated.position.x + kick.x, y: rotated.position.y + kick.y },
    };
    if (!checkCollision(board, kicked)) {
      return { success: true, piece: kicked };
    }
  }

  return { success: false, piece };
}
