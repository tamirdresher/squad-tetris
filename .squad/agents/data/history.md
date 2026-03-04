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

### Aspire AppHost for Local Development (Issue #21, 2026-03-04)
- **Architecture Decision:** .NET Aspire for local development orchestration instead of docker-compose or manual npm scripts
- **Key Benefits:** Unified dashboard for logs/traces/metrics, service discovery, automatic restarts, easy infrastructure additions
- **Files:**
  - `infra/aspire/AppHost/Program.cs` — Main orchestration, AddNpmApp() for Node.js processes
  - `infra/aspire/AppHost/AppHost.csproj` — Project definition with Aspire.Hosting.NodeJs package
  - `infra/aspire/ServiceDefaults/` — Shared telemetry and health check configuration
  - `infra/aspire/README.md` — Setup and usage documentation
- **Ports:** Web on 3000, API on 3001, Aspire Dashboard on 15000
- **Pattern:** Use AddNpmApp() with repo root working directory, npm workspace scripts (dev:web, dev:api)
- **Prerequisites:** .NET 8 SDK + Aspire workload (`dotnet workload install aspire`)
