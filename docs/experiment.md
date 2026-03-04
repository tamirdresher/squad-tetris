# Multi-Codespace Squad Experiment — Multiplayer Tetris

## Vision

Prove that multiple Squad instances running in separate GitHub Codespaces can coordinate work on a shared repo via GitHub Issues — each with its own auth, toolset, and team composition.

## Architecture

3 Codespaces, 3 Squads:

| Codespace | Squad        | Focus                          | Labels              |
|-----------|-------------|--------------------------------|---------------------|
| CS-1      | UI Squad    | React frontend, lobby, scores  | `squad:ui-team`     |
| CS-2      | Backend Squad | Game engine, WebSocket, REST | `squad:backend-team`|
| CS-3      | Cloud Squad | Azure, SignalR, deploy         | `squad:cloud-team`  |

### System Architecture

```
┌──────────────┐     WebSocket      ┌──────────────┐
│   React UI   │◄──────────────────►│  Express API  │
│  (apps/web)  │                    │  (apps/api)   │
└──────────────┘                    └───────┬───────┘
                                           │
                                    ┌──────┴───────┐
                                    │ Game Engine   │
                                    │ (packages/)   │
                                    └──────────────┘
                                           │
                              ┌────────────┼────────────┐
                              ▼            ▼            ▼
                        ┌──────────┐ ┌──────────┐ ┌──────────┐
                        │ SignalR  │ │ CosmosDB │ │ App      │
                        │ Service  │ │          │ │ Insights │
                        └──────────┘ └──────────┘ └──────────┘
```

## Coordination Protocol

- **Issue Labels**: GitHub Issues with `squad:{team}` labels. Each Ralph polls only its labels.
- **Branching**: `squad/cs{N}-{issue}-{slug}` (e.g., `squad/cs1-42-game-board`)
- **Pull Requests**: Reviewed cross-team before merge.
- **Priority**: P0 issues first, then P1, then P2.

## What We're Proving

1. **Scalability**: N Codespaces = N parallel workers. Adding a 4th squad is just another Codespace.
2. **Isolation**: Each Squad has its own team composition, memory, and decision-making. No shared context needed.
3. **Coordination**: GitHub Issues + labels = sufficient protocol for multi-agent coordination. No custom orchestrator needed.
4. **Real Work**: This is an actual multiplayer game with real complexity — collision detection, WebSocket state sync, cloud deployment. Not a toy demo.

## Experiment Phases

### Phase 1: Foundation (P0 Issues)
All three squads work on their P0 issues in parallel:
- UI: React scaffold, game board, piece rendering
- Backend: Express server, game engine, WebSocket
- Cloud: Aspire AppHost, SignalR setup

### Phase 2: Features (P1 Issues)
Integration begins — squads start depending on each other:
- UI consumes WebSocket API from Backend
- Backend uses SignalR from Cloud for scaling
- Cloud deploys what UI and Backend have built

### Phase 3: Polish (P2 Issues)
Final touches — themes, spectator mode, auto-scaling:
- All squads contribute to cross-cutting concerns
- Integration testing across the full stack

## Success Criteria

- [ ] All 30 issues completed via Squad automation
- [ ] Each squad worked independently in its own Codespace
- [ ] PRs were created and merged without human intervention
- [ ] The game is playable end-to-end (local + deployed)
- [ ] No coordination failures (merge conflicts resolved, no duplicate work)

## Blog Material

This experiment produces material for a blog post on:
- How AI teams can scale horizontally via Codespaces
- GitHub Issues as a coordination protocol for AI agents
- Real-world complexity in AI-generated software
- Lessons learned from multi-agent software development
