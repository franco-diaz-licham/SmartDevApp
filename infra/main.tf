## Core production resource group

resource "azurerm_resource_group" "production" {
  name     = var.resource_group_name
  location = var.location
}

## Existing observability resource

data "azurerm_application_insights" "main" {
  name                = var.application_insights_name
  resource_group_name = azurerm_resource_group.production.name
}

## Function App deployment storage

resource "azurerm_storage_account" "function_deployment" {
  name                     = var.function_deployment_storage_account_name
  resource_group_name      = azurerm_resource_group.production.name
  location                 = azurerm_resource_group.production.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "api_deployment_package" {
  name                  = var.api_deployment_container_name
  storage_account_id    = azurerm_storage_account.function_deployment.id
  container_access_type = "private"
}

## API Function App hosting plan

resource "azurerm_service_plan" "api" {
  name                = var.api_service_plan_name
  resource_group_name = azurerm_resource_group.production.name
  location            = azurerm_resource_group.production.location
  os_type             = "Linux"
  sku_name            = "FC1"
}

## Cosmos DB account

resource "azurerm_cosmosdb_account" "main" {
  name                = var.cosmos_account_name
  location            = azurerm_resource_group.production.location
  resource_group_name = azurerm_resource_group.production.name

  offer_type = "Standard"
  kind       = "GlobalDocumentDB"

  automatic_failover_enabled            = true
  free_tier_enabled                     = true
  local_authentication_enabled          = true
  minimal_tls_version                   = "Tls12"
  multiple_write_locations_enabled      = false
  public_network_access_enabled         = true
  partition_merge_enabled               = false
  burst_capacity_enabled                = false
  analytical_storage_enabled            = false
  access_key_metadata_writes_enabled    = true
  network_acl_bypass_for_azure_services = false

  consistency_policy {
    consistency_level       = "Session"
    max_interval_in_seconds = 5
    max_staleness_prefix    = 100
  }

  geo_location {
    location          = azurerm_resource_group.production.location
    failover_priority = 0
    zone_redundant    = false
  }

  backup {
    type                = "Periodic"
    interval_in_minutes = 240
    retention_in_hours  = 8
    storage_redundancy  = "Geo"
  }

  capacity {
    total_throughput_limit = 1000
  }

  tags = {
    defaultExperience       = "Core (SQL)"
    hidden-workload-type    = "Learning"
    hidden-cosmos-mmspecial = ""
  }
}

## Cosmos DB database and containers

resource "azurerm_cosmosdb_sql_database" "smartdev" {
  name                = var.cosmos_database_name
  resource_group_name = azurerm_resource_group.production.name
  account_name        = azurerm_cosmosdb_account.main.name
  throughput          = var.cosmos_throughput
}

resource "azurerm_cosmosdb_sql_container" "contact_messages" {
  name                = var.contact_messages_container_name
  resource_group_name = azurerm_resource_group.production.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.smartdev.name

  partition_key_paths   = [var.contact_messages_partition_key_path]
  partition_key_version = 2
  default_ttl           = var.contact_messages_default_ttl_seconds
}

## API Function App

resource "azurerm_function_app_flex_consumption" "api" {
  name                = var.api_function_app_name
  resource_group_name = azurerm_resource_group.production.name
  location            = azurerm_resource_group.production.location
  service_plan_id     = azurerm_service_plan.api.id

  storage_container_type      = "blobContainer"
  storage_container_endpoint  = "${azurerm_storage_account.function_deployment.primary_blob_endpoint}${azurerm_storage_container.api_deployment_package.name}"
  storage_authentication_type = "StorageAccountConnectionString"
  storage_access_key          = azurerm_storage_account.function_deployment.primary_access_key

  runtime_name           = "dotnet-isolated"
  runtime_version        = "10.0"
  maximum_instance_count = var.api_maximum_instance_count
  instance_memory_in_mb  = var.api_instance_memory_mb

  always_ready {
    name           = "http"
    instance_count = var.api_always_ready_http_instance_count
  }

  identity {
    type = "SystemAssigned"
  }

  site_config {
    application_insights_connection_string = data.azurerm_application_insights.main.connection_string
  }

  lifecycle {
    ignore_changes = [
      app_settings
    ]
  }
}
