/**
 * Calculate score for clearing lines based on classic Tetris scoring:
 * 1 line = 100 * level
 * 2 lines = 300 * level
 * 3 lines = 500 * level
 * 4 lines (Tetris) = 800 * level
 */
export function calculateScore(linesCleared: number, level: number): number {
  const scoreTable: Record<number, number> = {
    1: 100,
    2: 300,
    3: 500,
    4: 800,
  };
  
  return (scoreTable[linesCleared] || 0) * level;
}

/**
 * Calculate level based on total lines cleared.
 * Level increases every 10 lines, starting at level 1.
 */
export function calculateLevel(totalLinesCleared: number): number {
  return Math.floor(totalLinesCleared / 10) + 1;
}
