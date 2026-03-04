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

### Azure Cosmos DB for Leaderboard Persistence (Issue #26, 2026-03-04)
- **Infrastructure:** Added Cosmos DB with Serverless capacity mode for cost efficiency
- **Database Structure:**
  - Database: `squad-tetris-db`
  - Container: `leaderboard` (partition key: `/gameMode`) for game scores
  - Container: `players` (partition key: `/playerId`) for player data
- **Data Access Layer:**
  - `apps/api/src/cosmos.ts` — Client initialization with environment variable configuration
  - `apps/api/src/leaderboard.ts` — Three core operations:
    - `submitScore()` — Record player score with timestamp
    - `getTopScores()` — Query top scores by game mode (default limit: 10)
    - `getPlayerScores()` — Retrieve all scores for a specific player
- **Bicep Outputs:** Added `cosmosEndpoint` and `cosmosConnectionString` for runtime configuration
- **SDK:** Using `@azure/cosmos` package for Node.js integration
- **Pattern:** Environment variables (COSMOS_ENDPOINT, COSMOS_KEY) for secure connection configuration

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

### Azure SignalR Integration (Issue #22, 2026-03-04)
- **Architecture:** SignalR Service (Serverless Standard tier) for real-time game communication
- **Fallback:** Native WebSocket when SignalR unavailable
- **Type Safety:** Full TypeScript types for SignalR messages and hub methods
- **Integration:** Bicep template defines service, API server configures hub registration and middleware
- **Benefits:** Managed service reduces operational burden, Serverless SKU optimizes costs, built-in redundancy

