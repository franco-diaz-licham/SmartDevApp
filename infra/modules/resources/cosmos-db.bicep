// ------------------------------------- Parameters -------------------------------------

@description('Azure region for Cosmos DB.')
param location string

@description('Cosmos DB account, database, and container settings.')
param configuration object

@description('Cosmos DB account name.')
param accountName string

@description('Tags applied to Cosmos DB resources.')
param tags object

// ------------------------------------- Resources -------------------------------------

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' = {
  name: accountName
  location: location
  tags: tags
  kind: configuration.kind
  properties: {
    consistencyPolicy: configuration.consistencyPolicy
    databaseAccountOfferType: configuration.databaseAccountOfferType
    enableAutomaticFailover: configuration.enableAutomaticFailover
    enableFreeTier: configuration.enableFreeTier
    capabilities: configuration.serverless ? configuration.serverlessCapabilities : []
    locations: configuration.locations
    publicNetworkAccess: configuration.publicNetworkAccess
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2024-05-15' = {
  name: configuration.databaseName
  parent: cosmosAccount
  properties: {
    options: configuration.serverless ? {} : {
      throughput: configuration.throughput
    }
    resource: {
      id: configuration.databaseName
    }
  }
}

resource contactMessagesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-05-15' = {
  name: configuration.containers.contactMessages.name
  parent: database
  properties: {
    options: {}
    resource: {
      defaultTtl: configuration.containers.contactMessages.defaultTtl
      id: configuration.containers.contactMessages.name
      partitionKey: configuration.containers.contactMessages.partitionKey
    }
  }
}

resource articlesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-05-15' = {
  name: configuration.containers.articles.name
  parent: database
  properties: {
    options: {}
    resource: {
      id: configuration.containers.articles.name
      partitionKey: configuration.containers.articles.partitionKey
    }
  }
}

// ------------------------------------- Outputs -------------------------------------

output accountName string = cosmosAccount.name
@secure()
output connectionString string = cosmosAccount.listConnectionStrings().connectionStrings[0].connectionString
output databaseName string = database.name
output containerNames array = [
  contactMessagesContainer.name
  articlesContainer.name
]
