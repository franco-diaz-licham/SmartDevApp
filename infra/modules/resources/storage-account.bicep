@description('Storage account, service, retention, and container settings.')
param configuration object

@description('Storage account name.')
param storageAccountName string

@description('Tags applied to Storage resources.')
param tags object

// ------------------------------------- Resources -------------------------------------

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: configuration.location
  tags: tags
  kind: configuration.kind
  sku: {
    name: configuration.skuName
  }
  properties: {
    accessTier: configuration.accessTier
    allowBlobPublicAccess: configuration.allowBlobPublicAccess
    minimumTlsVersion: configuration.minimumTlsVersion
    supportsHttpsTrafficOnly: configuration.supportsHttpsTrafficOnly
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  name: 'default'
  parent: storageAccount
  properties: {
    deleteRetentionPolicy: configuration.blobDeleteRetentionPolicy
    containerDeleteRetentionPolicy: configuration.containerDeleteRetentionPolicy
  }
}

resource queueService 'Microsoft.Storage/storageAccounts/queueServices@2023-05-01' = {
  name: 'default'
  parent: storageAccount
}

resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2023-05-01' = {
  name: 'default'
  parent: storageAccount
}

resource deploymentContainers 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = [
  for containerName in configuration.deploymentContainerNames: {
    name: containerName
    parent: blobService
    properties: {
      publicAccess: configuration.containerPublicAccess
    }
  }
]

resource articleAudioContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  name: configuration.articleAudioContainerName
  parent: blobService
  properties: {
    publicAccess: configuration.containerPublicAccess
  }
}

// ------------------------------------- Outputs -------------------------------------

output blobEndpoint string = storageAccount.properties.primaryEndpoints.blob
@secure()
output connectionString string = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
output deploymentContainerNames array = configuration.deploymentContainerNames
output articleAudioContainerName string = articleAudioContainer.name
output storageAccountName string = storageAccount.name
