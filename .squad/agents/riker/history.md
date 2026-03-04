# Project Context

- **Project:** squad-tetris — Multiplayer Tetris game
- **Stack:** TypeScript monorepo, React frontend, Node.js API, shared game engine package, Azure infrastructure
- **Teams:** UI, Backend, Mobile — working in parallel across Codespaces
- **User:** Tamir Dresher
- **Created:** 2026-03-04

## Core Context

Agent Riker initialized as Lead. Responsible for architecture, code review, game engine oversight, and cross-team coordination.

## Recent Updates

📌 Team initialized on 2026-03-04

## Learnings

Initial setup complete.

### PR #48 Review — Express Server Setup (2026-03-04)
- **APPROVED and MERGED** (squash). Closes #11.
- Express 5 with TypeScript, cors, health check, error middleware.
- Noted for future hardening: open CORS policy, no body size limit, app not exported for testing.
- Foundation is solid — correct middleware order, no stack trace leaks, clean tsconfig.

### PR #49 Review — Game Engine Implementation (2026-03-04)
- **APPROVED and MERGED** (squash). Closes #12 and #13.
- All 7 tetromino shapes verified correct against SRS standard.
- SRS wall kick data verified for both JLSTZ and I-piece (all 8 rotation transitions, y-down coordinate conversion correct).
- Collision detection handles walls, floor, existing pieces, and spawn-above-board edge case.
- Scoring: 100/300/500/800 × level — matches standard Tetris scoring. Level up every 10 lines.
- 80 tests passing across 5 suites (board, collision, pieces, rotation, scoring). 3 todo tests for T-spin and drop points.
- Architecture: pure functions, immutable patterns, clean module separation (pieces, collision, rotation, movement, scoring).
- Minor note: `randomTetrominoType()` is simple random, not 7-bag as PR description claims. Not blocking — can be enhanced later.
- Game over detection checks row 0, columns 3-6 only — simplified but valid approach.
### Azure SignalR Service Deployment (Issue #22, 2026-03-04)
- **Infrastructure:** Bicep template defines Azure SignalR Service with Serverless Standard tier
- **Architecture:** SignalR as primary real-time transport with WebSocket fallback
- **Type Safety:** Full TypeScript types for all SignalR messages and hub methods
- **Integration Pattern:** Hub registration in API startup, middleware chain configuration
- **Cost Optimization:** Serverless SKU with automatic scaling for variable multiplayer load
- **Benefits:** Managed service reduces ops overhead, built-in redundancy, easy multi-region support

### Aspire AppHost Coordination (Issue #21, 2026-03-04)
- **Development Experience:** .NET Aspire orchestrates Web (3000) + API (3001) + Dashboard (15000)
- **Service Discovery:** Environment variables auto-injected for service URLs across Node.js processes
- **Observability:** Unified dashboard for logs, traces, metrics during development
- **Team Impact:** Single `dotnet run` command replaces manual multi-terminal setup


### CI/CD Pipeline Setup (2026-03-04)
- Created three GitHub Actions workflows for monorepo CI/CD
- CI workflow: Builds and tests all workspaces on every push/PR, caches node_modules and build artifacts
- Deploy workflow: Deploys API to Azure Container Apps and web to Static Web Apps on main branch
- Infrastructure workflow: Validates and deploys Bicep templates when infra/ changes
- Uses OIDC for secure Azure authentication, environment protection for production deployments
- All workflows use Node.js 20, npm ci for reproducible installs, and proper artifact management
