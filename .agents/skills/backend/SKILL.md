---
name: backend
description: Implement, debug, or review SmartDev .NET backend code, including Azure Functions API endpoints, feature use cases, domain behavior, Cosmos persistence, Service Bus messaging, worker Functions, speech/audio generation, and backend tests.
---

# SmartDev backend

## Establish the use case

1. Identify the owning feature, entry point, read/write intent, authorization needs, storage boundary, message contract, and observable outcome. Inspect adjacent slices, domain types, repositories, registration, tests, and relevant planning documents.
2. Apply the shared API and messaging contract in [AGENTS.md](../../../AGENTS.md).
3. Trace defects across transport, handler, domain, persistence, messaging, worker execution, and external providers. For reviews, report evidenced defects with locations and consequences; keep implementation within the requested scope.
4. Add only required types, dependencies, host boundaries, and abstractions. Remove code made obsolete by the change. Do not introduce mediator frameworks, reflection-based feature discovery, generic repositories, or empty architecture folders before a real boundary needs them.

## Project and folder shape

Place API business ownership under `src/SmartDev.Api.Functions/Features/<Feature>/`:

- `Domain/`: entities, typed IDs, value objects, policies, enums, and business events.
- `UseCases/<UseCase>/`: endpoint, request/command/query, explicitly named handler, validator when present, and response models.
- `Contracts/`: interfaces and immutable data intentionally exposed across feature boundaries.
- `Infrastructure/`: feature-owned repositories, queries, documents, and provider adapters.

Place worker ownership under `src/SmartDev.Worker.Functions/Features/<Feature>/<UseCase>/` with the trigger, handler, feature provider contracts, templates, and local models together. Keep worker host/provider registration in `Configuration` or `Common/Infrastructure`.

Keep shared primitives in API `Common/Domain` and `Common/Application`; shared technical mechanisms belong in `Common/Infrastructure`. Cross-process contracts, queue names, shared storage, and shared text conversion live in `src/SmartDev.Shared`.

Do not put reusable infrastructure under one feature because it was first needed there. For example, blob audio storage and markdown text conversion are shared infrastructure, while article narration orchestration is article feature behavior.

## Implement transport and application flow

- Preserve use-case intent in type names: `GenerateOwnerArticleAudioEndpoint`, `GenerateOwnerArticleAudioHandler`, and `ArticleAudioGenerationRequest` rather than generic endpoint/handler/response names.
- Keep endpoints and triggers limited to binding, validation, handler invocation, response mapping, and useful non-sensitive logging.
- Enforce owner-only access in owner routes and middleware/use-case boundaries. Missing owner context must not mean unrestricted access.
- Keep public article behavior separate from owner article management behavior. Public users download existing audio; they do not generate it.
- Use feature repository contracts, pass cancellation tokens through async boundaries, and return `Result<T>` for expected application outcomes.
- Let unexpected exceptions reach the Functions host. Catch only to add useful non-sensitive context or to translate provider-specific expected failures.
- Keep malformed JSON, missing bodies, unparseable IDs, auth failures, CORS, and rate limiting behavior consistent across API endpoints.

## Implement pagination

- Every list endpoint returns a bounded page by default, including owner/admin and lookup endpoints.
- Use the shared query/page conventions already present in `Common/Application` and article use cases before creating new paging models.
- Validate page number, page size, sort field, and sort direction at the transport or handler boundary before querying Cosmos.
- Apply deterministic ordering before pagination. Add a stable tie-breaker when sorting by non-unique fields.
- Do not create feature-specific page envelopes when the frontend already consumes the shared page result shape.
- Preserve continuation-token semantics if a future external provider requires them; do not fake page numbers over an opaque cursor.

## Protect domain behavior

- Use controlled factories, private setters, and read-only collections where domain state is mutable.
- Model stable identity/lifecycle concepts as entities with typed IDs. Keep framework/provider dependencies out of domain code.
- Keep invariants in domain methods rather than duplicating them in handlers. Add events only for meaningful reactions.
- Keep domain enums, statuses, policies, visibility, publication rules, and stable vocabulary in the owning feature.
- Do not return domain entities or persistence documents from API endpoints.
- Keep names/emails/display values mutable unless the domain needs immutable historical snapshots.

## Implement persistence and consistency

- Handlers, middleware, and triggers must not inject raw Cosmos clients when a feature repository or shared store contract owns the operation.
- Separate command and query implementations when loading/tracking/projection differs.
- Keep Cosmos document shapes in feature infrastructure and map explicitly to domain/response models.
- Choose partition keys by access/ownership and query patterns, not by UI labels. Do not confuse `partitionKey` storage strategy with `visibility` business state.
- Apply deterministic ordering before pagination. Return bounded results by default.
- Treat ETags/content versions as equality tokens or content hashes, distinct from user-visible business state.

## Messaging and worker hosts

- Use `SmartDev.Shared.Messaging.WorkerTopology` for queue names and shared integration events for cross-process schemas.
- Distinguish in-process domain events, integration events, and imperative worker commands. Queue messages should carry only what the worker needs to perform the background work.
- Service Bus delivery is at-least-once. Consumers that send email, call Azure Speech, or write blobs must be idempotent.
- Use stable logical `MessageId` values where possible, but remember Service Bus Basic does not support duplicate detection. Consumer idempotency still matters.
- If a worker throws, Azure Functions retries the same message until the queue's `maxDeliveryCount` is reached. Design logs, App Insights traces, and tests with that behavior in mind.
- Keep Service Bus trigger functions thin. Deserialize/bind, log, and delegate to a handler. The handler owns business flow.
- For article narration, check whether audio already exists for the article/content version before calling Azure Speech. Upload generated audio to blob storage and let the public API serve from blob storage.
- Keep worker scale/concurrency coherent with cost and external dependency limits. Do not raise concurrency to hide provider timeouts.

## Configure and observe

- Bind typed options with `AddOptions().Bind().ValidateDataAnnotations().ValidateOnStart()` when values are required.
- Inject options and provider clients through DI. Avoid scattering configuration reads through handlers.
- Local development uses mocks/fakes/emulators for Cosmos, Service Bus, email, blob storage, and speech where configured by the local stack.
- Production secrets come from Key Vault references or secure hosting settings. Do not copy secret values into source files, docs, tests, or output.
- Configure OpenTelemetry and Application Insights consistently across API and worker. A blank `APPLICATIONINSIGHTS_CONNECTION_STRING` means Azure Monitor export will not happen.
- Log operations, IDs, correlation, status, and useful non-sensitive context at the owning handler/provider boundary. Never log tokens, connection strings, access keys, or sensitive payloads.

## C# style

- Use ordinary using directives and unambiguous type names. Match non-partial type names to filenames.
- Enable nullable-aware code, use full names, prefer records/init-only DTOs for immutable transport shapes, and use blocks for multistep behavior.
- Use named arguments for multi-value constructors/factories when they prevent mistakes. Do not mix named and positional arguments in the same call.
- Keep simple one-line guard clauses readable; use blocks for multiple statements, declarations, comments, and ambiguous nested control flow.
- Name business decisions with meaningful Boolean locals when conditions combine several checks.
- Document project-owned interface contracts with XML. Document domain types/properties/factories and public/internal business operations where meaning, units, ownership, or preconditions are not obvious. Avoid XML comments that only repeat the member name.

## Tests and verification

- Tests must use Arrange, Act, and Assert comments.
- Name tests `MethodName_Condition_ExpectedOutcome`.
- Prefer real domain objects and mock true external boundaries. Verify meaningful boundary calls rather than implementation details.
- Add behavioral tests when changing domain invariants, handlers, converters, storage/messaging behavior, or provider translation.
- Use integration tests when provider translation, Cosmos query behavior, Service Bus metadata, or Functions bindings are the changed behavior and local isolation can prove it.
- Run `dotnet build src/SmartDev.slnx -c Release` for backend compilation changes.
- Run `dotnet test src/SmartDev.slnx -c Release` when backend behavior, contracts, or tests change.
- Check generated Functions metadata when changing triggers, binding attributes, or function names.
- Run `git diff --check` when practical and report any Azure-only behavior that was not deployed or exercised.
