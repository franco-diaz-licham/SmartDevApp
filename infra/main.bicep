targetScope = 'resourceGroup'

// ------------------------------------- Parameters -------------------------------------

@description('Azure region for regional resources.')
param location string

@description('Short workload name used in Azure resource names.')
param workloadName string

@description('Environment label used in Azure resource names and tags.')
param environmentName string

@description('Tags applied to all Azure resources.')
param tags object

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

@description('Override sender address. Leave empty to use the Azure managed email domain default DoNotReply sender.')
param communicationSenderAddress string = ''

@description('Environment configuration for staticWebApp.')
param staticWebAppConfiguration object

@description('Environment configuration for dns.')
param dnsConfiguration object

@description('Environment configuration for communication.')
param communicationConfiguration object

@description('Environment configuration for article speech generation.')
param speechConfiguration object

@description('Environment configuration for cosmos.')
param cosmosConfiguration object

@description('Environment configuration for api.')
param apiFunctionConfiguration object

@description('Environment configuration for worker.')
param workerFunctionConfiguration object

@description('Environment configuration for keyVault.')
param keyVaultConfiguration object

@description('Environment configuration for observability.')
param observabilityConfiguration object

@description('Environment configuration for serviceBus.')
param serviceBusConfiguration object

@description('Environment configuration for storage.')
param storageConfiguration object

@description('Existing Azure resource names. Set these to avoid creating parallel resources.')
param resourceNameConfiguration object

// ------------------------------------- Variables -------------------------------------

var dnsZoneName = dnsConfiguration.zoneName
var speechEnabled = speechConfiguration.enabled
var cosmosDatabaseName = cosmosConfiguration.databaseName
var cosmosThroughput = cosmosConfiguration.throughput
var contactMessageTtlSeconds = cosmosConfiguration.contactMessageTtlSeconds
var observabilityEnabled = observabilityConfiguration.enabled

var sharedTags = union(tags, {
  workload: workloadName
  environment: environmentName
})

var names = {
  apiFunctionApp: resourceNameConfiguration.apiFunctionApp
  apiServicePlan: resourceNameConfiguration.apiServicePlan
  appInsights: resourceNameConfiguration.appInsights
  communicationService: resourceNameConfiguration.communicationService
  cosmosAccount: resourceNameConfiguration.cosmosAccount
  dnsZone: dnsZoneName
  emailService: resourceNameConfiguration.emailService
  keyVault: resourceNameConfiguration.keyVault
  keyVaultReferenceIdentity: resourceNameConfiguration.keyVaultReferenceIdentity
  logAnalyticsWorkspace: resourceNameConfiguration.logAnalyticsWorkspace
  serviceBusNamespace: resourceNameConfiguration.serviceBusNamespace
  speechService: resourceNameConfiguration.speechService
  staticWebApp: resourceNameConfiguration.staticWebApp
  storageAccount: resourceNameConfiguration.storageAccount
  workerFunctionApp: resourceNameConfiguration.workerFunctionApp
  workerServicePlan: resourceNameConfiguration.workerServicePlan
}

// ------------------------------------- Modules -------------------------------------

module frontend './modules/resources/static-web-app.bicep' = {
  name: 'static-web-app'
  params: {
    config: staticWebAppConfiguration
    location: staticWebAppConfiguration.location
    name: names.staticWebApp
    tags: sharedTags
  }
}

module observability './modules/resources/observability.bicep' = if (observabilityEnabled) {
  name: 'observability'
  params: {
    config: observabilityConfiguration
    appInsightsName: names.appInsights
    location: location
    logAnalyticsWorkspaceName: names.logAnalyticsWorkspace
    tags: sharedTags
  }
}

module storage './modules/resources/storage-account.bicep' = {
  name: 'storage-account'
  params: {
    configuration: storageConfiguration
    storageAccountName: names.storageAccount
    tags: sharedTags
  }
}

module serviceBus './modules/resources/service-bus.bicep' = {
  name: 'service-bus'
  params: {
    configuration: serviceBusConfiguration
    namespaceName: names.serviceBusNamespace
    tags: sharedTags
  }
}

module cosmos './modules/resources/cosmos-db.bicep' = {
  name: 'cosmos-db'
  params: {
    accountName: names.cosmosAccount
    configuration: cosmosConfiguration
    location: location
    tags: sharedTags
  }
}

module communication './modules/resources/communication-services.bicep' = {
  name: 'communication-services'
  params: {
    communicationServiceName: names.communicationService
    configuration: communicationConfiguration
    emailServiceName: names.emailService
    tags: sharedTags
  }
}

module speech './modules/resources/speech-service.bicep' = {
  name: 'speech-service'
  params: {
    accountName: names.speechService
    configuration: speechConfiguration
    tags: sharedTags
  }
}

module keyVaultReferenceIdentity './modules/resources/managed-identity.bicep' = {
  name: 'key-vault-reference-identity'
  params: {
    identityName: names.keyVaultReferenceIdentity
    location: location
    tags: sharedTags
  }
}

var resolvedCommunicationSenderAddress = empty(communicationSenderAddress)
  ? 'DoNotReply@${communication.outputs.mailFromSenderDomain}'
  : communicationSenderAddress

module keyVault './modules/resources/key-vault.bicep' = {
  name: 'key-vault'
  params: {
    configuration: keyVaultConfiguration
    azureCommunicationServiceConnectionString: communication.outputs.communicationServiceConnectionString
    azureServiceBusConnectionString: serviceBus.outputs.connectionString
    azureSpeechSubscriptionKey: speech.outputs.subscriptionKey
    azureWebJobsStorageConnectionString: storage.outputs.connectionString
    communicationSenderAddress: resolvedCommunicationSenderAddress
    cosmosDbConnectionString: cosmos.outputs.connectionString
    keyVaultName: names.keyVault
    keyVaultReaderPrincipalId: keyVaultReferenceIdentity.outputs.principalId
    tags: sharedTags
  }
}

module apiFunction './modules/resources/function-app.bicep' = {
  name: 'api-function-app'
  params: {
    appInsightsConnectionString: observabilityEnabled ? observability!.outputs.applicationInsightsConnectionString : ''
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
        value: apiFunctionConfiguration.loggingServiceName
      }
      {
        name: 'ArticleAudioStorage__ContainerName'
        value: storage.outputs.articleAudioContainerName
      }
    ]
    azureServiceBusConnectionString: serviceBus.outputs.connectionString
    configuration: apiFunctionConfiguration
    corsAllowedOrigins: [
      frontend.outputs.origin
    ]
    keyVaultReferenceIdentityResourceId: keyVaultReferenceIdentity.outputs.resourceId
    planName: names.apiServicePlan
    secureAppSettings: {
      CosmosDb__ConnectionString: '@Microsoft.KeyVault(SecretUri=${keyVault.outputs.cosmosDbConnectionSecretUri})'
    }
    storageAccountBlobEndpoint: storage.outputs.blobEndpoint
    storageConnectionString: storage.outputs.connectionString
    tags: sharedTags
    userAssignedIdentityResourceId: keyVaultReferenceIdentity.outputs.resourceId
  }
}

module workerFunction './modules/resources/function-app.bicep' = {
  name: 'worker-function-app'
  params: {
    appInsightsConnectionString: observabilityEnabled ? observability!.outputs.applicationInsightsConnectionString : ''
    appName: names.workerFunctionApp
    appSettings: [
      {
        name: 'AzureCommunicationService__SenderAddress'
        value: resolvedCommunicationSenderAddress
      }
      {
        name: 'LoggingOptions__ServiceName'
        value: workerFunctionConfiguration.loggingServiceName
      }
      {
        name: 'AzureSpeech__Enabled'
        value: string(speechEnabled)
      }
      {
        name: 'AzureSpeech__Region'
        value: speechEnabled ? speechConfiguration.location : ''
      }
      {
        name: 'AzureSpeech__VoiceName'
        value: speechEnabled ? speechConfiguration.voiceName : ''
      }
      {
        name: 'ArticleAudioStorage__ContainerName'
        value: storage.outputs.articleAudioContainerName
      }
    ]
    azureServiceBusConnectionString: serviceBus.outputs.connectionString
    configuration: workerFunctionConfiguration
    keyVaultReferenceIdentityResourceId: keyVaultReferenceIdentity.outputs.resourceId
    planName: names.workerServicePlan
    secureAppSettings: {
      AzureCommunicationService__ConnectionString: '@Microsoft.KeyVault(SecretUri=${keyVault.outputs.azureCommunicationServiceConnectionSecretUri})'
      AzureSpeech__SubscriptionKey: '@Microsoft.KeyVault(SecretUri=${keyVault.outputs.azureSpeechSubscriptionKeySecretUri})'
    }
    storageAccountBlobEndpoint: storage.outputs.blobEndpoint
    storageConnectionString: storage.outputs.connectionString
    tags: sharedTags
    userAssignedIdentityResourceId: keyVaultReferenceIdentity.outputs.resourceId
  }
}

module dns './modules/resources/dns-zone.bicep' = if (!empty(dnsZoneName)) {
  name: 'dns-zone'
  params: {
    dnsZoneName: names.dnsZone
    tags: sharedTags
  }
}

// ------------------------------------- Outputs -------------------------------------

output apiBaseUrl string = apiFunction.outputs.defaultOrigin
output apiFunctionAppName string = apiFunction.outputs.functionAppName
output applicationInsightsName string = observabilityEnabled ? observability!.outputs.applicationInsightsName : ''
output communicationServiceName string = communication.outputs.communicationServiceName
output cosmosDbAccountName string = cosmos.outputs.accountName
output dnsZoneName string = dnsZoneName
output keyVaultName string = keyVault.outputs.keyVaultName
output keyVaultReferenceIdentityName string = keyVaultReferenceIdentity.outputs.identityName
output logAnalyticsWorkspaceName string = observabilityEnabled ? observability!.outputs.logAnalyticsWorkspaceName : ''
output resourceGroupName string = resourceGroup().name
output serviceBusNamespaceName string = serviceBus.outputs.namespaceName
output speechServiceName string = speech.outputs.accountName
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
