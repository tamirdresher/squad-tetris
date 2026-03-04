# Decision: .NET Aspire for Local Development Orchestration

**Date:** 2026-03-04  
**Author:** Data (Backend Dev)  
**Issue:** #21 — Create Aspire AppHost for local orchestration  
**Status:** Implemented

## Context

Squad Tetris is a multiplayer Tetris game with multiple services (web frontend, API backend) that need to run together during local development. We needed a solution for orchestrating these services with observability built in.

## Decision

Use .NET Aspire AppHost for local development orchestration instead of:
- Manual `npm run dev:web` + `npm run dev:api` in separate terminals
- docker-compose
- Custom shell scripts

## Rationale

1. **Unified Developer Experience:** Single command (`dotnet run --project AppHost`) starts all services
2. **Built-in Observability:** Aspire Dashboard provides logs, traces, and metrics out of the box
3. **Service Discovery:** Automatic environment variable injection for service URLs
4. **Easy Infrastructure Addition:** Simple API to add Redis, PostgreSQL, etc. as needed
5. **Cloud-Ready Path:** Aspire projects can publish to container apps with minimal changes
6. **Node.js Integration:** First-class support via `Aspire.Hosting.NodeJs` package

## Implementation

- **Location:** `infra/aspire/`
- **Entry Point:** `AppHost/Program.cs` using `AddNpmApp()` for Node.js processes
- **Service Defaults:** Shared telemetry configuration in `ServiceDefaults/`
- **Ports:** Web (3000), API (3001), Dashboard (15000)

## Trade-offs

**Pros:**
- Excellent developer experience with unified dashboard
- Easy to add new services and infrastructure
- Production-like observability in local development

**Cons:**
- Requires .NET 8 SDK installation (additional prerequisite)
- Team members need to install Aspire workload
- Slightly heavier than pure npm scripts

## Alternatives Considered

1. **docker-compose:** More familiar but lacks observability dashboard, slower startup
2. **npm-run-all / concurrently:** Simple but no service discovery or observability
3. **Tiltdev:** Kubernetes-focused, overkill for this project

## Next Steps

- Document Aspire setup in main README
- Add optional Redis integration when needed for game state caching
- Consider Aspire deployment manifests for Azure Container Apps later

## References

- [.NET Aspire Documentation](https://learn.microsoft.com/dotnet/aspire/)
- [Node.js Integration Guide](https://learn.microsoft.com/dotnet/aspire/get-started/build-aspire-apps-with-nodejs)
