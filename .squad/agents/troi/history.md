# Project Context

- **Project:** squad-tetris — Multiplayer Tetris game
- **Stack:** TypeScript monorepo, React frontend, Node.js API, shared game engine package, Azure infrastructure
- **Teams:** UI, Backend, Mobile — working in parallel across Codespaces
- **User:** Tamir Dresher
- **Created:** 2026-03-04

## Core Context

Agent Troi initialized as Frontend Dev. Owns the React frontend — game board UI, components, animations, and player interactions.

## Recent Updates

📌 Team initialized on 2026-03-04
✅ React scaffold completed (issue #1) — branch: squad/1-react-scaffold

### 2026-03-04 — Parallel Test Infrastructure Created
Worf (Tester) completed anticipatory test specs for issues #2 and #3:
- board.test.ts: 32 passing tests establishing board contract (10x20 dimensions, cell state mgmt)
- tetrominos.test.ts: TDD-style specifications for all 7 tetromino shapes, colors, rotations
- Test runner: Vitest via `npm test`
- Tests are ready for parallel implementation — implementation will follow TDD approach

### Key Takeaway for Troi
- Board tests already define the expected API for game board logic
- Tetromino tests specify shape data you'll need to consume in React components
- When implementing board rendering (#2) and tetromino display (#3), use tests as contract

## Learnings

✅ Game board and pieces implemented (issues #2, #3) — branch: squad/2-3-game-board-pieces

## Learnings

Initial setup complete.
**React App Setup:**
- Web app located at apps/web with workspace name @squad-tetris/web
- Vite config sets dev server to port 3000 with host: true for Codespaces compatibility
- TypeScript config uses bundler resolution, noEmit (Vite handles transpilation), react-jsx
- Dark theme applied (gradient background #1a1a2e to #16213e, purple gradient text)
- Game engine reference: @squad-tetris/game-engine as workspace dependency

**Monorepo Conventions:**
- npm workspaces pattern, install deps at root after package.json changes
- Use --workspace flag for per-app commands: npm run build --workspace=apps/web
- tsconfig.json should NOT extend root (different contexts: app vs library)

**Test-Driven Development (from Worf):**
- Tests live in `packages/game-engine/src/__tests__/`
- Vitest configured via `npm test` script
- TDD approach: write tests first to define contracts
- Board dimensions: BOARD_WIDTH = 10, BOARD_HEIGHT = 20

**Key Files:**
- apps/web/vite.config.ts — Vite + React plugin configuration
- apps/web/tsconfig.json — React app TypeScript settings
- apps/web/index.html — Entry point for Vite
- apps/web/src/index.tsx — React root with StrictMode
- apps/web/src/index.css — Dark game-friendly theme
- packages/game-engine/src/__tests__/board.test.ts — Board API contract
- packages/game-engine/src/__tests__/tetrominos.test.ts — Tetromino shape specifications

**Lobby Implementation (Issue #5):**
- Created Lobby.tsx component with create/join room functionality
- View switching using useState (lobby vs game) — no react-router needed yet
- Mock room data with Room interface (id, name, playerCount, maxPlayers, status)
- Player name input, room name input, room list with status indicators
- Responsive grid layout (1fr 2fr on desktop, stacked on mobile)
- Button states: disabled for full/in-progress rooms
- game-engine package needs tsconfig.json to build correctly (rootDir: "src")
- React 17+ JSX transform doesn't require React import — use `import { useState }` not `import React`
- Lobby.css follows dark theme from index.css with purple gradient accents

**Game Board & Tetromino Implementation (Issues #2, #3):**
- Added TETROMINO_SHAPES to game-engine: 4 rotation states for each of 7 types (I, O, T, S, Z, J, L)
- Added TETROMINO_COLORS with standard Tetris colors (I=cyan, O=yellow, T=purple, S=green, Z=red, J=blue, L=orange)
- Created getTetrominoShape() and getTetrominoColor() helper functions
- GameBoard.tsx renders 10x20 grid using CSS Grid, overlays current piece on board state
- NextPiece.tsx shows preview of upcoming piece with proper colors
- CSS uses dark theme with cell borders, shadows for depth effect
- All 32 tests pass (8 board tests + 24 tetromino tests via Vitest)
- Build order: must build game-engine package first before building web app (workspace dependencies)

