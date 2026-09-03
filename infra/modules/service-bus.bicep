// ------------------------------------- Parameters -------------------------------------

@description('Azure region for Service Bus.')
param location string

@description('Service Bus namespace name.')
param namespaceName string

@description('Tags applied to Service Bus resources.')
param tags object

// ------------------------------------- Resources -------------------------------------

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2024-01-01' = {
  name: namespaceName
  location: location
  tags: tags
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    publicNetworkAccess: 'Enabled'
    minimumTlsVersion: '1.2'
  }
}

var queueDefaults = {
  deadLetteringOnMessageExpiration: true
  defaultMessageTimeToLive: 'PT1H'
  duplicateDetectionHistoryTimeWindow: 'PT5M'
  enableBatchedOperations: true
  enablePartitioning: false
  lockDuration: 'PT1M'
  maxDeliveryCount: 5
  requiresDuplicateDetection: true
  requiresSession: false
}

resource contactMessageCreatedQueue 'Microsoft.ServiceBus/namespaces/queues@2024-01-01' = {
  name: 'contact-message-created'
  parent: serviceBusNamespace
  properties: queueDefaults
}

resource contactEmailDeliveryResultQueue 'Microsoft.ServiceBus/namespaces/queues@2024-01-01' = {
  name: 'contact-email-delivery-result'
  parent: serviceBusNamespace
  properties: queueDefaults
}

resource functionAppsAuthorizationRule 'Microsoft.ServiceBus/namespaces/authorizationRules@2024-01-01' = {
  name: 'SmartDevFunctionApps'
  parent: serviceBusNamespace
  properties: {
    rights: [
      'Listen'
      'Send'
    ]
  }
}

// ------------------------------------- Outputs -------------------------------------

@secure()
output connectionString string = functionAppsAuthorizationRule.listKeys().primaryConnectionString
output namespaceName string = serviceBusNamespace.name
output queueNames array = [
  contactMessageCreatedQueue.name
  contactEmailDeliveryResultQueue.name
]
