# SmartDevApp Azure infrastructure

## Resource ownership

| Workload/module | Resource boundary |
| --- | --- |
| frontend | [static-web-app.bicep](modules/resources/static-web-app.bicep) |
| observability | [observability.bicep](modules/resources/observability.bicep) |
| storage | [storage-account.bicep](modules/resources/storage-account.bicep) |
| serviceBus | [service-bus.bicep](modules/resources/service-bus.bicep) |
| cosmos | [cosmos-db.bicep](modules/resources/cosmos-db.bicep) |
| communication | [communication-services.bicep](modules/resources/communication-services.bicep) |
| keyVault | [key-vault.bicep](modules/resources/key-vault.bicep) |
| apiFunction | [function-app.bicep](modules/resources/function-app.bicep) |
| workerFunction | [function-app.bicep](modules/resources/function-app.bicep) |
| dns | [dns-zone.bicep](modules/resources/dns-zone.bicep) |

`main.bicep` owns names, relationships, runtime settings and stable deployment outputs. Resource modules live in the flat `modules/resources/` directory and do not call other modules. Environment configuration is grouped by resource in typed `*Config` parameters. Add `modules/configuration/` or `stages/` only when an independently required configuration phase exists.

## Environments and configuration

`main.parameters.dev.json` is the separate development environment. Regional resources use Canada Central and Static Web Apps uses East US 2. Static Web Apps is Free; applicable registries are Basic, storage is locally redundant, and Container Apps retain bounded scale. Monitoring has 30-day retention and a 1 GiB daily ingestion cap. These settings bound individual services, not the total Azure bill.

The existing production parameter file retains its resource names, regions, sizing, runtime versions and application contracts. Its parameter schema is now grouped by resource; update any external callers that supplied the previous scalar parameters. Existing low-cost production settings are preserved, not newly certified for production resilience.

Development disables the custom DNS zone and reduces Cosmos database throughput to 400 RU/s. Service Bus remains Standard because the existing queues require duplicate detection. API and worker Functions retain their existing Flex Consumption memory and scaling constraints.

Create the Git-ignored **repository-root** `.env` file. Do not commit credentials or real tenant/object identifiers:

```dotenv
AZURE_SUBSCRIPTION=<subscription-name-or-id>
AZURE_RESOURCE_GROUP_NAME=rg-smartdevapp-dev
AZURE_RESOURCE_GROUP_LOCATION=canadacentral
AZURE_DEPLOYMENT_NAME=smartdevapp-infra
AZURE_TEMPLATE_FILE=infra/main.bicep
AZURE_PARAMETERS_FILE=infra/main.parameters.dev.json
```

Supply these additional local deployment inputs in the same file:

| Environment key | Bicep parameter |
| --- | --- |
| `API_ENTRA_TENANT_ID` | `apiEntraTenantId` |
| `API_ENTRA_AUDIENCE` | `apiEntraAudience` |
| `API_ENTRA_OWNER_OBJECT_ID` | `apiEntraOwnerObjectId` |
| `FRONTEND_ENTRA_CLIENT_ID` | `frontendEntraClientId` |
| `FRONTEND_ENTRA_AUTHORITY` | `frontendEntraAuthority` |
| `FRONTEND_ENTRA_API_SCOPE` | `frontendEntraApiScope` |

Passwords and application credentials are required inputs, never generated examples. Database administrator passwords require at least 12 characters.

COMMUNICATION_SENDER_ADDRESS remains optional in the root .env; omit it to use the generated Azure managed sender address.

Existing Entra registrations and permissions remain application-owned inputs where required. The BSW-specific three-application Graph connector and rotation scripts are not introduced into applications that do not implement that connector.

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

When migrating from the previous scripts, move the **configuration entries** from `infra/.env` into the existing root `.env` without overwriting local application settings. The scripts do not move or print existing secrets. Remove obsolete `AZURE_SKIP_WHAT_IF` and `AZURE_WHAT_IF_ONLY` entries; use the separate preview command. Subscription, environment-file, password, force and no-wait command-line overrides are removed.

Deletion removes the resource group and its databases. Key Vault soft-deleted names can remain reserved; recover the intended vault or wait for its retention period before reusing its name. A failed deployment can have created some resources: inspect the deployment and preview before retrying. Provisioning does not roll back successful resources automatically.

## Application delivery

Infrastructure provisioning and application release are separate. Container Apps start with the bootstrap image; a successful Bicep deployment alone does not mean the application is running. Reprovisioning a template configured with the bootstrap image can reset the deployed revision: review the preview and redeploy the intended application image afterward.

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

## Validation on 2026-09-12

Bicep compilation, development/production parameter-shape checks, PowerShell parsing and git diff checks passed. Isolated script checks covered missing configuration, native failures, temporary-file cleanup, mutation-free preview and typed deletion confirmation. Azure provisioning and application integrations have not been executed.
