@description('Service Bus namespace, queue, and authorization settings.')
param configuration object

@description('Service Bus namespace name.')
param namespaceName string

@description('Tags applied to Service Bus resources.')
param tags object

// ------------------------------------- Resources -------------------------------------

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2024-01-01' = {
  name: namespaceName
  location: configuration.location
  tags: tags
  sku: {
    name: configuration.sku.name
    tier: configuration.sku.tier
  }
  properties: {
    publicNetworkAccess: configuration.publicNetworkAccess
    minimumTlsVersion: configuration.minimumTlsVersion
  }
}

resource contactMessageCreatedQueue 'Microsoft.ServiceBus/namespaces/queues@2024-01-01' existing = {
  name: configuration.queues.contactMessageCreated
  parent: serviceBusNamespace
}

resource contactEmailDeliveryResultQueue 'Microsoft.ServiceBus/namespaces/queues@2024-01-01' existing = {
  name: configuration.queues.contactEmailDeliveryResult
  parent: serviceBusNamespace
}

resource articleNarrationRequestedQueue 'Microsoft.ServiceBus/namespaces/queues@2024-01-01' existing = {
  name: configuration.queues.articleNarrationRequested
  parent: serviceBusNamespace
}

resource functionAppsAuthorizationRule 'Microsoft.ServiceBus/namespaces/authorizationRules@2024-01-01' = {
  name: configuration.authorizationRule.name
  parent: serviceBusNamespace
  properties: {
    rights: configuration.authorizationRule.rights
  }
}

// ------------------------------------- Outputs -------------------------------------

@secure()
output connectionString string = functionAppsAuthorizationRule.listKeys().primaryConnectionString
output namespaceName string = serviceBusNamespace.name
output queueNames array = [
  contactMessageCreatedQueue.name
  contactEmailDeliveryResultQueue.name
  articleNarrationRequestedQueue.name
]
