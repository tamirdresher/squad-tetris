# Express Server Architecture for API

**Date:** 2026-03-04  
**Author:** Data (Backend Dev)  
**Issue:** #25 — Health Check Endpoints

## Decision

Set up Express as the web framework for the squad-tetris API with production-ready patterns:

1. **Async Initialization Pattern**
   - Server startup wrapped in async `startServer()` function
   - Allows for sequential dependency initialization (DB, SignalR, etc.)
   - Mark service as ready only after dependencies are initialized

2. **Health Check Architecture**
   - Extensible health check module (`apps/api/src/health.ts`)
   - Separate `/health` (always healthy) and `/ready` (depends on init state) endpoints
   - Dependency registration system for future additions (DB, SignalR, external services)

3. **Graceful Shutdown**
   - SIGTERM handler for orchestrator/container lifecycle
   - Closes server connections cleanly before process exit
   - Prevents in-flight request failures during deployment

4. **TypeScript Configuration**
   - CommonJS module format for Node.js compatibility
   - ES2020 target with strict type checking
   - Separate `tsconfig.json` for API package extending root config

## Rationale

- **Monitoring:** `/health` and `/ready` are Kubernetes/orchestrator standards
- **Extensibility:** Dependency checks allow adding DB, SignalR, external API health validation
- **Production:** Graceful shutdown and async init prevent deployment issues
- **First Setup:** This is the baseline Express architecture for the API — future features build on this

## Future Considerations

- Add specific dependency checks when integrating Cosmos DB (issue #26)
- Add SignalR hub readiness check (issue #22)
- Consider health check timeout thresholds for slow dependencies
- Add metrics endpoint (`/metrics`) for Prometheus/telemetry

## Files Changed

- `apps/api/src/index.ts` — Express server with async initialization
- `apps/api/src/health.ts` — Health check module
- `apps/api/tsconfig.json` — TypeScript configuration
- `apps/api/package.json` — Added `express` dependency
