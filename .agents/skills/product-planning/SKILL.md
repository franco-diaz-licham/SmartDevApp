---
name: product-planning
description: Create, revise, or review SmartDev product plans, architecture notes, implementation plans, operational documentation, and docs under docs/planning. Use for planning/design/docs rather than ordinary code edits.
---

# SmartDev planning and documentation

## Start from product intent

1. Identify whether the document defines product behavior, architecture, domain ownership, implementation order, operational recovery, or current status.
2. Read directly relevant plans and inspect implemented code/configuration before stating behavior exists. Aspirational plans are not implementation evidence.
3. Apply the relevant engineering skill when the plan makes concrete frontend, backend, Docker, infrastructure, scripting, or delivery decisions.
4. Describe what the user accomplishes before endpoints, queues, Function Apps, blob keys, or deployment mechanics.
5. Keep SmartDev's public portfolio experience and owner workspace experience distinct.

## Separate truth by document purpose

- Product vision explains users, problems, principles, capabilities, and exclusions.
- Domain design defines vocabulary, ownership, invariants, consistency, permissions, lifecycle, and integration facts.
- Implementation plans identify slices, dependencies, order, acceptance criteria, migration, and deferred work.
- Operational docs state current commands, settings, resource contracts, recovery, and observed behavior.
- `AGENTS.md` and `.agents/skills/` hold agent working instructions. Do not duplicate those rules in plans.

## Keep status and scope honest

- Put concise status near the top of evolving designs. Distinguish implemented, partially implemented, proposed, and deferred behavior.
- Do not claim support for deployments, integrations, audio generation, telemetry, auth, or provisioning unless code/configuration and verification show it.
- State the first complete user outcome or proof slice. Prefer vertical progress through a real user flow over scaffolding future features.
- Mark illustrative trees, models, and examples as targets rather than instructions to create empty code.
- Record non-goals and deferred decisions when they prevent accidental expansion.
- Update stale status, links, names, routes, settings, and cross-references when implementation changes the contract.

## Design ownership and behavior

- Give every mutable concept one authoritative owner. Collaborate through explicit contracts and immutable facts.
- Articles own article content and publication state. Worker owns async execution. Shared owns cross-process contracts and reusable infrastructure primitives.
- Define each command's consistency boundary and which state, outgoing messages, and external side effects commit together.
- Define transitions, permissions, validation, concurrency, audit/history, retry/idempotency, and recovery where behavior depends on them.
- Use stable identity/reference IDs. Treat slugs, titles, names, and emails as mutable display data unless documented otherwise.
- Do not expose arbitrary infrastructure or implementation mechanics as product configuration.

## Keep decisions reviewable

- Define important vocabulary once and use it consistently.
- Use tables for ownership, permissions, lifecycle, alternatives, or value mappings when comparison matters.
- Use numbered sequences where order, transactions, retries, or recovery matter.
- Explain why a boundary exists and what would justify changing it.
- When alternatives matter, record the choice, rejected options, tradeoffs, and revisit conditions.
- Keep secrets, real tenant/object IDs, connection strings, credential values, and customer/user data out of examples.

## Verify planning changes

1. Compare claims with relevant source, API contracts, tests, Bicep, Docker Compose, scripts, workflows, and observed Azure behavior.
2. Check for conflicting owners, duplicate statuses, unclear transactions, stale names, and implementation claims without evidence.
3. Confirm headings, relative links, and anchors.
4. Keep acceptance criteria observable at a user or system boundary. Separate automated checks from manual or external verification.
5. Run `git diff --check` when practical and report decisions changed, implementation/documentation mismatches, and intentionally deferred questions.
