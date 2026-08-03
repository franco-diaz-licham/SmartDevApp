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

variable "application_insights_name" {
  description = "Existing Application Insights resource used by the Function Apps."
  type        = string
  default     = "smartdevapp-ai"
}

variable "api_function_app_name" {
  description = "Production API Function App name."
  type        = string
  default     = "smartdevapp-api-af"
}

variable "api_service_plan_name" {
  description = "Production API Flex Consumption service plan name."
  type        = string
  default     = "ASP-SmartDevApp-a0fb"
}

variable "worker_function_app_name" {
  description = "Production Worker Function App name."
  type        = string
  default     = "smartdevapp-worker-af"
}

variable "worker_service_plan_name" {
  description = "Production Worker Flex Consumption service plan name."
  type        = string
  default     = "ASP-SmartDevApp-91b9"
}

variable "function_deployment_storage_account_name" {
  description = "Storage account used by Flex Consumption Function App package deployment."
  type        = string
  default     = "smartdevappsa"
}

variable "api_deployment_container_name" {
  description = "Blob container used by the API Function App package deployment."
  type        = string
  default     = "app-package-smartdevapp-api-af-7983b6a"
}

variable "worker_deployment_container_name" {
  description = "Blob container used by the Worker Function App package deployment."
  type        = string
  default     = "app-package-smartdevapp-worker-af-62d2b21"
}

variable "api_maximum_instance_count" {
  description = "Maximum API Function App instance count."
  type        = number
  default     = 1
}

variable "api_instance_memory_mb" {
  description = "API Function App instance memory in MB."
  type        = number
  default     = 512
}

variable "worker_maximum_instance_count" {
  description = "Maximum Worker Function App instance count."
  type        = number
  default     = 1
}

variable "worker_instance_memory_mb" {
  description = "Worker Function App instance memory in MB."
  type        = number
  default     = 512
}

variable "api_always_ready_http_instance_count" {
  description = "Always ready instance count for API HTTP triggers."
  type        = number
  default     = 1
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
