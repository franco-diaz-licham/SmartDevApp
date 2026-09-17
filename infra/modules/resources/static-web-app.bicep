@description('Environment-specific resource sizing, retention and SKU configuration.')
param config object

// ------------------------------------- Parameters -------------------------------------

@description('Azure region for Static Web Apps.')
param location string

@description('Static Web App name.')
param name string

@description('Tags applied to the Static Web App.')
param tags object

// ------------------------------------- Resources -------------------------------------

resource staticWebApp 'Microsoft.Web/staticSites@2025-03-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: config.sku.name
    tier: config.sku.tier
  }
  properties: {}
}

// ------------------------------------- Outputs -------------------------------------

output defaultHostname string = staticWebApp.properties.defaultHostname
output name string = staticWebApp.name
output origin string = 'https://${staticWebApp.properties.defaultHostname}'
