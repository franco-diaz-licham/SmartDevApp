// ------------------------------------- Parameters -------------------------------------

@description('Azure region for Key Vault.')
param location string

@description('Key Vault name.')
param keyVaultName string

@description('AzureWebJobsStorage connection string stored as a Key Vault secret.')
@secure()
param azureWebJobsStorageConnectionString string

@description('Service Bus connection string stored as a Key Vault secret.')
@secure()
param azureServiceBusConnectionString string

@description('Cosmos DB connection string stored as a Key Vault secret.')
@secure()
param cosmosDbConnectionString string

@description('Azure Communication Services connection string stored as a Key Vault secret.')
@secure()
param azureCommunicationServiceConnectionString string

@description('Contact email sender address stored as a Key Vault secret.')
param communicationSenderAddress string

@description('Tags applied to Key Vault resources.')
param tags object

// ------------------------------------- Resources -------------------------------------

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    accessPolicies: []
    enableRbacAuthorization: true
    enableSoftDelete: true
    enabledForTemplateDeployment: true
    publicNetworkAccess: 'Enabled'
    sku: {
      family: 'A'
      name: 'standard'
    }
    softDeleteRetentionInDays: 7
    tenantId: tenant().tenantId
  }
}

resource azureWebJobsStorageSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'AzureWebJobsStorage'
  parent: keyVault
  properties: {
    value: azureWebJobsStorageConnectionString
  }
}

resource azureServiceBusSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'AzureServiceBus'
  parent: keyVault
  properties: {
    value: azureServiceBusConnectionString
  }
}

resource cosmosDbConnectionSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'CosmosDbConnectionString'
  parent: keyVault
  properties: {
    value: cosmosDbConnectionString
  }
}

resource azureCommunicationServiceConnectionSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'AzureCommunicationServiceConnectionString'
  parent: keyVault
  properties: {
    value: azureCommunicationServiceConnectionString
  }
}

resource communicationSenderAddressSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'AzureCommunicationServiceSenderAddress'
  parent: keyVault
  properties: {
    value: communicationSenderAddress
  }
}

// ------------------------------------- Outputs -------------------------------------

output azureCommunicationServiceConnectionSecretUri string = azureCommunicationServiceConnectionSecret.properties.secretUri
output azureServiceBusSecretUri string = azureServiceBusSecret.properties.secretUri
output azureWebJobsStorageSecretUri string = azureWebJobsStorageSecret.properties.secretUri
output communicationSenderAddressSecretUri string = communicationSenderAddressSecret.properties.secretUri
output cosmosDbConnectionSecretUri string = cosmosDbConnectionSecret.properties.secretUri
output keyVaultName string = keyVault.name
