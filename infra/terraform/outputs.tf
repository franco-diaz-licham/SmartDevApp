output "resource_group_name" {
  description = "Production resource group name."
  value       = azurerm_resource_group.production.name
}

output "cosmos_account_name" {
  description = "Cosmos DB account name."
  value       = azurerm_cosmosdb_account.main.name
}

output "cosmos_endpoint" {
  description = "Cosmos DB SQL endpoint."
  value       = azurerm_cosmosdb_account.main.endpoint
}

output "cosmos_connection_string" {
  description = "Cosmos DB primary SQL connection string for app configuration."
  value       = azurerm_cosmosdb_account.main.primary_sql_connection_string
  sensitive   = true
}

output "cosmos_database_name" {
  description = "Cosmos DB SQL database name."
  value       = azurerm_cosmosdb_sql_database.smartdev.name
}

output "contact_messages_container_name" {
  description = "Contact messages container name."
  value       = azurerm_cosmosdb_sql_container.contact_messages.name
}
