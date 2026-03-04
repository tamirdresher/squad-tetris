import { BOARD_WIDTH, type Board, type GameState } from './types';

const LINE_SCORES: Record<number, number> = {
  0: 0,
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

const LINES_PER_LEVEL = 10;

/** Find all completely filled rows */
export function findFullLines(board: Board): number[] {
  const full: number[] = [];
  for (let y = 0; y < board.length; y++) {
    if (board[y].every(cell => cell !== null)) {
      full.push(y);
    }
  }
  return full;
}

/** Remove filled rows and shift everything above downward */
export function clearLines(board: Board, lines: number[]): Board {
  if (lines.length === 0) return board.map(row => [...row]);
  const remaining = board
    .filter((_, i) => !lines.includes(i))
    .map(row => [...row]);
  while (remaining.length < board.length) {
    remaining.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
  }
  return remaining;
}

/** Update score, linesCleared, and level after clearing lines */
export function clearLinesAndScore(state: GameState, linesCount: number): GameState {
  const baseScore = LINE_SCORES[linesCount] ?? 0;
  const newLinesCleared = state.linesCleared + linesCount;
  const newLevel = Math.floor(newLinesCleared / LINES_PER_LEVEL) + 1;
  return {
    ...state,
    score: state.score + baseScore * state.level,
    linesCleared: newLinesCleared,
    level: newLevel,
  };
}

/** Check if the spawn area is blocked */
export function isGameOver(board: Board): boolean {
  for (let x = 3; x < 7; x++) {
    if (board[0][x] !== null) return true;
  }
  return false;
}
