# Project Context

- **Project:** squad-tetris — Multiplayer Tetris game
- **Stack:** TypeScript monorepo, React frontend, Node.js API, shared game engine package, Azure infrastructure
- **Teams:** UI, Backend, Mobile — working in parallel across Codespaces
- **User:** Tamir Dresher
- **Created:** 2026-03-04

## Core Context

Agent Data initialized as Backend Dev. Owns the Node.js API — multiplayer services, WebSocket communication, game state sync, and server-side logic.

## Recent Updates

📌 Team initialized on 2026-03-04

## Learnings

Initial setup complete.

### Application Insights Telemetry Integration (Issue #28, 2026-03-04)
- **Architecture:** Application Insights for distributed tracing, logging, and metrics
- **Infrastructure:** Added App Insights resource linked to Log Analytics workspace in Bicep template
- **SDK Integration:** Installed applicationinsights npm package, created telemetry.ts module
- **Features:**
  - Auto-collection: HTTP requests, dependencies, exceptions, performance, console logs
  - Custom tracking: Game metrics (games_started, lines_cleared, matches_completed), traces, events
  - Graceful degradation: No-op mode when connection string absent (local development)
- **Initialization:** Telemetry initialized before other imports to capture all app instrumentation
- **Best Practice:** Flush telemetry on shutdown to ensure data persistence
- **Pattern:** Environment-based retention (90 days prod, 30 days dev/staging)
