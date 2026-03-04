# Decision: Approve & Merge Game Engine (PR #49)

**By:** Riker (Lead)
**Date:** 2026-03-04
**Status:** APPROVED and MERGED

## Context
PR #49 implements the core Tetris game engine in `packages/game-engine/`. Closes #12 (piece logic, collision, rotation) and #13 (line clearing, scoring).

## Decision
Approved after thorough review of:
- All 7 SRS tetromino shapes and 4 rotation states each — verified correct
- SRS wall kick tables for JLSTZ and I-piece — all 8 transitions verified against standard (with y-down coordinate conversion)
- Collision detection — walls, floor, piece-to-piece, spawn-above-board edge case
- Scoring system — 100/300/500/800 × level, level progression every 10 lines
- 80 passing tests across 5 suites with good edge case coverage

## Follow-up Items
1. `randomTetrominoType()` uses simple random, not 7-bag as described in PR. Should be enhanced to true 7-bag for fair gameplay.
2. T-spin detection is a todo — needed for competitive play.
3. Soft drop / hard drop point scoring are todos.
4. Game over check is simplified (row 0 only) — may need refinement.

## Rationale
The engine is architecturally sound (pure functions, immutable patterns, clean module boundaries) and mechanically correct per SRS standard. The noted items are enhancements, not blockers for the core engine.
