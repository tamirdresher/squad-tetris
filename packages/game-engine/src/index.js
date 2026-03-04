/** Board dimensions */
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
/** Create an empty board */
export function createBoard() {
    return Array.from({ length: BOARD_HEIGHT }, () => Array.from({ length: BOARD_WIDTH }, () => null));
}
/** Create initial game state */
export function createGameState() {
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
//# sourceMappingURL=index.js.map