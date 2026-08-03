# SmartDevApp Terraform

This is the first, simple Terraform setup for the single production environment.

It currently manages:

- Resource group: `SmartDevApp`
- Cosmos DB account: `smartdevapp-cdb`
- Cosmos SQL database: `smartdev`
- Cosmos SQL container: `contact-messages`
- API Flex Consumption service plan: `ASP-SmartDevApp-a0fb`
- API Function App: `smartdevapp-api-af`
- Function deployment storage account: `smartdevappsa`
- API deployment package container

It reads this existing resource:

- Application Insights: `smartdevapp-ai`

## Prerequisites

- Terraform installed
- Azure CLI installed
- Logged in with Azure CLI:

```powershell
az login
az account set --subscription <your-subscription-id>
```

Create a local `terraform.tfvars` file for your real subscription id. This file is ignored by Git.

```powershell
Copy-Item terraform.tfvars.example terraform.tfvars
```

## First Run

From this folder:

```powershell
cd infra
terraform init
terraform plan
```

## Import Existing Azure Resources

The Cosmos account already exists in Azure. Terraform needs to import existing resources before it can manage them.

Run these from `infra`:

```powershell
terraform import azurerm_resource_group.production /subscriptions/<your-subscription-id>/resourceGroups/SmartDevApp

terraform import azurerm_cosmosdb_account.main /subscriptions/<your-subscription-id>/resourceGroups/SmartDevApp/providers/Microsoft.DocumentDB/databaseAccounts/smartdevapp-cdb

terraform import azurerm_storage_account.function_deployment /subscriptions/<your-subscription-id>/resourceGroups/SmartDevApp/providers/Microsoft.Storage/storageAccounts/smartdevappsa

terraform import azurerm_storage_container.api_deployment_package https://smartdevappsa.blob.core.windows.net/app-package-smartdevapp-api-af-7983b6a

terraform import azurerm_service_plan.api /subscriptions/<your-subscription-id>/resourceGroups/SmartDevApp/providers/Microsoft.Web/serverfarms/ASP-SmartDevApp-a0fb

terraform import azurerm_function_app_flex_consumption.api /subscriptions/<your-subscription-id>/resourceGroups/SmartDevApp/providers/Microsoft.Web/sites/smartdevapp-api-af
```

If the database or container already exist, import them too:

```powershell
terraform import azurerm_cosmosdb_sql_database.smartdev /subscriptions/<your-subscription-id>/resourceGroups/SmartDevApp/providers/Microsoft.DocumentDB/databaseAccounts/smartdevapp-cdb/sqlDatabases/smartdev

terraform import azurerm_cosmosdb_sql_container.contact_messages /subscriptions/<your-subscription-id>/resourceGroups/SmartDevApp/providers/Microsoft.DocumentDB/databaseAccounts/smartdevapp-cdb/sqlDatabases/smartdev/containers/contact-messages
```

After imports:

```powershell
terraform plan
terraform apply
```

## App Settings

App settings are intentionally not managed in this starter Terraform setup because they often contain secrets.

The API uses `CosmosDb__ConnectionString`. To print the Terraform output when you need the value locally:

```powershell
terraform output -raw cosmos_connection_string
```
