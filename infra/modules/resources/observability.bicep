@description('Environment-specific resource sizing, retention and SKU configuration.')
param config object

// ------------------------------------- Parameters -------------------------------------

@description('Azure region for observability resources.')
param location string

@description('Log Analytics workspace name.')
param logAnalyticsWorkspaceName string

@description('Application Insights resource name.')
param appInsightsName string

@description('Tags applied to observability resources.')
param tags object

// ------------------------------------- Resources -------------------------------------

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  tags: tags
  properties: {
    sku: {
      name: config.logAnalytics.skuName
    }
    retentionInDays: config.logAnalytics.retentionInDays
    workspaceCapping: {
      dailyQuotaGb: config.logAnalytics.dailyQuotaGb
    }
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  tags: tags
  kind: config.applicationInsights.kind
  properties: {
    Application_Type: config.applicationInsights.applicationType
    Flow_Type: config.applicationInsights.flowType
    IngestionMode: config.applicationInsights.ingestionMode
    Request_Source: config.applicationInsights.requestSource
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

// ------------------------------------- Outputs -------------------------------------

output applicationInsightsConnectionString string = applicationInsights.properties.ConnectionString
output applicationInsightsInstrumentationKey string = applicationInsights.properties.InstrumentationKey
output applicationInsightsName string = applicationInsights.name
output logAnalyticsWorkspaceName string = logAnalyticsWorkspace.name
