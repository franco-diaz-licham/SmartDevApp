// ------------------------------------- Parameters -------------------------------------

@description('Azure AI Speech resource settings.')
param configuration object

@description('Azure AI Speech account name.')
param accountName string

@description('Tags applied to the Speech resource.')
param tags object

// ------------------------------------- Resources -------------------------------------

resource speechAccount 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: accountName
  location: configuration.location
  tags: tags
  kind: configuration.kind
  sku: {
    name: configuration.sku.name
  }
  properties: {
    customSubDomainName: configuration.customSubDomainName
    publicNetworkAccess: configuration.publicNetworkAccess
  }
}

// ------------------------------------- Outputs -------------------------------------

output accountName string = speechAccount.name
output endpoint string = speechAccount.properties.endpoint
@secure()
output subscriptionKey string = speechAccount.listKeys().key1
