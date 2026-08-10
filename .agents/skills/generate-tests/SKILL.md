---
name: generate-tests
description: Derive, implement, and run Plantly tests from a specified implemented Ready use case and its acceptance criteria. Use when asked to generate tests, validate a UC, cover acceptance criteria, or complete the testing workflow across Vitest unit tests, frontend or backend integration tests, disposable PostgreSQL, and selective Playwright E2E tests. Mark the UC Implemented only after complete successful validation.
---

# Generate Plantly Tests

Translate one implemented `Ready` use case into the smallest test suite that proves its observable contract. Select test levels by evidence needed, not by mechanically duplicating every acceptance criterion at every layer.

## Establish the Contract

1. Read `AGENTS.md`, the complete specified UC, `docs/usecases/README.md`, and `docs/usecases/UC-000-template.md`.
2. Require the UC to be `Ready` and its implementation to exist. If it is `Draft`, resolve its behavioral questions first. If implementation is missing, stop and direct implementation to `$implement-usecase`.
3. Read relevant product, domain, business-rule, architecture, UI, ADR, and dependent-use-case documentation.
4. Inspect the implementation, migrations, existing tests, Vitest configuration, package scripts, dependencies, and worktree. Preserve unrelated changes.
5. Treat acceptance criteria, edge cases, postconditions, referenced business rules, and preservation guarantees as the test contract.

Do not invent missing behavior through test expectations. Surface conflicts or ambiguous observable outcomes before writing tests.

## Build a Coverage Map

For each acceptance criterion, record:

- the observable guarantee;
- the primary test level that can prove the whole guarantee;
- narrower business-rule branches needing unit tests;
- fixtures and infrastructure required;
- the created test name and file.

Use the map to find gaps and duplication. Include it in the completion report; do not add permanent traceability files unless the repository later adopts that convention.

Group tests under `describe('UC-000: Title', ...)` where practical. Paraphrase Given/When/Then behavior in test names. Do not add UC identifiers to production code.

## Select the Test Level

Choose the lowest level that proves the complete observable guarantee.

### Unit

Use Vitest unit tests for deterministic domain rules, controlled vocabularies, parsers, mappings, seasonal calculations, formatting, and branching services that do not require real infrastructure.

Use frontend unit or component tests for presentational behavior and local interaction through Testing Library. Query by role, accessible name, label, or visible text.

Do not unit test Nest decorators, TypeORM behavior, Tailwind class lists, React internals, trivial accessors, or framework wiring. Mock architectural boundaries, not the subject under test.

### Integration

Use backend integration tests for HTTP boundary through Nest application behavior and TypeORM into real PostgreSQL. Cover validation, status and response contracts, relationships, constraints, transactions, preservation, missing resources, and invalid input. Do not mock TypeORM when persistence is part of the guarantee.

Use frontend integration tests with an in-memory React Router and MSW for route loaders, actions, fetchers, navigation, loading, empty, success, and recoverable error states. Mock the REST boundary, not backend internals. Use a direct `fetch` stub only for an isolated loader or action unit test.

### E2E

Use Playwright only when a browser-to-database workflow or interaction-cost requirement is important, such as quick watering, care rounds, adding a plant, or a cross-stack smoke path. Do not add E2E coverage for every validation branch or pure calculation.

If the first browser-critical UC requires E2E and Playwright is absent, add the smallest repository-integrated Playwright setup. Otherwise do not introduce an E2E framework speculatively.

## Establish Missing Test Infrastructure

Reuse existing infrastructure first. Add only what the selected tests require.

- Keep Vitest independently configured for frontend and backend.
- Keep tests colocated as `*.test.ts` and `*.test.tsx` unless an integration or E2E harness requires a clearly named test directory.
- Use Nest's testing module and Supertest for backend HTTP integration tests.
- Use Testcontainers to provision a disposable PostgreSQL instance. Apply real TypeORM migrations before tests.
- Never connect tests to Plantly v1, production, the development database, or a persistent/shared Compose volume.
- Reset database state between test files or suites. Do not rely only on per-test transaction rollback because application code may open transactions.
- Use MSW for frontend route integration tests.
- Use Playwright only under the E2E rule above.
- Add repository package scripts for new test categories and make root `npm test` include all non-E2E suites. Keep E2E separately invokable unless the repository explicitly chooses otherwise.

Install dependencies with repository package management and update lockfiles. Do not introduce a second test runner.

## Fixtures, Time, and Isolation

- Keep fixtures minimal and explicit.
- Prefer typed feature-local builders. Extract shared factories only after real repetition.
- Use Vitest fake timers or an injected clock for time-sensitive behavior. Never depend on wall-clock timing or timezone defaults.
- Make generated values deterministic.
- Avoid test order dependencies and production data.
- Keep each test focused on observable behavior rather than implementation details.

## Handle Failures and Production Code

Write tests against documented behavior, not against accidental implementation output.

When a valid test reveals an implementation defect:

- keep the failing test;
- do not silently change product behavior or acceptance criteria;
- report the failure and leave the UC `Ready`;
- direct behavioral fixes to `$implement-usecase`.

Allow a small production refactor only when it preserves behavior and is necessary for testability. Explain it explicitly. Do not weaken, skip, or delete tests to obtain a passing suite.

## Validate

Run the narrow affected suites during iteration, then run:

```text
npm test
npm run lint
npm run typecheck
npm run build
```

Also run backend integration and Playwright scripts when added or applicable. Confirm that every acceptance criterion and relevant business-rule branch appears in the coverage map and has passing evidence.

Do not introduce a numeric coverage threshold. Acceptance-criteria coverage and meaningful branch behavior define completeness.

## Update Lifecycle

Change the UC status from `Ready` to `Implemented` only when:

- every acceptance criterion has appropriate passing coverage;
- relevant edge cases, postconditions, and business rules are covered;
- all existing and generated tests pass;
- lint, type checking, and builds pass;
- required integration and E2E verification completed;
- no behavioral or infrastructure blocker remains.

Otherwise leave it `Ready` and report exact gaps. Do not check off individual acceptance-criteria boxes unless the project explicitly adopts that separate convention; status is the lifecycle signal.

## Report

Report:

- tests and infrastructure created;
- criterion-to-test coverage map;
- commands and results;
- implementation defects or uncovered behavior;
- any testability-only production refactor;
- whether the UC became `Implemented` or remains `Ready`, and why.
