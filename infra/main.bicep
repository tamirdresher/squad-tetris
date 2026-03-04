// Squad Tetris — Azure Infrastructure
// Managed by Cloud Squad (Codespace 3)

@description('The location for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('Custom domain for the web app (optional)')
param customDomain string = ''

@description('API backend URL for Static Web App integration')
param apiBackendUrl string = ''

@description('Container image tag for API deployment')
param apiImageTag string = 'latest'

var prefix = 'squad-tetris-${environment}'
var uniqueSuffix = uniqueString(resourceGroup().id)

// Environment-specific scaling configuration
var scalingConfig = {
  dev: {
    minReplicas: 1
    maxReplicas: 3
  }
  staging: {
    minReplicas: 1
    maxReplicas: 5
  }
  prod: {
    minReplicas: 2
    maxReplicas: 10
  }
}

// Cosmos DB for game data and leaderboard
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: '${prefix}-cosmos'
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    capacityMode: 'Serverless'
    locations: [
      {
        locationName: location
        failoverPriority: 0
      }
    ]
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  parent: cosmosAccount
  name: 'squad-tetris-db'
  properties: {
    resource: {
      id: 'squad-tetris-db'
    }
  }
}

resource leaderboardContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: database
  name: 'leaderboard'
  properties: {
    resource: {
      id: 'leaderboard'
      partitionKey: {
        paths: ['/gameMode']
        kind: 'Hash'
      }
    }
  }
}

resource playersContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: database
  name: 'players'
  properties: {
    resource: {
      id: 'players'
      partitionKey: {
        paths: ['/playerId']
        kind: 'Hash'
      }
    }
  }
}

// Azure Static Web App for frontend
resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: '${prefix}-web'
  location: location
  sku: {
    name: environment == 'prod' ? 'Standard' : 'Free'
    tier: environment == 'prod' ? 'Standard' : 'Free'
  }
  properties: {
    repositoryUrl: 'https://github.com/tamirdresher/squad-tetris'
    branch: 'main'
    buildProperties: {
      appLocation: 'apps/web'
      apiLocation: ''
      outputLocation: 'dist'
    }
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

// Link API backend if URL is provided
resource staticWebAppBackend 'Microsoft.Web/staticSites/linkedBackends@2023-01-01' = if (apiBackendUrl != '') {
  parent: staticWebApp
  name: 'api-backend'
  properties: {
    backendResourceId: apiBackendUrl
    region: location
  }
}

// Custom domain configuration
resource staticWebAppCustomDomain 'Microsoft.Web/staticSites/customDomains@2023-01-01' = if (customDomain != '') {
  parent: staticWebApp
  name: customDomain
  properties: {}
}

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
// TODO: Application Insights

output apiUrl string = 'https://${prefix}-api.azurecontainerapps.io'
output webUrl string = staticWebApp.properties.defaultHostname
output cosmosEndpoint string = cosmosAccount.properties.documentEndpoint
output cosmosConnectionString string = cosmosAccount.listConnectionStrings().connectionStrings[0].connectionString
output signalRConnectionString string = signalR.listKeys().primaryConnectionString
output signalREndpoint string = signalR.properties.hostName
