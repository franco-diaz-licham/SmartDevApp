// ------------------------------------- Parameters -------------------------------------

@description('Azure region for the Function App and plan.')
param location string

@description('Function App name.')
param appName string

@description('Flex Consumption App Service plan name.')
param planName string

@description('Storage account blob endpoint used by Flex Consumption deployment storage.')
param storageAccountBlobEndpoint string

@description('Deployment blob container name.')
param deploymentContainerName string

@description('Storage account connection string used by the Functions host and Flex deployment storage.')
@secure()
param storageConnectionString string

@description('Service Bus connection string used by Service Bus triggers and publishers.')
@secure()
param azureServiceBusConnectionString string

@description('Application Insights connection string.')
param appInsightsConnectionString string

@description('Azure Functions runtime version.')
param functionRuntimeVersion string

@description('Maximum Flex Consumption instances.')
@minValue(1)
param maximumInstanceCount int

@description('Flex Consumption memory size in MB for each instance.')
@allowed([
  2048
  4096
])
param instanceMemoryMB int

@description('HTTP per-instance concurrency. Set 0 for non-HTTP Function Apps.')
@minValue(0)
param httpPerInstanceConcurrency int

@description('Additional app settings.')
param appSettings array

@description('Additional app settings that contain secret values.')
@secure()
param secureAppSettings object = {}

@description('Tags applied to Function App resources.')
param tags object

// ------------------------------------- Variables -------------------------------------

var baseAppSettings = [
  {
    name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
    value: appInsightsConnectionString
  }
  {
    name: 'AzureServiceBus'
    value: azureServiceBusConnectionString
  }
  {
    name: 'AzureWebJobsStorage'
    value: storageConnectionString
  }
  {
    name: 'DEPLOYMENT_STORAGE_CONNECTION_STRING'
    value: storageConnectionString
  }
  {
    name: 'FUNCTIONS_EXTENSION_VERSION'
    value: '~4'
  }
  {
    name: 'FUNCTIONS_WORKER_RUNTIME'
    value: 'dotnet-isolated'
  }
  {
    name: 'DOTNET_ENVIRONMENT'
    value: 'Production'
  }
  {
    name: 'ASPNETCORE_ENVIRONMENT'
    value: 'Production'
  }
  {
    name: 'AZURE_FUNCTIONS_ENVIRONMENT'
    value: 'Production'
  }
]

var secureAppSettingsArray = [
  for setting in items(secureAppSettings): {
    name: setting.key
    value: string(setting.value)
  }
]

var scaleAndConcurrency = union({
  instanceMemoryMB: instanceMemoryMB
  maximumInstanceCount: maximumInstanceCount
}, httpPerInstanceConcurrency > 0 ? {
  triggers: {
    http: {
      perInstanceConcurrency: httpPerInstanceConcurrency
    }
  }
} : {})

// ------------------------------------- Resources -------------------------------------

resource plan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: planName
  location: location
  tags: tags
  kind: 'functionapp'
  sku: {
    name: 'FC1'
    tier: 'FlexConsumption'
  }
  properties: {
    reserved: true
  }
}

resource functionApp 'Microsoft.Web/sites@2024-11-01' = {
  name: appName
  location: location
  tags: tags
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    functionAppConfig: {
      deployment: {
        storage: {
          authentication: {
            storageAccountConnectionStringName: 'DEPLOYMENT_STORAGE_CONNECTION_STRING'
            type: 'StorageAccountConnectionString'
          }
          type: 'blobContainer'
          value: '${storageAccountBlobEndpoint}${deploymentContainerName}'
        }
      }
      runtime: {
        name: 'dotnet-isolated'
        version: functionRuntimeVersion
      }
      scaleAndConcurrency: scaleAndConcurrency
    }
    httpsOnly: true
    serverFarmId: plan.id
    siteConfig: {
      appSettings: concat(baseAppSettings, secureAppSettingsArray, appSettings)
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
    }
  }
}

// ------------------------------------- Outputs -------------------------------------

output defaultHostname string = functionApp.properties.defaultHostName
output defaultOrigin string = 'https://${functionApp.properties.defaultHostName}'
output functionAppName string = functionApp.name
output principalId string = functionApp.identity.principalId
