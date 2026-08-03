variable "subscription_id" {
  description = "Azure subscription id that owns the production resources."
  type        = string
}

variable "location" {
  description = "Azure region for the production resources."
  type        = string
  default     = "australiaeast"
}

variable "resource_group_name" {
  description = "Production resource group name."
  type        = string
  default     = "SmartDevApp"
}

variable "cosmos_account_name" {
  description = "Production Cosmos DB account name."
  type        = string
  default     = "smartdevapp-cdb"
}

variable "cosmos_database_name" {
  description = "Cosmos DB SQL database used by the API."
  type        = string
  default     = "smartdev"
}

variable "contact_messages_container_name" {
  description = "Cosmos DB SQL container used for contact message documents."
  type        = string
  default     = "contact-messages"
}

variable "contact_messages_partition_key_path" {
  description = "Partition key path used by contact message documents."
  type        = string
  default     = "/partitionKey"
}

variable "cosmos_throughput" {
  description = "Shared Cosmos DB database throughput."
  type        = number
  default     = 1000
}

variable "contact_messages_default_ttl_seconds" {
  description = "Default TTL for contact message documents."
  type        = number
  default     = 86400
}
