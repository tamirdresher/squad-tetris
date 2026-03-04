# Project Context

- **Project:** squad-tetris — Multiplayer Tetris game
- **Stack:** TypeScript monorepo, React frontend, Node.js API, shared game engine package, Azure infrastructure
- **Teams:** UI, Backend, Mobile — working in parallel across Codespaces
- **User:** Tamir Dresher
- **Created:** 2026-03-04

## Core Context

Agent Worf initialized as Tester. Owns quality — tests, edge cases, code review, and approval/rejection of work.

## Recent Updates

📌 Team initialized on 2026-03-04

### 2026-03-04 — Test Specifications for Issues #2 & #3

Created anticipatory test suite for upcoming game board and tetromino rendering features:
- **board.test.ts**: Tests for board creation, dimensions (10x20), cell state management
- **tetrominos.test.ts**: TDD-style specifications for all 7 tetromino shapes, colors, and rotations
- Installed vitest as test runner
- All board tests pass (32/32 tests passing)
- Tetromino tests are specification placeholders — will fail until implementation added

### 2026-03-04 — React Scaffold Completed (Troi)
Parallel task: Troi scaffolded React + Vite + TypeScript in apps/web:
- Vite dev server configured for port 3000 (Codespaces-ready)
- Dark theme applied (gradient #1a1a2e → #16213e)
- Game engine reference integrated as workspace dependency
- Branch: squad/1-react-scaffold (committed)

### Key Takeaway for Worf
- Troi's React app is ready to consume game engine types/functions
- Board and tetromino tests define clear contracts for implementation
- Monitor implementation PRs for test compliance

## Learnings

**Test Organization**:
- Tests live in `packages/game-engine/src/__tests__/`
- Vitest configured via `npm test` script
- Use TDD approach: write tests first to define contracts

**Key File Paths**:
- Game engine: `packages/game-engine/src/index.ts`
- Tests: `packages/game-engine/src/__tests__/*.test.ts`
- Board dimensions: BOARD_WIDTH = 10, BOARD_HEIGHT = 20

**Test Conventions**:
- Use vitest's describe/it/expect pattern
- Group related tests in describe blocks
- Test boundary conditions and edge cases
- For TDD: write comprehensive test specs with comments explaining expected implementation

**React App Integration** (from Troi):
- Web app: apps/web with workspace name @squad-tetris/web
- Vite config: port 3000, host: true (Codespaces compatible)
- TypeScript: bundler resolution, noEmit, react-jsx
- Theme: Dark gradient #1a1a2e → #16213e (game-friendly)
- Game engine reference: @squad-tetris/game-engine (workspace dependency)
