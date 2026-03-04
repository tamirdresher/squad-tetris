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

### Auto-Scaling Rules for Game Servers (Issue #29, 2026-03-04)
- **Scaling Strategy:** Game-specific rules optimized for WebSocket connections (5-15 min sessions)
- **HTTP Concurrent Requests:** Scale at 50 connections per replica (tracks active game connections)
- **CPU Utilization:** Scale at 70% CPU (handles game state computation load)
- **Replica Configuration:** Min 1 always-on, max 20 (prod) / 3 (dev) - scale-to-zero disabled
- **Cool-down Period:** 60 seconds to prevent thrashing during connection spikes
- **Connection Draining:** Graceful scale-down allows in-flight game sessions to complete
- **Trade-offs:** Always-on replica increases cost but ensures game availability; long cool-down prioritizes stability over rapid response
