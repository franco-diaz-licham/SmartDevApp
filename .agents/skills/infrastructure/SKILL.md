---
name: infrastructure
description: Create, modify, debug, or review SmartDev Azure infrastructure in infra, including Bicep composition, modules, development parameters, Function Apps, Cosmos DB, Service Bus, Storage, Speech, Communication Services, Key Vault, observability, DNS, and cost controls.
---

# SmartDev Azure infrastructure

## Establish ownership and scope

1. Identify the workload/resource boundary, target environment, consumers, security boundary, cost impact, and deployment/rollback implications.
2. Inspect `infra/main.bicep`, relevant resource modules, `infra/main.parameters.dev.json`, `infra/README.md`, provisioning scripts, Docker/runtime settings, CI/CD workflows, and consumers of changed outputs.
3. Treat development as cost-capped. Do not infer production capacity, resilience, networking, or retention from development parameters.
4. Editing IaC does not authorize applying it. Provisioning, deprovisioning, role changes, runtime changes, secret rotation, and resource deletion require the user to request that external operation explicitly.

## Preserve the Bicep layout

`infra/main.bicep` is the resource-group-scope composition root. It owns normalized names, cross-resource relationships, shared tags, application settings, secret references, and stable outputs.

- Put Azure resource boundaries in flat `infra/modules/resources/`.
- Modules must not invoke other modules. Compose them only from the root entry template.
- Pass one cohesive configuration object to each resource module when that reveals the resource contract better than many unrelated scalar parameters.
- Keep modules readable in the order parameters, variables, resources/modules, then outputs, using existing section comments.
- Keep fixed application contracts, relationships, generated names, secret references, and derived URLs in Bicep instead of repeating them in parameters or scripts.
- Keep environment-specific regions, SKUs, runtime versions, scale, retention, network access, TLS, and queue behavior grouped by resource boundary in `main.parameters.dev.json`.

## Write explicit infrastructure

- Use explicit resource API versions and describe parameters in modules.
- Mark sensitive inputs and outputs with `@secure()` and avoid outputting credentials for convenience.
- Centralize names, relationships, and shared tags in `main.bicep`; keep provider length restrictions and existing resource names visible.
- Express dependencies through outputs and property references. Add `dependsOn` only when Bicep cannot infer a real dependency.
- Output stable names, hostnames, resource identifiers, and public client configuration needed by scripts and CI/CD. Do not output connection strings, keys, or tokens.
- Preserve app setting names as runtime contracts with code. When renaming a setting, update code options, local settings, Docker Compose, scripts, CI/CD, and docs together.
- Keep generated ARM JSON such as `main.json` out of source control; Bicep is the maintained source.
## Parameters are Azure configuration

`infra/main.parameters.dev.json` should contain Azure resource configuration and existing Azure resource names. Do not add custom project-control flags such as `enabled` when a resource is always part of the environment.

Allowed examples:

- Azure regions, SKUs, runtime versions, memory, max instance count, retention, TLS, public network access, queue TTL/lock/max delivery, CORS origins, and existing resource names.
- Azure-native `enabled` properties such as retention policies when that maps directly to an Azure resource schema.

Avoid examples:

- Project switches like `observability.enabled` or `speech.enabled` when those resources are required.
- Values that duplicate relationships already known by Bicep.
- Secret values, tenant/object IDs that should come from `.env`, or generated output values copied back into parameters.

## Protect identity, secrets, and data

- Prefer managed identities and least privilege. Use Key Vault references for runtime secrets instead of plain application settings.
- Keep database, Service Bus, storage, Speech, Communication Services, and deployment secrets out of committed parameters, outputs, logs, and docs.
- Review deletion behavior, soft-delete retention, backups, public access, TLS, and network rules before changing stateful services.
- Treat deletion, identity replacement, role removal, credential rotation, database replacement, and resource-name changes as potentially destructive. Use what-if and state affected resources before applying.

## Preserve runtime contracts

- Function Apps are .NET isolated on Flex Consumption and use `functionAppConfig.runtime`; do not rely on old App Service stack settings as the source of truth.
- Keep development Function scale cheap: 512 MB and maximum instance count 1 unless the user explicitly accepts the cost/concurrency change.
- API and worker both need non-empty `APPLICATIONINSIGHTS_CONNECTION_STRING` from the observability module.
- Observability is part of the environment. Wire App Insights and Log Analytics through the observability module and keep the Log Analytics daily cap at the cheapest Azure-accepted value unless asked otherwise.
- Service Bus Basic tier does not support duplicate detection or topics. Do not configure unsupported queue properties for Basic.
- Existing Service Bus queues may be declared as `existing` when Basic tier prevents updating unsupported queue properties. Keep queue names aligned with `WorkerTopology`.
- Worker settings must align with code options: `AzureServiceBus`, `AzureSpeech__Region`, `AzureSpeech__VoiceName`, Key Vault-backed `AzureSpeech__SubscriptionKey`, Communication Services settings, storage settings, and article audio container name.
- CORS must include the real production origin `https://smartdev.com.au`; do not derive production CORS from the default Static Web App URL when the custom domain is authoritative.
- New resources should only be added for implemented workloads. Do not provision speculative services.

## Cost controls

- Use free/basic/lowest valid SKUs for development unless behavior cannot work there.
- Keep Speech at the free SKU when possible.
- Keep Storage LRS and private containers unless a requirement justifies more.
- Keep Log Analytics quota low; Azure rejects `0`, so use the cheapest accepted positive quota.
- Avoid always-ready Function instances unless the user explicitly accepts the cost.

## Validate before deployment

1. Compile changed Bicep entry templates with `az bicep build --file infra/main.bicep --stdout | Out-Null`.
2. Review diagnostics instead of suppressing them without a documented provider limitation.
3. When authenticated validation is in scope, select subscription/resource group explicitly, then validate and run what-if. Inspect replacements, deletes, roles, secrets, retention, and cost-affecting SKU/scale changes.
4. Do not apply a deployment merely to test syntax.
5. Verify outputs against scripts, Docker/runtime settings, docs, and CI/CD variable names.
6. Update `infra/README.md` when inventory, layout, configuration, cost controls, credentials, outputs, or recovery changes.
7. Run `git diff --check` when practical and report what was compiled, validated, or only reviewed.
