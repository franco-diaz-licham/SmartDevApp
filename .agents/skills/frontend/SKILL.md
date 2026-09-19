---
name: frontend
description: Implement, debug, or review SmartDev React/Vite frontend code, including public article pages, workspace owner flows, auth integration, API clients, TanStack Query usage, styling, and frontend tests.
---

# SmartDev frontend

## Establish the UI flow

1. Identify whether the change affects public view, workspace owner view, authentication, article editing, article audio, contact, API access, routing, styling, or deployment configuration.
2. Inspect the owning feature under `src/SmartDev.UI/src/features`, adjacent components/hooks/services/queries/types, shared API/client code, route setup, and existing tests.
3. Apply the shared API and messaging contract in [AGENTS.md](../../../AGENTS.md) when frontend behavior depends on backend contracts.
4. Keep implementation feature-owned. Shared UI primitives belong under `src/SmartDev.UI/src/components` or `src/SmartDev.UI/src/lib` only when reused.

## Assign state and feature ownership

- Keep server state in TanStack Query and local interaction state in components/hooks. Do not duplicate server state in Zustand or local state without a clear reason.
- Keep auth/session state in the auth feature and shared auth library. Feature components should ask for capabilities/context rather than reimplementing token logic.
- Keep article editing draft state in the article form hook. Do not let metadata panes, content panes, and page components each own competing copies of the same draft.
- Shared stores/hooks should represent cross-feature behavior, not convenience shortcuts for one page.

## Use the shared API boundary

- Use `apiClient` and feature service functions for HTTP calls. Do not call `fetch`/`axios` directly from components.
- Keep API DTOs under feature `types` and map to UI models when the UI needs a different shape.
- Preserve auth error, retry, blob download, and base URL handling in shared API utilities.
- Keep generated URLs encoded and route-safe.

## Implement frontend behavior

- Keep API calls in feature services and TanStack Query hooks. Components should consume hooks/services rather than building URLs directly.
- Keep request/response DTOs aligned with backend contracts. Do not create feature-specific page envelopes for shared page results.
- Preserve the public/workspace split. Public users can view and download existing public article content. Owner-only actions such as create, update, and generate audio remain behind workspace/auth flows.
- Keep auth concerns in auth hooks/providers and API client interceptors. Do not pass tokens through component trees.
- Prefer small hooks/components when conditions, messages, or side effects start to repeat across a page.
- Keep generated object URLs and browser resources cleaned up when audio/blob behavior changes.
- Keep route params encoded/decoded deliberately. Avoid string-building URLs in components.

## API and state handling

- Treat API errors through the shared API error utilities. Avoid feature-specific ad hoc error parsing unless the backend contract is genuinely feature-specific.
- Query keys should include all inputs that affect server results.
- Invalidate or refresh owner/public article queries when mutations change data visible in those queries.
- Do not trigger long-running backend work from public views. Audio generation is owner-initiated; public audio playback downloads existing blob-backed audio.
- Keep user-visible messages about outcomes, not infrastructure. Avoid exposing queues, blobs, Function Apps, or Service Bus in ordinary product copy.

## Styling and UX

- Match existing Tailwind/component conventions before adding new patterns.
- Keep loading, pending, success, empty, and error states visible for save, generate, download, and contact flows.
- Avoid large page components when a named component/hook would make the user flow easier to read.
- Keep accessibility in mind for buttons, forms, headings, labels, and audio controls.

## Configuration and deployment

- Frontend project path is `src/SmartDev.UI`.
- Public production origin is `https://smartdev.com.au`; do not treat the default Static Web App URL as authoritative for production user-facing configuration.
- Keep Vite environment variables non-secret. Do not expose owner object IDs, API keys, connection strings, or deployment tokens.
- Check GitHub Actions and Docker paths when moving or renaming frontend files.

## Apply TypeScript and React conventions

- Prefer explicit types for exported functions, hooks, service methods, and component props.
- Keep components pure where possible; isolate effects in hooks or small effect blocks with clear cleanup.
- Use `useMemo`/`useCallback` only when they protect meaningful work or stable references needed by child hooks/components.
- Avoid broad `any`, non-null assertions, and type casts that hide contract drift.
- Keep tests focused on user-observable behavior and service/query contracts.

## Verify

- Run `npm --prefix src/SmartDev.UI run lint` for TypeScript/frontend source changes when available.
- Run `npm --prefix src/SmartDev.UI run test` when frontend behavior or tests change.
- Run `npm --prefix src/SmartDev.UI run build` for route, config, dependency, or deployment-impacting changes.
- Report browser-only, auth-tenant, or deployed Static Web App behavior that was not exercised.
- Run `git diff --check` when practical.
