---
name: bootstrap-project
description: >
  Bootstrap the Plantly v2 repository into a runnable application according to
  the documented architecture. Use when initializing or rebuilding the project
  structure, frontend, backend, PostgreSQL connectivity, Docker Compose,
  migrations, testing, linting, or baseline development tooling before
  implementing product use cases.
---

# Bootstrap Plantly

## Purpose

Turn the documented Plantly architecture into a runnable empty application.

This skill establishes the technical foundation required before behavioral use
cases are implemented.

Bootstrap work must not introduce product functionality beyond what is required
to verify that the application stack is correctly connected and runnable.

## Required Context

Before making changes, read:

* `AGENTS.md`
* `README.md`
* `docs/product.md`
* `docs/domain.md`
* `docs/business-rules.md`
* `docs/architecture.md`
* relevant ADRs under `docs/decisions/`

Inspect the existing repository before creating or replacing files.

Do not assume the repository is empty.

Preserve existing project documentation and unrelated files.

## Target Architecture

Use the current stable major version of each framework unless a version
constraint is documented in the project architecture.

Once dependencies are installed, the package manifest and lockfile are
authoritative for exact versions.

Do not upgrade major versions during later use-case implementation without
an explicit architectural decision.

The bootstrapped project must use:

### Frontend

* React
* React Router
* TypeScript

### Backend

* Node.js
* NestJS
* TypeScript
* REST API

### Persistence

* PostgreSQL
* TypeORM
* TypeORM migrations

### Deployment

* Docker
* one Docker Compose configuration containing:

    * frontend
    * backend
    * PostgreSQL

### Testing

Use Vitest as the default JavaScript/TypeScript test runner unless an existing
repository constraint makes it unsuitable.

Testing must be configured independently for frontend and backend where their
runtime requirements differ.

The bootstrap only needs to prove that tests can run. Comprehensive behavioral
tests are created by later workflows.

## Process

### 1. Inspect Repository State

Inspect:

* current directory structure
* package configuration
* existing frontend/backend code
* Docker configuration
* environment files
* TypeORM configuration
* test configuration
* linting and formatting configuration

Do not overwrite working infrastructure without a concrete reason.

Report any conflict between the repository and documented architecture before
making a project-wide architectural change.

### 2. Scaffold Frontend

Create the React Router frontend using TypeScript.

The frontend must:

* start successfully in development mode
* build successfully
* support React Router route modules
* have linting configured
* have type checking configured
* have Vitest configured
* contain at least one minimal test proving the test runner works

Do not implement Plantly domain screens during bootstrap.

A minimal placeholder application is sufficient.

### 3. Establish Frontend Data Pattern

Use React Router's route data APIs as the default application pattern.

Route-level data loading should use loaders.

Route-associated mutations should use actions where appropriate.

Do not introduce custom fetching hooks or `useEffect`-based route data loading
as the default pattern.

Implementation-specific patterns may later be expanded in the
`implement-usecase` skill or dedicated engineering reference documentation.

### 4. Scaffold Backend

Create the NestJS backend using TypeScript.

The backend must:

* start successfully in development mode
* build successfully
* expose a minimal health endpoint
* have linting configured
* have type checking configured
* have Vitest configured
* contain at least one minimal test proving the test runner works

Do not create Species, Plant, Location, CareEvent, or other product-domain
modules during bootstrap unless required by an already accepted use case.

### 5. Configure PostgreSQL

Configure Plantly v2 to use a clean PostgreSQL database separate from the
existing Plantly v1 data.

Use a database such as:

`plantlyv2`

Do not modify, delete, or migrate the Plantly v1 schema during bootstrap.

Database credentials and connection details must come from environment
configuration.

### 6. Configure TypeORM

Configure NestJS and TypeORM to connect to the Plantly v2 PostgreSQL database.

Establish migration infrastructure.

Schema synchronization must not be used as the deployment strategy.

Provide repository commands for:

* running migrations
* reverting migrations
* generating or creating migrations, depending on the adopted project pattern

Do not create speculative domain tables during bootstrap.

The first domain schema migration should be introduced by the first use case
that requires persistence.

### 7. Configure Docker Compose

Create or update a single Docker Compose configuration that starts:

* frontend
* backend
* PostgreSQL

The services must be able to communicate using the Compose network.

Persistent PostgreSQL data must use a Docker volume.

Image/file storage volumes should only be added if required by current
architecture or an accepted use case.

The complete application must be startable with a simple documented command.

### 8. Configure Environment

Provide example environment configuration where required.

Do not commit secrets.

Document required variables.

Local and containerized execution should use consistent variable names where
practical.

### 9. Establish Baseline Testing

Configure Vitest for frontend and backend.

Bootstrap tests should remain intentionally minimal.

At minimum verify:

Frontend:

* the test runner executes successfully
* a simple component or route-level unit test can run

Backend:

* the test runner executes successfully
* a simple service/controller or health behavior can be tested

Do not attempt to generate comprehensive product tests during bootstrap.

Do not introduce a browser E2E framework unless required by a concrete use
case or testing decision.

### 10. Establish Baseline Quality Commands

Provide working repository commands for relevant tasks such as:

* development
* build
* test
* lint
* typecheck
* migration execution
* Docker Compose startup/shutdown

Prefer conventional package scripts that can later be invoked by agents.

Commands must actually exist and work before being documented as available.

### 11. Verify Application Connectivity

Verify:

* PostgreSQL starts successfully
* backend starts successfully
* backend connects to PostgreSQL
* frontend starts successfully
* frontend can reach the backend
* health endpoint responds successfully
* frontend build succeeds
* backend build succeeds
* frontend tests pass
* backend tests pass
* linting/type checking succeeds where configured

Do not consider bootstrap complete if the documented happy-path environment
cannot start.

### 12. Update Project Documentation

After bootstrap succeeds, update:

`README.md`

with actual commands for:

* local startup
* Docker Compose startup/shutdown
* frontend development
* backend development
* testing
* building
* linting
* type checking
* migrations

Update `AGENTS.md` only where concrete repository structure or commands can now
replace placeholders.

Do not duplicate architecture documentation unnecessarily.

## Repository Structure

Prefer a simple structure such as:

```text
/
├── frontend/
├── backend/
├── docs/
├── species/
├── .agents/
├── docker-compose.yml
├── AGENTS.md
└── README.md
```

Do not introduce monorepo tooling solely for organizational convenience unless
there is a concrete benefit.

## Testing Principles

Bootstrap establishes the test infrastructure, not complete application
coverage.

Use the following baseline principles:

* behavior should be testable without depending on implementation details
* business logic should be testable independently from React rendering
* backend business logic should be testable independently from PostgreSQL where
  practical
* integration tests may use real application boundaries when that provides
  meaningful confidence
* mocks should be used deliberately rather than automatically
* tests must not depend on production data
* tests must be deterministic
* bug fixes should later receive regression tests

A separate testing skill may define how acceptance criteria from implemented
use cases are translated into tests.

## Bootstrap Boundaries

### In Scope

* project scaffolding
* framework configuration
* TypeScript configuration
* PostgreSQL connectivity
* TypeORM setup
* migration infrastructure
* Docker Compose
* health endpoint
* baseline testing
* linting
* type checking
* build scripts
* development scripts
* documentation of working commands

### Out of Scope

* Species domain implementation
* Plant domain implementation
* care-event implementation
* locations
* images
* seasonal behavior
* species Markdown import logic
* analytics
* authentication
* user accounts
* production data migration from Plantly v1
* product UI beyond a minimal runnable placeholder

## Completion Criteria

Bootstrap is complete when:

* the frontend exists and runs
* the backend exists and runs
* PostgreSQL v2 exists and is reachable
* TypeORM connects successfully
* migration tooling is operational
* Docker Compose starts the complete stack
* backend health verification works
* frontend and backend build successfully
* baseline frontend and backend tests pass
* linting and type checking work
* documented commands match actual repository commands
* no Plantly product use case has been implemented accidentally
* existing Plantly v1 data remains untouched

## Report

After completing the bootstrap, report:

* files and applications created
* commands added
* database configuration established
* test setup selected
* checks performed
* any deviations from `docs/architecture.md`
* any unresolved technical decisions
