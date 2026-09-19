---
name: scripting
description: Create, modify, debug, or review SmartDev PowerShell scripts and modules, including Compose orchestration, user-secrets setup, Azure provisioning previews, provisioning, and deprovisioning automation.
---

# SmartDev scripting

## Establish the workflow

1. Identify the entry script, desired outcome, configuration inputs, shared modules, and side effects. Inspect neighboring scripts, `ScriptHelpers.psm1`, `ProvisioningHelpers.psm1`, `.env` loading, and relevant infra/Docker consumers.
2. Trace failures through configuration resolution, dependency checks, native exit codes, JSON parsing, Azure CLI errors, and cleanup. For reviews, report defects with locations and consequences instead of executing remote workflows.
3. Keep scope explicit: implementing provisioning code does not authorize running provisioning against Azure.
4. Reuse helpers and remove mechanics made obsolete by the change. Extract functions only for meaningful contracts or repeated work.

## Choose the implementation location

| Work | Location |
| --- | --- |
| Executable orchestration | `.ps1` entry script with major steps visible in order. |
| Cohesive operation used by one script | File-local function. |
| Shared file/configuration/command discovery | `ScriptHelpers.psm1`. |
| Shared Azure provisioning and deployment operation | `ProvisioningHelpers.psm1`. |

Keep reusable functions parameterized; do not depend on caller script-scope variables. Return objects when orchestration consumes a result.

## Construct the entry point

- For short scripts, order help, `[CmdletBinding()]`, parameters, strict mode, imports, local functions, configuration loading, validation, then execution.
- For longer scripts, keep `Invoke-Main` near the top after imports, declare helpers afterward, and call `Invoke-Main` last.
- Keep orchestration visible in the entry script. Do not hide the entire workflow in one opaque helper.
- Document executable scripts with comment-based help that explains side effects, required configuration, and examples.

## Resolve configuration

- Read configuration from the root `.env` through shared helpers. Do not duplicate `.env` parsing in each script.
- Keep fixed protocol endpoints and temporary naming rules in code when they are not developer choices.
- Validate required tools and config before side effects.
- Keep permanent destructive-confirmation bypasses out of `.env`.

## Entry-script conventions

- Resolve and load the repository-root `.env` in the entry script. Keep root `.env` as the single developer configuration file; do not keep an active `infra/.env` split.
- Use `Get-Config` for required values, `Get-OptionalConfig` for optional values, and repository path helpers for configured paths.
- Keep ordinary runtime defaults in appsettings/local.settings, container overrides in Compose, and host-based local API secrets in .NET User Secrets.
- `configure-user-secrets.ps1` should only set local user secrets that must come from `.env`; it should not mirror all local defaults.
- Enable `Set-StrictMode -Version Latest` and `$ErrorActionPreference = "Stop"` in scripts/modules.
- Use short, useful progress output. Use warnings for manual recovery. Do not print secret values.

## Implement functions and native commands

- Give every function one responsibility, an approved verb, and a specific noun.
- Use full variable names and factual Boolean names.
- Declare functions with `[CmdletBinding()]` and use typed parameters.
- Use named parameters, splatting for complex calls, and explicit arrays for multiline native arguments. Do not use backtick continuation.
- Check every native exit code that affects the workflow; terminating PowerShell errors alone do not cover native failures.
- Return parsed objects from JSON wrappers instead of reparsing in callers.
- Pass arguments as values; do not build command strings for later evaluation from user-controlled or secret values.
- Use try/catch/finally for actual recovery and cleanup. Create temporary secret-bearing files inside try and remove them in finally.

## Remote and destructive operations

- Before destructive workflow steps, identify the exact resource and require resource-specific confirmation unless the caller deliberately supplied a supported force option.
- Applying infrastructure, deprovisioning, role changes, runtime changes, credential rotation, and resource deletion require the user to request that exact operation.
- Make NoWait/async remote behavior explicit and report that remote work continues after script exit. Do not imply completion from successful submission.

## Validate and deliver

1. Parse changed `.ps1` and `.psm1` files using `System.Management.Automation.Language.Parser.ParseFile`.
2. Inspect changed modules for import-time side effects, then import in a safe process and inspect exports when module behavior changes.
3. Run PSScriptAnalyzer when available and review findings against repository conventions.
4. Search for stale helper names, duplicated workflow mechanics, secrets in output, and backtick continuations.
5. Exercise safe configuration-failure, native-failure, and cleanup paths where warranted. Mock/isolate external mutations and report untested remote behavior.
6. Run `git diff --check` when practical and summarize changed behavior, validation results, and relevant recovery/execution limitations.
