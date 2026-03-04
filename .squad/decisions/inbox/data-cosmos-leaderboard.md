# Cosmos DB for Leaderboard Persistence

**Date:** 2026-03-04  
**Author:** Data (Backend Dev)  
**Issue:** #26 — Add Azure Cosmos DB for leaderboard persistence

## Decision

Implemented Azure Cosmos DB as the persistence layer for game leaderboards and player data using Serverless capacity mode.

## Context

The multiplayer Tetris game requires persistent storage for:
- Player scores across different game modes
- Historical player performance data
- Leaderboard rankings

## Implementation Details

### Database Design
- **Capacity Mode:** Serverless — cost-effective for variable workloads, pay-per-request pricing
- **Database:** `squad-tetris-db`
- **Containers:**
  - `leaderboard` — Partition key: `/gameMode` (enables efficient queries by game type)
  - `players` — Partition key: `/playerId` (optimizes player-specific lookups)

### Data Access Pattern
Created a clean data access layer in `apps/api/src/leaderboard.ts`:
- `submitScore()` — Atomic score submission with composite ID (playerId-timestamp)
- `getTopScores()` — Ordered query with configurable limit
- `getPlayerScores()` — Player history retrieval

### Configuration
- Environment variables for secure connection: `COSMOS_ENDPOINT`, `COSMOS_KEY`
- Bicep outputs provide connection details to API deployment
- Client initialization validates configuration on startup

## Rationale

**Why Serverless:**
- Development/staging environments have sporadic usage patterns
- No minimum RU/s charges when idle
- Automatic scaling for production traffic spikes

**Why Cosmos DB:**
- Native Azure integration with Container Apps
- Global distribution capability for future multi-region support
- Strong consistency guarantees for competitive leaderboards
- SQL-like query syntax for familiar development experience

## Team Impact

- **Cloud:** Bicep infrastructure includes Cosmos DB resources and outputs
- **Backend:** Data access layer ready for API endpoint integration
- **All:** Environment configuration required (COSMOS_ENDPOINT, COSMOS_KEY) from Bicep deployment

## Next Steps

1. Integrate data access layer with Express API endpoints
2. Add leaderboard caching strategy for high-traffic scenarios
3. Implement rate limiting on score submission
4. Consider indexing policies for query optimization
