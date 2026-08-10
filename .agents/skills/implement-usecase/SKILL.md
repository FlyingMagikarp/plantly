---
name: implement-usecase
description: Implement a specified Ready Plantly use case end-to-end across the React Router frontend, NestJS REST API, application and domain logic, TypeORM persistence, and documentation. Use when asked to implement, build, or complete a UC under docs/usecases. Exclude creation of new tests because that belongs to the separate testing workflow, but run existing quality checks and preserve testability.
---

# Implement Plantly Use Case

Implement only the behavior required by one specified use case. Keep the use case at `Ready`; the separate testing and validation workflow decides when to mark it `Implemented`.

## Establish the Contract

1. Read `AGENTS.md` and the complete specified use-case file.
2. Require status `Ready`. Do not implement a `Draft`, `Superseded`, or already `Implemented` use case unless the user explicitly resolves the lifecycle mismatch.
3. Read `docs/product.md`, `docs/domain.md`, `docs/business-rules.md`, `docs/architecture.md`, `docs/ui-design.md` when UI is affected, applicable ADRs, and dependent use cases.
4. Treat acceptance criteria, behavior, edge cases, postconditions, and out-of-scope statements as the contract.
5. Inspect the worktree, relevant source, entities, migrations, routes, dependencies, scripts, and existing tests. Preserve unrelated user changes.

If the use case conflicts with authoritative documentation, remains behaviorally ambiguous, or requires an undecided project-wide convention, identify the exact issue and stop before encoding it in code.

## Plan the Smallest Complete Change

Map each acceptance criterion to only the affected boundaries:

- frontend route, loader, action, fetcher, and UI state;
- REST controller and boundary input/output;
- application or domain behavior and business-rule enforcement;
- TypeORM entity, repository access, transaction, and migration;
- configuration or documentation.

Reuse established feature-local patterns. Do not introduce speculative layers, generic repositories, shared component systems, API clients, state libraries, services, or infrastructure. When no local pattern exists, choose the smallest explicit design local to the use case.

## Implement the Backend

- Add a feature module under `backend/src/<feature>/` when introducing a product feature and register it with `AppModule`.
- Keep controllers limited to HTTP concerns and delegate behavior to injectable services.
- Keep business rules out of controllers and persistence details out of domain logic where practical.
- Validate external input at the application boundary. Reuse the repository mechanism. If none exists and runtime validation is required, surface the project-wide validation decision before adding a library or global convention.
- Use REST resources beneath the existing `/api` prefix. Reuse status, error, and serialization conventions; do not establish a global contract accidentally.
- Access PostgreSQL through NestJS and TypeORM only.
- Use a transaction for promised all-or-nothing multi-write behavior.
- Preserve historical care data and unrelated state.

## Implement Persistence

- Add entities and relationships only for required data.
- Do not enable schema synchronization.
- Represent every schema change with a migration under `backend/src/database/migrations/`.
- Invoke `$create-typeorm-migration` when available. Otherwise use repository scripts, review SQL, protect data, and verify safe reversibility.
- Do not invent identifier, deletion, enum-storage, timestamp, or metadata conventions when the choice materially affects future behavior. Surface the missing decision.

## Implement the Frontend

- Use React Router loaders for reads and actions or fetchers for route mutations.
- Do not use `useEffect` fetching as the default route-data pattern.
- Keep API communication at route-data boundaries and business rules authoritative in the backend.
- Use Tailwind utilities and reuse components before adding a narrowly justified reusable component.
- Follow `docs/ui-design.md`: mobile first, minimal interactions, optional progressive detail, accessible labels, recoverable errors, and unobtrusive success feedback.
- Add only the loading, empty, error, and success states required by the use case. Do not redesign unrelated screens.

## Testing Boundary

Do not create, rewrite, or expand tests. Test creation belongs to the separate testing skill.

Still inspect and run existing tests, preserve testability, and never remove, weaken, skip, or alter tests merely to pass validation. Report acceptance criteria that remain unverified until the testing workflow runs. If tests are explicitly requested too, use the separate testing skill when it exists.

## Validate

Use repository scripts and run as applicable:

```text
npm run build
npm test
npm run lint
npm run typecheck
```

For migrations, perform the safe verification required by `$create-typeorm-migration`. Never use an unidentified or shared database for destructive verification. Exercise implemented boundaries directly when practical, but do not claim full acceptance validation without separate behavioral tests.

## Documentation and Lifecycle

- Update documentation only for intentional domain, business, architecture, UI, or development-convention changes.
- Do not change the use-case status from `Ready` to `Implemented`; leave that to the testing and validation workflow.

## Report

Report affected boundaries, significant choices and assumptions, migration verification, commands and results, acceptance criteria awaiting tests, unresolved issues, and confirmation that the use case remains `Ready`.
