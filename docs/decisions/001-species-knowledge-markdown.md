# ADR-001: Store Species Knowledge as Markdown

## Status

Accepted

## Context

Species information needs to be easy to create and maintain.

The previous version of Plantly required species information to be entered and maintained through the application. This creates unnecessary UI and makes adding species cumbersome.

The project also uses coding agents that can efficiently create and update structured Markdown files.

## Decision

Species knowledge will be maintained as Markdown files in the repository.

The application database will contain the runtime representation of species data.

Species Markdown files must be validated and imported through the application boundary before changes become active application data.

## Consequences

### Positive

* Species information is easy to create and edit.
* Agents can maintain species information without requiring a dedicated administration UI.
* Species knowledge is version controlled.
* Changes can be reviewed through Git.
* The application does not require a complex species-management interface.

### Negative

* An import mechanism is required.
* Markdown and database state can temporarily differ.
* Validation is required before importing data.

## Alternatives Considered

### Manage species entirely through the application

Rejected because it requires additional UI and makes species maintenance more cumbersome.

### Allow agents to modify the database directly

Rejected because this bypasses application validation and business rules.
