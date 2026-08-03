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

output "api_function_app_name" {
  description = "API Function App name."
  value       = azurerm_function_app_flex_consumption.api.name
}

output "api_function_app_default_hostname" {
  description = "API Function App default hostname."
  value       = azurerm_function_app_flex_consumption.api.default_hostname
}

output "worker_function_app_name" {
  description = "Worker Function App name."
  value       = azurerm_function_app_flex_consumption.worker.name
}

output "worker_function_app_default_hostname" {
  description = "Worker Function App default hostname."
  value       = azurerm_function_app_flex_consumption.worker.default_hostname
}

output "function_deployment_storage_account_name" {
  description = "Function deployment storage account name."
  value       = azurerm_storage_account.function_deployment.name
}
