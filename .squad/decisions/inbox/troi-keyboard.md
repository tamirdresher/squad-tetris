# Keyboard Controls Architecture

**Date:** 2026-03-04  
**Agent:** Troi (Frontend Dev)

## Decision

Implemented keyboard controls using custom hooks pattern with separation of concerns:
- `useGameControls` for keyboard input
- `useGameLoop` for game timing/gravity
- Game engine functions for collision detection and piece manipulation

## Rationale

- **Hooks pattern:** Encapsulates complex logic, makes it reusable and testable
- **Collision detection in engine:** Game logic should live in shared package, not React layer
- **Gravity via interval:** Simple setInterval is adequate for Tetris timing; no need for requestAnimationFrame

## Technical Notes

- Keyboard events only fire when game is active (`isActive` prop)
- Pause state blocks all actions except unpause
- Hard drop triggers immediate lock via setTimeout(lockAndSpawnNext, 0)
- Type compatibility: GameBoard uses `Piece | undefined`, GameState uses `Piece | null`

## Impact

- Full playable Tetris game with standard controls
- Clean separation between UI (React) and game logic (engine package)
- Foundation for multiplayer synchronization (game state is serializable)
