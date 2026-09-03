targetScope = 'resourceGroup'

// ------------------------------------- Parameters -------------------------------------

@description('Azure region for regional resources.')
param location string

@description('Azure region for Static Web Apps. Static Web Apps Free is not available in every Azure region.')
param staticWebAppLocation string

@description('Short workload name used in Azure resource names.')
param workloadName string

@description('Environment label used in Azure resource names and tags.')
param environmentName string

@description('Tags applied to all Azure resources.')
param tags object

@description('Custom DNS zone name for the public site. Leave empty to skip DNS zone creation.')
param dnsZoneName string = ''

@description('Microsoft Entra tenant ID expected by the API Functions app.')
param apiEntraTenantId string

@description('Microsoft Entra audience expected by the API Functions app.')
param apiEntraAudience string

@description('Microsoft Entra owner object ID allowed to use owner-only admin APIs.')
param apiEntraOwnerObjectId string

@description('Frontend Microsoft Entra client ID emitted for GitHub Actions.')
param frontendEntraClientId string

@description('Frontend Microsoft Entra authority URL emitted for GitHub Actions.')
param frontendEntraAuthority string

@description('Frontend Microsoft Entra API scope emitted for GitHub Actions.')
param frontendEntraApiScope string

@description('Azure Communication Services data residency geography.')
param communicationDataLocation string

@description('Override sender address. Leave empty to use the Azure managed email domain default DoNotReply sender.')
param communicationSenderAddress string = ''

@description('Cosmos DB database name used by the API.')
param cosmosDatabaseName string

@description('Cosmos DB database shared throughput.')
@minValue(400)
param cosmosThroughput int

@description('Default TTL in seconds for short-lived contact-message documents.')
@minValue(60)
param contactMessageTtlSeconds int

@description('Azure Functions runtime version used by both Function Apps.')
param functionRuntimeVersion string

@description('Maximum Flex Consumption instances for the API Function App.')
@minValue(1)
param apiMaximumInstanceCount int

@description('Maximum Flex Consumption instances for the Worker Function App.')
@minValue(1)
param workerMaximumInstanceCount int

@description('Flex Consumption memory size in MB for each Function App instance.')
@allowed([
  2048
  4096
])
param functionInstanceMemoryMB int

@description('Per-instance HTTP concurrency for the API Function App.')
@minValue(1)
param apiHttpPerInstanceConcurrency int

// ------------------------------------- Variables -------------------------------------

var normalizedWorkloadName = toLower(replace(workloadName, '_', '-'))
var normalizedEnvironmentName = toLower(replace(environmentName, '_', '-'))
var compactName = toLower(replace(replace('${normalizedWorkloadName}${normalizedEnvironmentName}', '-', ''), '_', ''))
var resourceToken = uniqueString(resourceGroup().id, normalizedWorkloadName, normalizedEnvironmentName)
var resourcePrefix = '${normalizedWorkloadName}-${normalizedEnvironmentName}'
var sharedTags = union(tags, {
  workload: workloadName
  environment: environmentName
})

var names = {
  apiFunctionApp: take('${resourcePrefix}-api-af', 60)
  apiServicePlan: take('${resourcePrefix}-api-asp', 40)
  appInsights: take('${resourcePrefix}-ai', 255)
  communicationService: take('${compactName}acs${resourceToken}', 63)
  cosmosAccount: take('${resourcePrefix}-cdb-${resourceToken}', 44)
  dnsZone: dnsZoneName
  emailService: take('${compactName}email${resourceToken}', 63)
  keyVault: take('kv-${compactName}-${resourceToken}', 24)
  logAnalyticsWorkspace: take('${resourcePrefix}-law', 63)
  serviceBusNamespace: take('${resourcePrefix}-sb-${resourceToken}', 50)
  staticWebApp: take('${resourcePrefix}-swa', 40)
  storageAccount: take('${compactName}sa${resourceToken}', 24)
  workerFunctionApp: take('${resourcePrefix}-worker-af', 60)
  workerServicePlan: take('${resourcePrefix}-worker-asp', 40)
}

// ------------------------------------- Modules -------------------------------------

module frontend './modules/static-web-app.bicep' = {
  name: 'static-web-app'
  params: {
    location: staticWebAppLocation
    name: names.staticWebApp
    tags: sharedTags
  }
}

module observability './modules/observability.bicep' = {
  name: 'observability'
  params: {
    appInsightsName: names.appInsights
    location: location
    logAnalyticsWorkspaceName: names.logAnalyticsWorkspace
    tags: sharedTags
  }
}

module storage './modules/storage-account.bicep' = {
  name: 'storage-account'
  params: {
    deploymentContainerNames: [
      'api-functions-deployments'
      'worker-functions-deployments'
    ]
    location: location
    storageAccountName: names.storageAccount
    tags: sharedTags
  }
}

module serviceBus './modules/service-bus.bicep' = {
  name: 'service-bus'
  params: {
    location: location
    namespaceName: names.serviceBusNamespace
    tags: sharedTags
  }
}

module cosmos './modules/cosmos-db.bicep' = {
  name: 'cosmos-db'
  params: {
    accountName: names.cosmosAccount
    contactMessageTtlSeconds: contactMessageTtlSeconds
    databaseName: cosmosDatabaseName
    location: location
    tags: sharedTags
    throughput: cosmosThroughput
  }
}

module communication './modules/communication-services.bicep' = {
  name: 'communication-services'
  params: {
    communicationServiceName: names.communicationService
    dataLocation: communicationDataLocation
    emailServiceName: names.emailService
    tags: sharedTags
  }
}

var resolvedCommunicationSenderAddress = empty(communicationSenderAddress)
  ? 'DoNotReply@${communication.outputs.mailFromSenderDomain}'
  : communicationSenderAddress

module keyVault './modules/key-vault.bicep' = {
  name: 'key-vault'
  params: {
    azureCommunicationServiceConnectionString: communication.outputs.communicationServiceConnectionString
    azureServiceBusConnectionString: serviceBus.outputs.connectionString
    azureWebJobsStorageConnectionString: storage.outputs.connectionString
    communicationSenderAddress: resolvedCommunicationSenderAddress
    cosmosDbConnectionString: cosmos.outputs.connectionString
    keyVaultName: names.keyVault
    location: location
    tags: sharedTags
  }
}

module apiFunction './modules/function-app.bicep' = {
  name: 'api-function-app'
  params: {
    appInsightsConnectionString: observability.outputs.applicationInsightsConnectionString
    appName: names.apiFunctionApp
    appSettings: [
      {
        name: 'CosmosDb__DatabaseName'
        value: cosmosDatabaseName
      }
      {
        name: 'CosmosDb__DefaultTimeToLiveSeconds'
        value: string(contactMessageTtlSeconds)
      }
      {
        name: 'CosmosDb__Throughput'
        value: string(cosmosThroughput)
      }
      {
        name: 'Cors__AllowedOrigins__0'
        value: frontend.outputs.origin
      }
      {
        name: 'EntraId__TenantId'
        value: apiEntraTenantId
      }
      {
        name: 'EntraId__Audience'
        value: apiEntraAudience
      }
      {
        name: 'EntraId__OwnerObjectId'
        value: apiEntraOwnerObjectId
      }
      {
        name: 'LoggingOptions__ServiceName'
        value: 'SmartDev.Api.Functions'
      }
    ]
    azureServiceBusConnectionString: serviceBus.outputs.connectionString
    deploymentContainerName: 'api-functions-deployments'
    functionRuntimeVersion: functionRuntimeVersion
    httpPerInstanceConcurrency: apiHttpPerInstanceConcurrency
    instanceMemoryMB: functionInstanceMemoryMB
    location: location
    maximumInstanceCount: apiMaximumInstanceCount
    planName: names.apiServicePlan
    secureAppSettings: {
      CosmosDb__ConnectionString: cosmos.outputs.connectionString
    }
    storageAccountBlobEndpoint: storage.outputs.blobEndpoint
    storageConnectionString: storage.outputs.connectionString
    tags: sharedTags
  }
}

module workerFunction './modules/function-app.bicep' = {
  name: 'worker-function-app'
  params: {
    appInsightsConnectionString: observability.outputs.applicationInsightsConnectionString
    appName: names.workerFunctionApp
    appSettings: [
      {
        name: 'AzureCommunicationService__SenderAddress'
        value: resolvedCommunicationSenderAddress
      }
      {
        name: 'LoggingOptions__ServiceName'
        value: 'SmartDev.Worker.Functions'
      }
    ]
    azureServiceBusConnectionString: serviceBus.outputs.connectionString
    deploymentContainerName: 'worker-functions-deployments'
    functionRuntimeVersion: functionRuntimeVersion
    httpPerInstanceConcurrency: 0
    instanceMemoryMB: functionInstanceMemoryMB
    location: location
    maximumInstanceCount: workerMaximumInstanceCount
    planName: names.workerServicePlan
    secureAppSettings: {
      AzureCommunicationService__ConnectionString: communication.outputs.communicationServiceConnectionString
    }
    storageAccountBlobEndpoint: storage.outputs.blobEndpoint
    storageConnectionString: storage.outputs.connectionString
    tags: sharedTags
  }
}

module dns './modules/dns-zone.bicep' = if (!empty(dnsZoneName)) {
  name: 'dns-zone'
  params: {
    dnsZoneName: names.dnsZone
    tags: sharedTags
  }
}

// ------------------------------------- Outputs -------------------------------------

output apiBaseUrl string = apiFunction.outputs.defaultOrigin
output apiFunctionAppName string = apiFunction.outputs.functionAppName
output applicationInsightsName string = observability.outputs.applicationInsightsName
output communicationServiceName string = communication.outputs.communicationServiceName
output cosmosDbAccountName string = cosmos.outputs.accountName
output dnsZoneName string = dnsZoneName
output keyVaultName string = keyVault.outputs.keyVaultName
output logAnalyticsWorkspaceName string = observability.outputs.logAnalyticsWorkspaceName
output resourceGroupName string = resourceGroup().name
output serviceBusNamespaceName string = serviceBus.outputs.namespaceName
output staticWebAppName string = frontend.outputs.name
output staticWebAppUrl string = frontend.outputs.origin
output storageAccountName string = storage.outputs.storageAccountName
output workerFunctionAppName string = workerFunction.outputs.functionAppName
output githubSecrets object = {
  API_BASE_URL: apiFunction.outputs.defaultOrigin
  API_FUNCTION_APP_NAME: apiFunction.outputs.functionAppName
  ENTRA_API_SCOPE: frontendEntraApiScope
  ENTRA_AUTHORITY: frontendEntraAuthority
  ENTRA_CLIENT_ID: frontendEntraClientId
  RESOURCE_GROUP: resourceGroup().name
  SWA_NAME: frontend.outputs.name
  SWA_RESOURCE_GROUP: resourceGroup().name
  WORKER_FUNCTION_APP_NAME: workerFunction.outputs.functionAppName
}
