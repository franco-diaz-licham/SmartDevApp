---
name: ci-cd
description: Design, implement, debug, or review SmartDev GitHub Actions workflows, build/test pipelines, artifact paths, Static Web App deployment, Function App deployment, and Azure deployment automation.
---

# SmartDev CI/CD

## Establish the delivery boundary

1. Identify whether the change validates code, builds an artifact, provisions infrastructure, deploys API/worker/UI, updates repository variables/secrets, or promotes an existing release.
2. Inspect `.github/workflows`, `src/SmartDev.slnx`, `src/SmartDev.UI/package.json`, Dockerfiles, `infra/main.bicep`, provisioning scripts, and infrastructure outputs before editing.
3. Keep validation, artifact packaging, provisioning, and deployment responsibilities visible even when one workflow coordinates several steps.
4. Do not use CI/CD changes as a reason to print secrets, deployment tokens, connection strings, or Azure credentials.

## Preserve paths and artifact contracts

- Backend paths use `src/SmartDev.Api.Functions`, `src/SmartDev.Worker.Functions`, `src/SmartDev.Shared`, `src/SmartDev.Tests`, and `src/SmartDev.slnx`.
- Frontend path is `src/SmartDev.UI`.
- Keep Function App deployment artifacts separated for API and worker.
- Keep GitHub variables/secrets names aligned with scripts and workflows. Do not assume environment-level secrets exist when repository secrets are used.
- Preserve the Static Web App custom domain expectation: production user-facing URL is `https://smartdev.com.au` even if Azure exposes a generated default URL.

## Workflow behavior

- CI workflows should run the same meaningful local commands where possible: backend build/test and frontend lint/test/build.
- CD workflows should deploy built artifacts and avoid rebuilding different source state unless that is the explicit workflow contract.
- Infrastructure deployment workflows should compile/validate Bicep and use the existing scripts. Applying infrastructure remains an external mutation.
- Keep .NET isolated/Flex runtime assumptions synchronized with Bicep and project target frameworks.
- Keep Node/npm versions synchronized with the UI project and Dockerfile assumptions.

## Organize workflows

- Keep CI and CD responsibilities separate unless a workflow intentionally owns both.
- Use path filters only when they cannot skip required validation for shared contracts or deployment files.
- Keep workflow names, artifact names, and job names specific enough to distinguish API Functions, Worker Functions, UI, and infrastructure.
- Prefer reusable local commands over duplicating different build logic in YAML.

## Validate before publishing

- Run tests/builds before packaging artifacts.
- Compile Bicep before any infrastructure deployment step.
- Validate required secrets and variables early with clear names, but never print their values.
- Fail fast on missing paths caused by project moves.

## Build immutable artifacts once

- Build artifacts from the checked-out commit and deploy that exact artifact.
- Do not rebuild different source state during deployment jobs unless the workflow explicitly documents that contract.
- Keep API and worker artifacts separate so one deployment cannot accidentally publish the wrong Function App.
- Keep frontend build output tied to `src/SmartDev.UI` and the configured production base/API settings.

## Deploy safely

- Deploy to the intended Azure resource names from repository secrets/variables or Bicep outputs; do not hard-code generated default URLs as product URLs.
- Infrastructure deployment should use the provisioning scripts or the same parameter file developers validate locally.
- Preserve current production audience/access settings unless the user explicitly requests a change.
- Restart/reload Function Apps only when required by deployment or runtime setting changes.

## Handle failures and reporting

- Surface Azure CLI/GitHub Action failures with the failing resource, operation, and safe diagnostic details.
- For deployment failures, inspect deployment operations before guessing.
- Do not claim deployment success from artifact upload alone; verify the deployment step and, when possible, the app/runtime status.
- Keep rollback/recovery notes current when workflow behavior changes.

## Verify

- Validate YAML by inspection and run local equivalent commands where practical.
- Run `dotnet build src/SmartDev.slnx -c Release` and `dotnet test src/SmartDev.slnx -c Release` when workflow changes affect backend jobs.
- Run `npm --prefix src/SmartDev.UI run lint`, `npm --prefix src/SmartDev.UI run test`, and `npm --prefix src/SmartDev.UI run build` when workflow changes affect frontend jobs.
- Compile Bicep for infrastructure workflow changes without applying unless deployment is explicitly requested.
- Report workflow behavior that could not be executed locally.
