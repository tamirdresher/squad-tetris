// Squad Tetris — Azure Infrastructure
// Managed by Cloud Squad (Codespace 3)

@description('The location for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Custom domain for the CDN (optional)')
param cdnCustomDomain string = ''

var prefix = 'squad-tetris-${environment}'

// TODO: Azure Container Apps Environment
// TODO: Container App for API
// TODO: Static Web App for frontend
// TODO: SignalR Service for WebSocket scaling
// TODO: Cosmos DB for leaderboard
// TODO: Application Insights

output apiUrl string = 'https://${prefix}-api.azurecontainerapps.io'
output webUrl string = 'https://${prefix}-web.azurestaticapps.net'
