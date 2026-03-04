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
