# Squad Decisions

## Active Decisions

### .NET Aspire for Local Development Orchestration

**Date:** 2026-03-04  
**Author:** Data (Backend Dev)  
**Issue:** #21 — Create Aspire AppHost for local orchestration  
**Status:** Implemented

- Use .NET Aspire AppHost instead of docker-compose or manual npm scripts
- Unified developer experience with single command startup
- Built-in observability dashboard for logs, traces, metrics
- Service discovery with automatic environment variable injection
- Ports: Web (3000), API (3001), Dashboard (15000)
- Location: `infra/aspire/`
- Branch: `squad/21-aspire-apphost`

**Trade-offs:** Requires .NET 8 SDK + Aspire workload installation; significantly improves DX with unified dashboard and service discovery.

### Azure SignalR Service (Serverless) for Real-Time Communication

**Date:** 2026-03-04  
**Author:** Riker (Lead)  
**Issue:** #22 — Azure SignalR Service Bicep Integration  
**Status:** Implemented

- Deploy Azure SignalR Service (Serverless Standard tier) for multiplayer game communication
- Typed service layer with SignalR/WebSocket fallback
- Hub pattern for broadcast and targeted messaging
- Bicep template updated for production deployment
- Branch: `squad/22-signalr-service`

**Architecture:** SignalR as primary transport with native WebSocket fallback for compatibility. Type-safe TypeScript API for game events.

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
