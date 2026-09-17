@description('Key Vault and secret settings.')
param configuration object

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

@description('Azure Speech subscription key stored as a Key Vault secret.')
@secure()
param azureSpeechSubscriptionKey string

@description('Contact email sender address stored as a Key Vault secret.')
param communicationSenderAddress string

@description('Principal ID that can read Key Vault secrets.')
param keyVaultReaderPrincipalId string

@description('Tags applied to Key Vault resources.')
param tags object

// ------------------------------------- Variables -------------------------------------

// Key Vault Secrets User
var keyVaultSecretsUserRoleDefinitionId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')

// ------------------------------------- Resources -------------------------------------

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: configuration.location
  tags: tags
  properties: {
    accessPolicies: configuration.accessPolicies
    enableRbacAuthorization: configuration.enableRbacAuthorization
    enableSoftDelete: configuration.enableSoftDelete
    enabledForTemplateDeployment: configuration.enabledForTemplateDeployment
    publicNetworkAccess: configuration.publicNetworkAccess
    sku: {
      family: configuration.sku.family
      name: configuration.sku.name
    }
    softDeleteRetentionInDays: configuration.softDeleteRetentionInDays
    tenantId: tenant().tenantId
  }
}

resource azureWebJobsStorageSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: configuration.secrets.azureWebJobsStorage
  parent: keyVault
  properties: {
    value: azureWebJobsStorageConnectionString
  }
}

resource azureServiceBusSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: configuration.secrets.azureServiceBus
  parent: keyVault
  properties: {
    value: azureServiceBusConnectionString
  }
}

resource cosmosDbConnectionSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: configuration.secrets.cosmosDbConnectionString
  parent: keyVault
  properties: {
    value: cosmosDbConnectionString
  }
}

resource azureCommunicationServiceConnectionSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: configuration.secrets.azureCommunicationServiceConnectionString
  parent: keyVault
  properties: {
    value: azureCommunicationServiceConnectionString
  }
}

resource azureSpeechSubscriptionKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: configuration.secrets.azureSpeechSubscriptionKey
  parent: keyVault
  properties: {
    value: azureSpeechSubscriptionKey
  }
}

resource communicationSenderAddressSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: configuration.secrets.communicationSenderAddress
  parent: keyVault
  properties: {
    value: communicationSenderAddress
  }
}

resource secretReaderRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, keyVaultReaderPrincipalId, keyVaultSecretsUserRoleDefinitionId)
  scope: keyVault
  properties: {
    principalId: keyVaultReaderPrincipalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: keyVaultSecretsUserRoleDefinitionId
  }
}

// ------------------------------------- Outputs -------------------------------------

output azureCommunicationServiceConnectionSecretUri string = azureCommunicationServiceConnectionSecret.properties.secretUri
output azureServiceBusSecretUri string = azureServiceBusSecret.properties.secretUri
output azureSpeechSubscriptionKeySecretUri string = azureSpeechSubscriptionKeySecret.properties.secretUri
output azureWebJobsStorageSecretUri string = azureWebJobsStorageSecret.properties.secretUri
output communicationSenderAddressSecretUri string = communicationSenderAddressSecret.properties.secretUri
output cosmosDbConnectionSecretUri string = cosmosDbConnectionSecret.properties.secretUri
output keyVaultName string = keyVault.name
