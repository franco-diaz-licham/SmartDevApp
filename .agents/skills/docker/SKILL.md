---
name: docker
description: Implement, debug, or review SmartDev Docker and local Compose configuration, including Dockerfiles, emulator wiring, local environment variables, ports, OTEL collector, and container build paths.
---

# SmartDev Docker and local stack

## Establish the local boundary

1. Identify whether the change affects API Functions, Worker Functions, UI, emulators, Service Bus config, Cosmos certs, blob storage, OTEL collector, ports, or `.env`-driven configuration.
2. Inspect `docker/docker-compose.yml`, Dockerfiles, `docker/serviceBusConfig.json`, root `.env` expectations, appsettings/local.settings files, and scripts before editing.
3. Local development should use mocks/fakes/emulators for external dependencies where the project supports them. Do not point local Compose at real Azure services unless explicitly requested.

## Preserve paths and build context

- Source projects live under `src/`. Dockerfiles and workflows must not assume the old `backend` or root `frontend` layout.
- Backend solution path is `src/SmartDev.slnx`.
- API project path is `src/SmartDev.Api.Functions`; worker project path is `src/SmartDev.Worker.Functions`; UI path is `src/SmartDev.UI`.
- Keep Docker build contexts, copied project paths, publish paths, and image names synchronized with project moves.
- Avoid broad Dockerfile rewrites when a narrow path/env fix solves the issue.

## Build workload images

- Keep API and worker Dockerfiles aligned with .NET isolated Functions publish output and the shared solution layout.
- Keep UI Dockerfile aligned with Vite build output and Static Web App hosting expectations.
- Copy project files in dependency-friendly order where possible, but do not overcomplicate Dockerfiles for small gains.
- Keep image build arguments and environment variables non-secret unless Docker/Compose explicitly injects them at runtime.

## Compose the local environment

- Compose should make the local stack understandable: API, worker, UI, emulators, OTEL collector, and supporting volumes/networks.
- Keep service names stable when code, scripts, or docs depend on them.
- Keep health checks and dependencies practical; do not add fragile sleeps where a proper readiness signal exists.
- Preserve local ports documented by scripts or docs.

## Change dependencies deliberately

- Review both Dockerfiles and package/project files when adding dependencies.
- Keep package restore/install behavior consistent between local, Docker, and CI.
- Do not hide dependency failures by disabling lockfiles, ignoring scripts, or swallowing restore errors unless the tradeoff is explicit and scoped.

## Diagnose without losing state

- Prefer logs, `docker compose config`, targeted rebuilds, and targeted container exec commands before deleting volumes.
- Treat volume deletion, emulator data resets, and image prune operations as destructive unless the user requested them.
- Do not print environment secrets while diagnosing containers.

## Runtime configuration

- Compose reads developer-specific values from the ignored root `.env`.
- Ordinary local defaults belong in appsettings/local.settings or Compose overrides, not user secrets, unless the local host specifically requires user secrets.
- Keep OTEL local endpoint as `http://otel-collector:4317` inside containers.
- Keep Service Bus emulator entity names aligned with `WorkerTopology`.
- Keep local worker speech behavior fake in Development unless the user explicitly wants to exercise Azure Speech.
- Do not print secret env values, connection strings, or tokens when debugging Compose.

## NPM and frontend builds

- Prefer reproducible installs. Do not remove lockfile usage or use `--no-package-lock` unless fixing a demonstrated Docker-specific npm issue and documenting the tradeoff.
- Keep optional dependency handling deliberate for platform-specific Vite/Rollup packages.

## Verify

- Use `docker compose config --quiet` from the `docker` directory for syntax/config checks.
- Build affected images with `docker compose build <service>` or the smallest relevant set.
- Use `scripts/compose.ps1` for the normal complete local stack when runtime verification is needed.
- Report emulator-only or cloud-only behavior that was not exercised.
- Run `git diff --check` when practical.
