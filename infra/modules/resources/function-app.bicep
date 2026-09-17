// ------------------------------------- Parameters -------------------------------------

@description('Function App hosting, runtime, deployment, and scaling settings.')
param configuration object

@description('Function App name.')
param appName string

@description('Flex Consumption App Service plan name.')
param planName string

@description('Storage account blob endpoint used by Flex Consumption deployment storage.')
param storageAccountBlobEndpoint string

@description('Storage account connection string used by the Functions host and Flex deployment storage.')
@secure()
param storageConnectionString string

@description('Service Bus connection string used by Service Bus triggers and publishers.')
@secure()
param azureServiceBusConnectionString string

@description('Application Insights connection string.')
param appInsightsConnectionString string

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
    value: configuration.runtime.extensionVersion
  }
  {
    name: 'FUNCTIONS_WORKER_RUNTIME'
    value: configuration.runtime.name
  }
  {
    name: 'DOTNET_ENVIRONMENT'
    value: configuration.runtime.environmentName
  }
  {
    name: 'ASPNETCORE_ENVIRONMENT'
    value: configuration.runtime.environmentName
  }
  {
    name: 'AZURE_FUNCTIONS_ENVIRONMENT'
    value: configuration.runtime.environmentName
  }
]

var secureAppSettingsArray = [
  for setting in items(secureAppSettings): {
    name: setting.key
    value: string(setting.value)
  }
]

var scaleAndConcurrency = union(
  {
    instanceMemoryMB: configuration.scale.instanceMemoryMB
    maximumInstanceCount: configuration.scale.maximumInstanceCount
  },
  configuration.scale.httpPerInstanceConcurrency > 0
    ? {
        triggers: {
          http: {
            perInstanceConcurrency: configuration.scale.httpPerInstanceConcurrency
          }
        }
      }
    : {}
)

// ------------------------------------- Resources -------------------------------------

resource plan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: planName
  location: configuration.location
  tags: tags
  kind: configuration.plan.kind
  sku: {
    name: configuration.plan.skuName
    tier: configuration.plan.skuTier
  }
  properties: {
    reserved: configuration.plan.reserved
  }
}

resource functionApp 'Microsoft.Web/sites@2024-11-01' = {
  name: appName
  location: configuration.location
  tags: tags
  kind: configuration.site.kind
  identity: {
    type: configuration.site.identityType
  }
  properties: {
    functionAppConfig: {
      deployment: {
        storage: {
          authentication: {
            storageAccountConnectionStringName: configuration.deployment.storageConnectionSettingName
            type: configuration.deployment.authenticationType
          }
          type: configuration.deployment.storageType
          value: '${storageAccountBlobEndpoint}${configuration.deployment.containerName}'
        }
      }
      runtime: {
        name: configuration.runtime.name
        version: configuration.runtime.version
      }
      scaleAndConcurrency: scaleAndConcurrency
    }
    httpsOnly: configuration.site.httpsOnly
    serverFarmId: plan.id
    siteConfig: {
      appSettings: concat(baseAppSettings, secureAppSettingsArray, appSettings)
      ftpsState: configuration.site.ftpsState
      minTlsVersion: configuration.site.minimumTlsVersion
    }
  }
}

// ------------------------------------- Outputs -------------------------------------

output defaultHostname string = functionApp.properties.defaultHostName
output defaultOrigin string = 'https://${functionApp.properties.defaultHostName}'
output functionAppName string = functionApp.name
output principalId string = functionApp.identity.principalId
