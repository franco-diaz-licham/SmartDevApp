# SmartDevApp Terraform

This is the first, simple Terraform setup for the single production environment.

It currently manages:

- Resource group: `SmartDevApp`
- Cosmos DB account: `smartdevapp-cdb`
- Cosmos SQL database: `smartdev`
- Cosmos SQL container: `contact-messages`

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
cd infra/terraform
terraform init
terraform plan
```

## Import Existing Azure Resources

The Cosmos account already exists in Azure. Terraform needs to import existing resources before it can manage them.

Run these from `infra/terraform`:

```powershell
terraform import azurerm_resource_group.production /subscriptions/<your-subscription-id>/resourceGroups/SmartDevApp

terraform import azurerm_cosmosdb_account.main /subscriptions/<your-subscription-id>/resourceGroups/SmartDevApp/providers/Microsoft.DocumentDB/databaseAccounts/smartdevapp-cdb
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

## App Setting

The API uses `CosmosDb__ConnectionString`. To print the Terraform output:

```powershell
terraform output -raw cosmos_connection_string
```
