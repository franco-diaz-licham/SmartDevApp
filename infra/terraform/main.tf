resource "azurerm_resource_group" "production" {
  name     = var.resource_group_name
  location = var.location
}

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
