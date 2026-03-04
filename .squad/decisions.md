# Squad Decisions

## Active Decisions

### React Scaffold Architecture (2026-03-04)
**Author:** Troi (Frontend Dev)  
**Status:** Accepted  
**Context:** Issue #1 — React app scaffold setup

- **Vite as Build Tool**: Vite 5.x for fast HMR, native ESM, simpler config
  - Dev server on port 3000, TypeScript uses bundler resolution
- **Standalone TypeScript Config**: Web app has independent tsconfig.json (not root-extending)
  - Allows DOM libs, JSX, noEmit configuration appropriate to app context
- **Dark Game Theme**: Gradient background #1a1a2e → #16213e with purple accents
  - Game-friendly aesthetic, reduces eye strain, fits Tetris gaming vibe
- **React 18 + StrictMode**: React 18.2.x with production StrictMode enabled
  - Future-proof, supports concurrent features, catches bugs early

### Test-Driven Development (2026-03-04)
**Author:** Worf (Tester)  
**Status:** Accepted  
**Context:** Test infrastructure for game engine

- **Test Location**: `packages/game-engine/src/__tests__/`
- **Test Runner**: Vitest with `npm test` command
- **TDD Approach**: Write test specifications before implementation
- **Test Structure**: vitest `describe/it/expect` pattern, grouped by feature
- **Rationale**: Tests define clear contracts, early design validation, comprehensive coverage from day one

## Open Questions

- State management approach (Context, Zustand, Redux?) — defer until game state integration (Troi)
- Component library choice (Chakra, MUI, custom?) — revisit when building game UI (Troi)
- E2E test conventions for React components? (Team)

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
