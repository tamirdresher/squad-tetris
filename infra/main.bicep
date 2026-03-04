// Squad Tetris — Azure Infrastructure
// Managed by Cloud Squad (Codespace 3)

@description('The location for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Custom domain for the CDN (optional)')
param cdnCustomDomain string = ''

var prefix = 'squad-tetris-${environment}'

// ============================================================
// Log Analytics Workspace (for Application Insights)
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
// Application Insights for Telemetry
// ============================================================

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${prefix}-appinsights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    RetentionInDays: environment == 'prod' ? 90 : 30
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// TODO: Azure Container Apps Environment
// TODO: Container App for API
// TODO: Static Web App for frontend
// TODO: SignalR Service for WebSocket scaling
// TODO: Cosmos DB for leaderboard

// CDN Profile
resource cdnProfile 'Microsoft.Cdn/profiles@2023-05-01' = {
  name: '${prefix}-cdn'
  location: 'global'
  sku: {
    name: 'Standard_Microsoft'
  }
}

// CDN Endpoint
resource cdnEndpoint 'Microsoft.Cdn/profiles/endpoints@2023-05-01' = {
  parent: cdnProfile
  name: '${prefix}-endpoint'
  location: 'global'
  properties: {
    origins: [
      {
        name: 'staticWebApp'
        hostName: staticWebApp.properties.defaultHostname
        httpsPort: 443
        httpPort: 80
        originHostHeader: staticWebApp.properties.defaultHostname
      }
    ]
    originPath: ''
    contentTypesToCompress: [
      'application/javascript'
      'text/css'
      'text/html'
      'application/json'
    ]
    isCompressionEnabled: true
    isHttpAllowed: false
    isHttpsAllowed: true
    deliveryPolicy: {
      rules: [
        {
          name: 'ImmutableAssets'
          order: 1
          conditions: [
            {
              name: 'UrlPath'
              parameters: {
                operator: 'BeginsWith'
                transforms: []
                negateCondition: false
                matchValues: [
                  '/assets/'
                ]
                typeName: 'DeliveryRuleUrlPathConditionParameters'
              }
            }
            {
              name: 'UrlFileExtension'
              parameters: {
                operator: 'Any'
                transforms: []
                negateCondition: false
                matchValues: [
                  'js'
                  'css'
                  'jpg'
                  'jpeg'
                  'png'
                  'gif'
                  'svg'
                  'webp'
                  'woff'
                  'woff2'
                  'ttf'
                  'eot'
                ]
                typeName: 'DeliveryRuleUrlFileExtensionConditionParameters'
              }
            }
          ]
          actions: [
            {
              name: 'CacheExpiration'
              parameters: {
                cacheBehavior: 'Override'
                cacheDuration: '365.00:00:00'
                typeName: 'DeliveryRuleCacheExpirationActionParameters'
              }
            }
          ]
        }
        {
          name: 'HtmlFiles'
          order: 2
          conditions: [
            {
              name: 'UrlFileExtension'
              parameters: {
                operator: 'Equal'
                transforms: []
                negateCondition: false
                matchValues: [
                  'html'
                ]
                typeName: 'DeliveryRuleUrlFileExtensionConditionParameters'
              }
            }
          ]
          actions: [
            {
              name: 'CacheExpiration'
              parameters: {
                cacheBehavior: 'Override'
                cacheDuration: '00:05:00'
                typeName: 'DeliveryRuleCacheExpirationActionParameters'
              }
            }
          ]
        }
        {
          name: 'ApiPassthrough'
          order: 3
          conditions: [
            {
              name: 'UrlPath'
              parameters: {
                operator: 'BeginsWith'
                transforms: []
                negateCondition: false
                matchValues: [
                  '/api/'
                ]
                typeName: 'DeliveryRuleUrlPathConditionParameters'
              }
            }
          ]
          actions: [
            {
              name: 'CacheExpiration'
              parameters: {
                cacheBehavior: 'Bypass'
                typeName: 'DeliveryRuleCacheExpirationActionParameters'
              }
            }
          ]
        }
      ]
    }
  }
}

// CDN Custom Domain (conditional on cdnCustomDomain parameter)
resource cdnCustomDomain 'Microsoft.Cdn/profiles/customDomains@2023-05-01' = if (!empty(cdnCustomDomain)) {
  parent: cdnProfile
  name: replace(cdnCustomDomain, '.', '-')
  properties: {
    hostName: cdnCustomDomain
  }
}

output apiUrl string = 'https://${prefix}-api.azurecontainerapps.io'
output webUrl string = 'https://${prefix}-web.azurestaticapps.net'
output cdnUrl string = 'https://${cdnEndpoint.properties.hostName}'
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
output appInsightsConnectionString string = appInsights.properties.ConnectionString
