# Azure Infrastructure

This folder provisions the Azure resources used by the production-shaped SmartDevApp deployment:

- Azure Static Web Apps for the React/Vite frontend.
- Two Azure Functions Flex Consumption apps: API and worker.
- Two Flex Consumption App Service plans, one per Function App.
- Azure Storage for the Functions runtime and Flex deployment containers.
- Azure Cosmos DB SQL API database and containers for articles and contact messages.
- Azure Service Bus namespace with the `contact-message-created` and `contact-email-delivery-result` queues.
- Azure Communication Services, Email Communication Service, and an Azure managed email domain.
- Application Insights connected to Log Analytics.
- Key Vault containing generated runtime connection strings.
- Optional Azure DNS zone for `smartdev.com.au`.

Regional resources default to `australiaeast`. Static Web Apps defaults to `eastasia`, matching the existing SmartDevApp resource shape.

`main.bicep` is intentionally thin. It owns parameters, naming, and wiring between modules. Product-specific resources live under `modules/`.

## Deploy

Create `infra/.env` from `infra/.env.example` and set the environment values:

```dotenv
AZURE_SUBSCRIPTION=<subscription-id-or-name>
AZURE_RESOURCE_GROUP_NAME=rg-smartdevapp-prod
AZURE_RESOURCE_GROUP_LOCATION=australiaeast
AZURE_DEPLOYMENT_NAME=smartdevapp-infra
AZURE_TEMPLATE_FILE=infra/main.bicep
AZURE_PARAMETERS_FILE=infra/main.parameters.prod.json
API_ENTRA_TENANT_ID=<tenant-id>
API_ENTRA_AUDIENCE=<api-application-id-uri-or-client-id>
API_ENTRA_OWNER_OBJECT_ID=<owner-user-object-id>
FRONTEND_ENTRA_CLIENT_ID=<frontend-app-client-id>
FRONTEND_ENTRA_AUTHORITY=<frontend-authority-url>
FRONTEND_ENTRA_API_SCOPE=<api-scope>
COMMUNICATION_SENDER_ADDRESS=
AZURE_SKIP_WHAT_IF=false
AZURE_WHAT_IF_ONLY=false
```

Run the provisioning script from the repository root:

```powershell
./scripts/provision-infra.ps1
```

Useful variants:

```powershell
./scripts/provision-infra.ps1 -Subscription "<subscription-id-or-name>"
./scripts/provision-infra.ps1 -WhatIfOnly
./scripts/provision-infra.ps1 -SkipWhatIf
```

The script creates the resource group, merges committed Bicep parameters with local `.env` values, deploys `main.bicep`, and prints the GitHub secrets needed by the existing workflows.

## Parameters And Secrets

Normal infrastructure values live in `main.parameters.prod.json`. Runtime identity values live in ignored `infra/.env` so they can differ between environments without editing the committed parameters.

The Azure managed email domain generates a sender domain. Leave `COMMUNICATION_SENDER_ADDRESS` blank to configure the worker with `DoNotReply@<generated-domain>.azurecomm.net`. Set it only after a custom sender address is verified.

## GitHub Secrets

After deployment, map the `githubSecrets` output to repository secrets:

- `API_BASE_URL`
- `API_FUNCTION_APP_NAME`
- `ENTRA_API_SCOPE`
- `ENTRA_AUTHORITY`
- `ENTRA_CLIENT_ID`
- `RESOURCE_GROUP`
- `SWA_NAME`
- `SWA_RESOURCE_GROUP`
- `WORKER_FUNCTION_APP_NAME`

`AZURE_CREDENTIALS` and `PRIMEREACT_LICENSE_KEY` still come from your existing service-principal and license setup.

## Deprovision

To delete the Azure environment, run:

```powershell
./scripts/deprovision-infra.ps1
```

The script reads the subscription and resource group from `infra/.env`, lists the resources that will be deleted, and asks you to type the resource group name before deletion.

To skip the confirmation prompt or run asynchronously:

```powershell
./scripts/deprovision-infra.ps1 -Force
./scripts/deprovision-infra.ps1 -Force -NoWait
```

## Notes

The DNS zone is provisioned, but Static Web Apps custom-domain validation and registrar name-server changes remain explicit operational steps. Azure managed email domains are quick to provision and do not require domain verification, but they have limited sending volume and use an Azure-managed sender domain.
