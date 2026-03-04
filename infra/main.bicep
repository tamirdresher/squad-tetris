// Squad Tetris — Azure Infrastructure
// Managed by Cloud Squad (Codespace 3)

@description('The location for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

var prefix = 'squad-tetris-${environment}'

// SignalR Service for WebSocket scaling
resource signalR 'Microsoft.SignalRService/signalR@2023-02-01' = {
  name: '${prefix}-signalr'
  location: location
  sku: {
    name: 'Standard_S1'
    tier: 'Standard'
    capacity: 1
  }
  kind: 'SignalR'
  properties: {
    features: [
      {
        flag: 'ServiceMode'
        value: 'Serverless'
      }
      {
        flag: 'EnableConnectivityLogs'
        value: 'true'
      }
    ]
    cors: {
      allowedOrigins: [
        '*'
      ]
    }
  }
}

// TODO: Azure Container Apps Environment
// TODO: Container App for API
// TODO: Static Web App for frontend
// TODO: Cosmos DB for leaderboard
// TODO: Application Insights

output apiUrl string = 'https://${prefix}-api.azurecontainerapps.io'
output webUrl string = 'https://${prefix}-web.azurestaticapps.net'
output signalRConnectionString string = signalR.listKeys().primaryConnectionString
output signalREndpoint string = signalR.properties.hostName
