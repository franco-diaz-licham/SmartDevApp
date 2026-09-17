@description('User-assigned managed identity name.')
param identityName string

@description('Azure region for the managed identity.')
param location string

@description('Tags applied to the managed identity.')
param tags object

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: identityName
  location: location
  tags: tags
}

output clientId string = identity.properties.clientId
output identityName string = identity.name
output principalId string = identity.properties.principalId
output resourceId string = identity.id
