// ------------------------------------- Parameters -------------------------------------

@description('Communication Services and Email Communication settings.')
param configuration object

@description('Communication Services resource name.')
param communicationServiceName string

@description('Email Communication Service resource name.')
param emailServiceName string

@description('Tags applied to Communication resources.')
param tags object

// ------------------------------------- Resources -------------------------------------

resource emailService 'Microsoft.Communication/emailServices@2025-05-01' = {
  name: emailServiceName
  location: configuration.location
  tags: tags
  properties: {
    dataLocation: configuration.dataLocation
  }
}

resource azureManagedDomain 'Microsoft.Communication/emailServices/domains@2025-05-01' = {
  name: configuration.managedDomainName
  parent: emailService
  location: configuration.location
  tags: tags
  properties: {
    domainManagement: configuration.domainManagement
    userEngagementTracking: configuration.userEngagementTracking
  }
}

resource communicationService 'Microsoft.Communication/communicationServices@2025-05-01' = {
  name: communicationServiceName
  location: configuration.location
  tags: tags
  properties: {
    dataLocation: configuration.dataLocation
    linkedDomains: [
      azureManagedDomain.id
    ]
    publicNetworkAccess: configuration.publicNetworkAccess
  }
}

// ------------------------------------- Outputs -------------------------------------

@secure()
output communicationServiceConnectionString string = communicationService.listKeys().primaryConnectionString
output communicationServiceName string = communicationService.name
output emailDomainName string = azureManagedDomain.name
output emailServiceName string = emailService.name
output mailFromSenderDomain string = azureManagedDomain.properties.mailFromSenderDomain
