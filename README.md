# 🎮 Multiplayer Tetris — Multi-Codespace Squad Experiment

Multiplayer Tetris built by 3 AI Squad teams in parallel GitHub Codespaces.
An experiment in scalable AI workforce coordination.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│                  tamirdresher/squad-tetris                   │
├─────────────┬─────────────────┬─────────────────────────────┤
│  Codespace 1│   Codespace 2   │        Codespace 3          │
│  UI Squad   │  Backend Squad  │       Cloud Squad            │
│             │                 │                              │
│ ┌─────────┐ │ ┌─────────────┐ │ ┌──────────────────────────┐│
│ │ React   │ │ │ Express API │ │ │ Azure Infra              ││
│ │ Frontend│ │ │ + WebSocket │ │ │ SignalR + Container Apps ││
│ │ (web/)  │ │ │ (api/)      │ │ │ (infra/)                 ││
│ └─────────┘ │ └─────────────┘ │ └──────────────────────────┘│
│             │ ┌─────────────┐ │                              │
│             │ │ Game Engine │ │                              │
│             │ │ (shared)    │ │                              │
│             │ └─────────────┘ │                              │
└─────────────┴─────────────────┴─────────────────────────────┘
         │              │                    │
         └──────────────┼────────────────────┘
                        ▼
              GitHub Issues + Labels
            (Coordination Protocol)
```

## Monorepo Structure

```
apps/
  web/        → React frontend (Tetris UI)
  api/        → Backend API (Express + WebSocket)
  mobile/     → PWA for mobile play
packages/
  game-engine/ → Shared Tetris game logic
infra/        → Azure Bicep templates
docs/         → Experiment design docs
```

## Running Each Squad

### UI Squad (Codespace 1)
```bash
cd apps/web
npm install
npm run dev
```

### Backend Squad (Codespace 2)
```bash
cd apps/api
npm install
npm run dev
```

### Cloud Squad (Codespace 3)
```bash
cd infra
# Deploy with Azure CLI
az deployment group create --template-file main.bicep
```

## Running with Aspire (Local Orchestration)

```bash
# From root — Aspire orchestrates all services
dotnet run --project infra/aspire/AppHost
```

## Coordination

Each Squad picks up work via GitHub Issues labeled `squad:{team}`.
Branches follow the pattern: `squad/cs{N}-{issue}-{slug}`.
PRs are reviewed cross-team before merge.

## License

MIT
