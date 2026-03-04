# Infrastructure

Azure infrastructure-as-code for Squad Tetris.

## Squad: Cloud Team

Owned by Codespace 3 (Cloud Squad). Manages:
- Azure Container Apps (API hosting)
- Azure Static Web Apps (frontend)
- Azure SignalR Service (WebSocket scaling)
- Azure Cosmos DB (leaderboard)
- Application Insights (telemetry)

## Deployment

```bash
az deployment group create \
  --resource-group squad-tetris-rg \
  --template-file main.bicep
```
