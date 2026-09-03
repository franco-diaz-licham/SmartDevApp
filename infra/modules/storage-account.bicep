// ------------------------------------- Parameters -------------------------------------

@description('Azure region for Storage resources.')
param location string

@description('Storage account name.')
param storageAccountName string

@description('Blob containers used by Azure Functions Flex Consumption deployments.')
param deploymentContainerNames array

@description('Tags applied to Storage resources.')
param tags object

// ------------------------------------- Resources -------------------------------------

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  tags: tags
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  name: 'default'
  parent: storageAccount
  properties: {
    deleteRetentionPolicy: {
      enabled: true
      days: 7
    }
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
  for containerName in deploymentContainerNames: {
    name: containerName
    parent: blobService
    properties: {
      publicAccess: 'None'
    }
  }
]

// ------------------------------------- Outputs -------------------------------------

output blobEndpoint string = storageAccount.properties.primaryEndpoints.blob
@secure()
output connectionString string = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
output deploymentContainerNames array = deploymentContainerNames
output storageAccountName string = storageAccount.name
