# Squad Decisions

## Active Decisions

### 1. Game Board Component Architecture

**Author:** Troi  
**Date:** 2026-03-04  
**Branch:** squad/2-3-game-board-pieces

**Decision:** Separate game logic in engine, rendering in React components.

**Components:**
- GameBoard.tsx: Renders 10x20 CSS Grid, merges static board with current piece overlay
- NextPiece.tsx: Standalone preview component
- Game Engine exports: TETROMINO_SHAPES, TETROMINO_COLORS, getTetrominoShape(), getTetrominoColor()

**Rationale:**
- Separation of concerns: game logic vs rendering
- CSS Grid native support for fixed-size board
- Immutable board overlay without state mutation
- Standard Tetris conventions (7 pieces, 4 rotations each)

**Impact:** 64 tests passing. TypeScript types ensure engine/UI contract.

### 2. Frontend View Switching (Lobby Implementation)

**Author:** Troi  
**Date:** 2026-03-04  
**Context:** Issue #5 — Game lobby UI

**Decision:** Simple client-side view switching with `useState<'lobby' | 'game'>()`.

**Rationale:**
- No react-router needed at this stage
- Minimal bundle size impact
- Easy upgrade path to react-router if more routes needed (settings, profile, leaderboard)
- Supports WebSocket integration with view state awareness

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
