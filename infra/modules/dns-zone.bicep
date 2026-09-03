// ------------------------------------- Parameters -------------------------------------

@description('DNS zone name.')
param dnsZoneName string

@description('Tags applied to the DNS zone.')
param tags object

// ------------------------------------- Resources -------------------------------------

resource dnsZone 'Microsoft.Network/dnsZones@2018-05-01' = {
  name: dnsZoneName
  location: 'global'
  tags: tags
}

// ------------------------------------- Outputs -------------------------------------

output name string = dnsZone.name
output nameServers array = dnsZone.properties.nameServers
