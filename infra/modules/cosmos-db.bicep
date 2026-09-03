// ------------------------------------- Parameters -------------------------------------

@description('Azure region for Cosmos DB.')
param location string

@description('Cosmos DB account name.')
param accountName string

@description('Cosmos DB SQL database name.')
param databaseName string

@description('Cosmos DB database shared throughput.')
@minValue(400)
param throughput int

@description('Default TTL in seconds for the contact-messages container.')
@minValue(60)
param contactMessageTtlSeconds int

@description('Tags applied to Cosmos DB resources.')
param tags object

// ------------------------------------- Resources -------------------------------------

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' = {
  name: accountName
  location: location
  tags: tags
  kind: 'GlobalDocumentDB'
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    databaseAccountOfferType: 'Standard'
    enableAutomaticFailover: false
    enableFreeTier: false
    locations: [
      {
        failoverPriority: 0
        isZoneRedundant: false
        locationName: location
      }
    ]
    publicNetworkAccess: 'Enabled'
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2024-05-15' = {
  name: databaseName
  parent: cosmosAccount
  properties: {
    options: {
      throughput: throughput
    }
    resource: {
      id: databaseName
    }
  }
}

resource contactMessagesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-05-15' = {
  name: 'contact-messages'
  parent: database
  properties: {
    options: {}
    resource: {
      defaultTtl: contactMessageTtlSeconds
      id: 'contact-messages'
      partitionKey: {
        kind: 'Hash'
        paths: [
          '/partitionKey'
        ]
      }
    }
  }
}

resource articlesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-05-15' = {
  name: 'articles'
  parent: database
  properties: {
    options: {}
    resource: {
      id: 'articles'
      partitionKey: {
        kind: 'Hash'
        paths: [
          '/visibility'
        ]
      }
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
