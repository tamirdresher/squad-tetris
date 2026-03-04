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

// ============================================================
// Azure Container Registry
// ============================================================

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: '${replace(prefix, '-', '')}${uniqueSuffix}'
  location: location
  sku: {
    name: environment == 'prod' ? 'Standard' : 'Basic'
  }
  properties: {
    adminUserEnabled: true
    publicNetworkAccess: 'Enabled'
  }
}

// ============================================================
// Log Analytics Workspace (required for Container Apps)
// ============================================================

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${prefix}-logs'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: environment == 'prod' ? 90 : 30
  }
}

// ============================================================
// Container Apps Environment
// ============================================================

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${prefix}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
    zoneRedundant: environment == 'prod' ? true : false
  }
}

// ============================================================
// Container App for API Service
// ============================================================

resource apiContainerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: '${prefix}-api'
  location: location
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3001
        transport: 'auto'
        allowInsecure: false
        traffic: [
          {
            latestRevision: true
            weight: 100
          }
        ]
      }
      registries: [
        {
          server: acr.properties.loginServer
          username: acr.listCredentials().username
          passwordSecretRef: 'acr-password'
        }
      ]
      secrets: [
        {
          name: 'acr-password'
          value: acr.listCredentials().passwords[0].value
        }
        {
          name: 'cosmos-connection-string'
          value: cosmosAccount.listConnectionStrings().connectionStrings[0].connectionString
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'api'
          image: '${acr.properties.loginServer}/squad-tetris-api:${apiImageTag}'
          resources: {
            cpu: json(environment == 'prod' ? '1.0' : '0.5')
            memory: environment == 'prod' ? '2Gi' : '1Gi'
          }
          env: [
            {
              name: 'NODE_ENV'
              value: environment
            }
            {
              name: 'PORT'
              value: '3001'
            }
            {
              name: 'CORS_ORIGIN'
              value: environment == 'dev' ? '*' : 'https://${prefix}-web.azurestaticapps.net'
            }
            {
              name: 'COSMOS_CONNECTION_STRING'
              secretRef: 'cosmos-connection-string'
            }
            {
              name: 'COSMOS_DATABASE_NAME'
              value: 'squad-tetris-db'
            }
          ]
        }
      ]
      scale: {
        minReplicas: scalingConfig[environment].minReplicas
        maxReplicas: scalingConfig[environment].maxReplicas
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '100'
              }
            }
          }
        ]
      }
    }
  }
}

// TODO: SignalR Service for WebSocket scaling
// TODO: Application Insights

output apiUrl string = 'https://${apiContainerApp.properties.configuration.ingress.fqdn}'
output webUrl string = staticWebApp.properties.defaultHostname
output cosmosEndpoint string = cosmosAccount.properties.documentEndpoint
output cosmosConnectionString string = cosmosAccount.listConnectionStrings().connectionStrings[0].connectionString
output acrLoginServer string = acr.properties.loginServer
output containerAppsEnvironmentId string = containerAppsEnvironment.id
