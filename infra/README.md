# SmartDevApp Azure infrastructure

The Bicep deployment provisions the implemented SmartDevApp workloads as a cost-capped development environment:

- SmartDev API on Azure Functions Flex Consumption
- SmartDev worker on Azure Functions Flex Consumption
- SmartDev frontend on Azure Static Web Apps
- Cosmos DB, Service Bus, Storage, Communication Services, Key Vault, DNS, and optional observability required by those workloads

`main.bicep` is the infrastructure composition root. It invokes every module and owns the dependencies between them. Resource modules live in the flat `modules/resources/` directory and do not call other modules:

```text
infra/
|-- main.bicep
|-- main.parameters.dev.json
`-- modules/
    `-- resources/
        `-- *.bicep
```

Environment-specific resource settings live in `main.parameters.dev.json`, grouped by resource boundary. This includes names, regions, SKUs, runtime versions, scale limits, storage retention, Cosmos containers, Service Bus queues, and feature toggles. `main.bicep` passes each configuration object to its resource module. The modules retain resource relationships, generated secrets, and fixed application contracts.

Configure the repository-root, Git-ignored `.env` file, then deploy. Command-line scripts read their configuration from this file and do not accept configuration overrides:

```powershell
./scripts/provision-infra.ps1
```

Repository file paths, Azure deployment settings, existing Entra application inputs, and optional sender settings are configured in that single file. Azure resource shape stays in `infra/main.parameters.dev.json`.

Use this root `.env` shape:

```dotenv
# SmartDevApp configuration.
# This is the repository's only .env file and it must remain outside source control.

# ------------------------------------------------------------------------------
# Azure infrastructure deployment
# ------------------------------------------------------------------------------
# These values identify the subscription, resource group, templates, and deployment.
AZURE_SUBSCRIPTION=<subscription-name-or-id>
AZURE_RESOURCE_GROUP_NAME=SmartDevApp
AZURE_RESOURCE_GROUP_LOCATION=australiaeast
AZURE_DEPLOYMENT_NAME=smartdevapp-infra
AZURE_TEMPLATE_FILE=infra/main.bicep
AZURE_PARAMETERS_FILE=infra/main.parameters.dev.json

# ------------------------------------------------------------------------------
# Existing Microsoft Entra application registrations
# ------------------------------------------------------------------------------
# These values come from the development API and frontend app registrations.
API_ENTRA_TENANT_ID=<tenant-id>
API_ENTRA_AUDIENCE=<api-application-id-uri-or-client-id>
API_ENTRA_OWNER_OBJECT_ID=<owner-user-object-id>

FRONTEND_ENTRA_CLIENT_ID=<frontend-client-id>
FRONTEND_ENTRA_AUTHORITY=https://login.microsoftonline.com/<tenant-id>
FRONTEND_ENTRA_API_SCOPE=<api-scope>

# ------------------------------------------------------------------------------
# Optional Azure Communication Services sender
# ------------------------------------------------------------------------------
# Leave blank to use DoNotReply at the generated Azure managed email domain.
COMMUNICATION_SENDER_ADDRESS=
```

The Entra values are required because SmartDevApp reuses existing application registrations. `API_ENTRA_AUDIENCE` is the audience your API accepts, either the API Application ID URI or client ID depending on how the API registration is configured. `API_ENTRA_OWNER_OBJECT_ID` is the Azure AD object ID of the user or principal that should receive access to the API registration where the template needs ownership metadata.

The development parameters deliberately minimise standing cost and align with the current `SmartDevApp` resource group:

| Resource | Development cost control |
| --- | --- |
| Regional resources | Australia East, matching the existing resource group and deployed dependencies. |
| Static Web App | Free tier, using the existing East Asia Static Web App region. |
| API Function | Flex Consumption, 512 MB memory, one on-demand instance at most, no always-ready instances. |
| Worker Function | Flex Consumption, 512 MB memory, one on-demand instance at most, no always-ready instances. |
| Cosmos DB | Serverless account with `articles` and `contact-messages` containers using `/partitionKey`; no provisioned throughput. |
| Service Bus | Basic tier. Duplicate detection is disabled because Basic does not support broker duplicate detection. |
| Storage | Standard locally redundant storage, private containers, and seven-day blob/container soft delete. |
| Key Vault | Standard tier with seven-day soft-delete retention. |
| Observability | Disabled in development so Log Analytics and Application Insights are not provisioned by this template. |
| Speech | Azure Speech is not provisioned. The worker receives `AzureSpeech__Enabled=false` and uses the local speech adapter. |
| Communication Services | Existing Communication Services and Email Communication resources are referenced by name; usage can still incur metered charges. |

This parameter set prioritises development cost over production capacity and resilience. Add a separate production parameter file before deploying a production environment.

## Provision, preview and delete

Use PowerShell 7 and Azure CLI with Bicep installed. Provisioning selects the configured subscription explicitly. The signed-in account needs resource creation and role-assignment permissions for the modules above.

```powershell
# Existing resource group: validate and review proposed changes without creating resources.
./scripts/preview-infra.ps1

# First deployment creates the resource group; later deployments update its infrastructure.
./scripts/provision-infra.ps1

# List resources, require the exact resource-group name, and wait for deletion.
./scripts/deprovision-infra.ps1
```

All three entry scripts have empty parameter contracts. They load the root `.env` themselves and use `ScriptHelpers.psm1` for configuration and `ProvisioningHelpers.psm1` for Azure operations. Temporary deployment parameter files are removed even if Azure fails. Preview requires an existing resource group and never creates it.

`infra/.env` is obsolete. If it exists locally, move any useful entries into the repository-root `.env` without overwriting local application settings, then remove `infra/.env`. The scripts do not read it. Remove obsolete `AZURE_SKIP_WHAT_IF` and `AZURE_WHAT_IF_ONLY` entries; use the separate preview command.

Deletion removes the resource group and its databases. Key Vault soft-deleted names can remain reserved; recover the intended vault or wait for its retention period before reusing its name. A failed deployment can have created some resources: inspect the deployment and preview before retrying. Provisioning does not roll back successful resources automatically.

## Application delivery

Infrastructure provisioning and application release are separate. A successful Bicep deployment creates the Function Apps and Static Web App, but application code still needs to be deployed afterward.

The `githubSecrets` output contract retains these non-secret names:

- `API_BASE_URL`
- `API_FUNCTION_APP_NAME`
- `ENTRA_API_SCOPE`
- `ENTRA_AUTHORITY`
- `ENTRA_CLIENT_ID`
- `RESOURCE_GROUP`
- `SWA_NAME`
- `SWA_RESOURCE_GROUP`
- `WORKER_FUNCTION_APP_NAME`

Existing application-delivery workflows continue to consume those outputs:

- [api-functions-cd.yml](../.github/workflows/api-functions-cd.yml)
- [api-functions-ci.yml](../.github/workflows/api-functions-ci.yml)
- [frontend-cd.yml](../.github/workflows/frontend-cd.yml)
- [frontend-ci.yml](../.github/workflows/frontend-ci.yml)
- [worker-functions-cd.yml](../.github/workflows/worker-functions-cd.yml)
- [worker-functions-ci.yml](../.github/workflows/worker-functions-ci.yml)

Set the workflow's existing authentication secrets separately; Bicep does not generate or print deployment credentials. The current workflow authentication mechanism is preserved.

## Local validation

```powershell
az bicep build --file infra/main.bicep --stdout | Out-Null
git diff --check
```

PowerShell scripts can be parsed without executing them using `System.Management.Automation.Language.Parser.ParseFile`. Authenticated Azure validation and what-if use `preview-infra.ps1`; successful compilation does not prove subscription quotas, provider availability or application integrations.

## Validation on 2026-09-17

Bicep compilation, the development parameter file, PowerShell parsing, and git diff checks passed locally. Azure provisioning and application integrations have not been executed.
