# SmartDevApp repository instructions

## Product and engineering direction

- Build SmartDev as a public portfolio and article management application with a small, maintainable Azure footprint.
- Prefer simple, explicit, feature-owned implementations. Deliver the smallest complete vertical slice that satisfies the current user outcome.
- Follow established repository patterns before introducing a new dependency, abstraction, host, datastore, or deployment boundary. Add them only for a demonstrated need.
- Keep shared infrastructure genuinely shared. Feature-specific code stays in its feature; reusable storage, text conversion, messaging contracts, options, and host primitives live in shared/common areas.
- Remove code made obsolete by the requested change. Do not retain unused compatibility layers, empty scaffolding, speculative extension points, stale settings, or obsolete documentation.
- Treat development infrastructure as cost-capped. Prefer the cheapest Azure configuration that still supports the implemented behavior.

## Repository map

| Location | Responsibility |
| --- | --- |
| `src/SmartDev.Api.Functions` | .NET isolated Azure Functions API, HTTP endpoints, auth/rate-limit/CORS middleware, feature use cases, domain behavior, Cosmos persistence, and API host configuration. |
| `src/SmartDev.Worker.Functions` | .NET isolated Azure Functions worker for Service Bus-triggered background work such as contact email and article narration. |
| `src/SmartDev.Shared` | Cross-process contracts, messaging topology, shared options, blob audio storage, markdown/text conversion, and small shared infrastructure helpers. |
| `src/SmartDev.Tests` | Backend unit tests. Use Arrange-Act-Assert comments in tests. |
| `src/SmartDev.UI` | React, TypeScript, Vite frontend for public and owner article experiences. |
| `docker` | Local Compose stack, Dockerfiles, emulators, Service Bus config, OTEL collector configuration, and local container documentation. |
| `infra` | Azure Bicep composition, resource modules, development parameters, resource inventory, and infrastructure documentation. |
| `scripts` | PowerShell entry scripts and reusable modules for local setup, user secrets, Compose, and Azure infrastructure operations. |
| `docs/planning` | Product vision, domain design, architecture decisions, implementation plans, and current status. |
| `.agents/skills` | Task-specific agent workflows and engineering conventions. |

## Instruction ownership

- Apply every skill in `.agents/skills` whose description matches the current task. Tasks spanning several areas use all relevant skills.
- Keep this file limited to rules that apply across the repository. Put conditional implementation details and validation procedures in the owning skill.
- When recurring review feedback changes how work should be done, update the relevant skill. Update this file only when the rule truly applies repository-wide.
- Keep product-specific decisions in `docs/planning`; keep operational instructions beside the subsystem they describe.
- Keep agent instructions in `AGENTS.md` and `.agents/skills`; do not duplicate those rules in planning docs.

## Agent compatibility

- Project-wide instructions live in this root `AGENTS.md`.
- Task-specific skills live in `.agents/skills/<skill-name>/SKILL.md` and use YAML frontmatter with `name` and `description`.
- OpenCode and Codex-style agents should discover these project skills from `.agents/skills`. Keep skill names lowercase and aligned with their folder names.
- Use `.opencode/agents/<name>.md` only when the project needs named OpenCode subagents with distinct roles. Do not duplicate ordinary skill guidance there.
- When updating agent guidance, keep reusable repository rules here and put task-specific workflows in the relevant skill.

## Working agreements

- Identify the owning feature/use case before editing. Inspect adjacent endpoints, handlers, contracts, registrations, configuration, persistence, tests, and docs.
- Preserve clear ownership boundaries across features and deployed processes. Collaborate through explicit contracts rather than another feature's internal types, repositories, documents, or mutable state.
- Preserve the feature-driven backend layout. Use `Features/<Feature>/UseCases/<UseCase>` for use-case flow and keep endpoints close to their handlers.
- Keep public API, owner API, worker triggers, and cross-process message contracts distinct. Collaborate through explicit contracts in `SmartDev.Shared` when crossing process boundaries.
- Keep secrets, tokens, production connection strings, real tenant/object identifiers, `.env` contents, customer data, and user data out of source control, logs, tests, examples, and generated artifacts. Clearly label committed emulator credentials and local connection strings as development-only.
- Preserve unrelated user changes in a dirty worktree. Keep edits scoped and avoid broad formatting or refactoring unless required by the task.
- Update documentation when behavior, public contracts, configuration keys, commands, ports, resource outputs, runtime settings, or recovery procedures change.
- Do not claim that planned behavior is implemented or that an external deployment/provisioning operation succeeded without direct evidence.

## Infrastructure parameter rule

`infra/main.parameters.dev.json` should contain Azure resource configuration: regions, SKUs, runtime versions, scale, retention, TLS/network/resource settings, queue settings, and existing Azure resource names. Do not add custom project-control flags such as `enabled` when a resource is always part of the environment. Azure-native `enabled` properties are fine when they map directly to the Azure resource schema.

## Canonical commands

Run commands from the repository root unless the command states otherwise.

```powershell
dotnet build src/SmartDev.slnx -c Release
dotnet test src/SmartDev.slnx -c Release
npm --prefix src/SmartDev.UI run lint
npm --prefix src/SmartDev.UI run test
npm --prefix src/SmartDev.UI run build
az bicep build --file infra/main.bicep --stdout | Out-Null
./scripts/compose.ps1
git diff --check
```

- Use `scripts/compose.ps1` for the normal complete local stack; it requires the Git-ignored root `.env` configuration.
- Inspect current project and package scripts before choosing tests. Run relevant tests when they exist and report missing coverage rather than inventing a successful test run.
- Validate infrastructure and deployment definitions without applying them. Provisioning, deployment, deprovisioning, credential rotation, and destructive data resets occur only when that external operation is explicitly requested.

## Completion criteria

- Verify the changed behavior at the narrowest meaningful boundary, then run the applicable build, lint, test, parser, container, or infrastructure checks described by the owning skills.
- Confirm generated files, Functions metadata, API contracts, Bicep outputs, Docker paths, CI/CD paths, configuration, and documentation remain synchronized where the change affects them.
- Run `git diff --check` and review the final diff for unrelated edits, leaked secrets, stale names, dead code, and obsolete configuration when practical.
- Report what changed, what was verified, and any integration or external behavior that could not be exercised.

## Shared API and messaging contract

- Every GET endpoint returning a list is paginated by default, including owner/admin and lookup endpoints. Omitting pagination parameters returns a bounded first page, never the entire collection.
- Page-number endpoints return the shared page shape consumed by the frontend. Do not create feature-specific page envelopes when the shared shape applies.
- Owner-only endpoints require valid Entra access and owner authorization. Public article endpoints remain available without owner authorization.
- Public users can view/download existing public content. Article audio generation is explicit owner-initiated work hidden behind login.
- Service Bus is at-least-once delivery. Consumers must be idempotent where duplicate processing can cause cost, external side effects, or user-visible inconsistency.
- Cross-process contracts and topology names live in `SmartDev.Shared`. Do not let a worker consume API feature internals or persistence documents.
