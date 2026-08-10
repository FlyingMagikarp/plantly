# Codex Agent Instructions

## Project Overview

Plantly is a single-user personal plant collection and care logging application.

The application focuses on simple species knowledge, fast care-event logging, seasonal care guidance, and preserving historical data for future analysis.

Before making architectural or domain decisions, read the relevant documentation in `docs/`.

## Required Documentation

The following documents define the project:

* `docs/product.md` — product purpose and principles
* `docs/domain.md` — domain concepts and relationships
* `docs/business-rules.md` — application business rules
* `docs/architecture.md` — architecture and technical decisions
* `docs/ui-design.md` — UI design principles and visual language

Do not duplicate or contradict decisions defined in these documents.

If an implementation requires a decision not covered by existing documentation, identify the missing decision rather than silently inventing a new project-wide convention.

## Technology Stack

### Frontend

* React
* React Router
* TypeScript

### Backend

* Node.js
* NestJS
* TypeScript
* TypeORM
* REST API

### Persistence

* PostgreSQL
* TypeORM migrations

### Deployment

* Docker
* Docker Compose
* Single Compose deployment containing frontend, backend, and database

## Repository Structure

The repository is organised around the frontend, backend, documentation, species definitions, and AIUP workflow artefacts.

Keep frontend and backend concerns separated.

Do not introduce additional applications, services, or infrastructure without a concrete requirement.

## Architecture

Plantly uses a modular monolith architecture.

The primary application data flow is:

```text
React Router frontend
        ↓
NestJS REST API
        ↓
Application/domain logic
        ↓
TypeORM
        ↓
PostgreSQL
```

Species knowledge follows a separate ingestion flow:

```text
Species Markdown
        ↓
validation/import
        ↓
NestJS application boundary
        ↓
TypeORM
        ↓
PostgreSQL
```

Agents, scripts, and import tooling must not manipulate the PostgreSQL database directly.

## Development Workflow

Development follows the project's AIUP workflow.

Implement work from defined use cases rather than broad feature descriptions where possible.

Before implementing a use case:

1. Read the use case completely.
2. Read the relevant project documentation.
3. Inspect the existing implementation and tests.
4. Identify affected domain concepts and business rules.
5. Implement only the scope required by the use case.

Do not add speculative functionality for possible future requirements.

When a use case conflicts with existing project documentation, surface the conflict rather than silently choosing one interpretation.

## Database Changes

All database schema changes must use TypeORM migrations.

Do not:

* use automatic schema synchronisation as a deployment strategy
* manually modify production database schemas
* allow import scripts or agents to bypass application validation

Preserve historical care data unless an explicit requirement says otherwise.

## Testing

New behaviour should be covered by automated tests at the appropriate level.

Prefer testing observable behaviour and business rules over implementation details.

Bug fixes should include a regression test when practical.

Do not remove or weaken existing tests solely to make a new implementation pass.

## Build and Validation

Before considering an implementation complete:

* install dependencies if required
* build affected applications
* run relevant tests
* run linting and type checking where configured
* verify database migrations when schema changes are introduced

Use repository-defined package scripts rather than inventing alternative commands.

## Conventions

* Use TypeScript for frontend and backend application code.
* Follow existing formatting and linting configuration.
* Prefer explicit, understandable code over unnecessary abstractions.
* Keep business rules out of React components.
* Keep persistence-specific behaviour out of domain logic where practical.
* Validate data at application boundaries.
* Reuse existing patterns before introducing new ones.
* Avoid speculative abstractions and premature generalisations.
* Do not design for hypothetical multi-user support.
* Do not introduce authentication, authorisation, users, roles, or tenancy.
* Keep routine care-event logging simple and inexpensive for the user.

## Documentation

Update documentation when an implementation intentionally changes an architectural decision, domain concept, business rule, or established development convention.

Do not change project-wide documentation merely to make an implementation conform to an accidental implementation detail.

Significant architectural decisions should be documented explicitly rather than existing only in code.

## Agent Behaviour

When working in this repository:

* inspect before modifying
* prefer small, focused changes
* preserve unrelated behaviour
* do not silently expand scope
* do not invent requirements
* explain important assumptions
* surface contradictions or missing decisions
* use existing project terminology consistently
* keep generated code maintainable by a human developer
