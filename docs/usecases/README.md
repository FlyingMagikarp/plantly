# Use Cases

This directory contains the behavioural use-case specifications for Plantly.

Use cases describe what the application must do. They define expected behaviour and acceptance criteria without prescribing implementation details.

## Naming Convention

Use-case files follow this format:

```text id="xi40zp"
UC-000-title.md
```

Where:

* `UC` identifies the file as a use case.
* `000` is a unique, sequential three-digit identifier.
* `title` is a short kebab-case description of the use case.

Examples:

```text id="w944oh"
UC-001-create-species.md
UC-002-register-plant.md
UC-003-record-care-event.md
UC-004-import-species-from-markdown.md
```

Use-case identifiers must never be reused.

Renaming the descriptive part of a filename is allowed when the intent becomes clearer, but the numeric identifier remains unchanged.

## Status

Each use case has one of the following statuses:

* `Draft` — requirements are still being defined
* `Ready` — sufficiently defined for implementation
* `Implemented` — implementation is complete and validated
* `Superseded` — replaced by another use case or no longer applicable

A use case should normally be `Ready` before implementation begins.

## Scope

A use case should describe one coherent behavioural outcome.

Prefer several small use cases over one large use case covering multiple independent behaviours.

A use case should not contain:

* framework-specific implementation instructions
* database schema definitions
* API route design unless the route itself is part of the required external contract
* class or module names
* ORM-specific instructions
* frontend component structure
* speculative future functionality

Implementation details belong in the implementation process, architecture documentation, or ADRs.

## Relationship to Project Documentation

Use cases must respect the existing project documentation:

* `docs/product.md`
* `docs/domain.md`
* `docs/business-rules.md`
* `docs/architecture.md`
* applicable ADRs in `docs/decisions/`

Use cases should reference existing rules and decisions rather than duplicating them.

If a new use case requires a change to an existing product principle, domain concept, business rule, or architectural decision, that conflict must be resolved explicitly.

## Acceptance Criteria

Acceptance criteria must be:

* observable
* concrete
* testable
* independent of implementation details

Prefer Given / When / Then wording where practical.

Example:

```text id="7vr21i"
Given an existing plant
When the user records a watering without fertilizer
Then one watering care event is stored for that plant
And the event does not contain fertilizer information
```

Acceptance criteria define the contract used to judge whether the implementation is complete.

## Business Rules

Relevant business rules should be referenced by identifier.

Example:

```text id="pvasac"
- BR-003 — Historical Care Events
- BR-004 — Watering and Fertilization
```

Do not copy business-rule definitions into use cases unless additional use-case-specific clarification is required.

## Out of Scope

Use cases should explicitly exclude nearby functionality when there is a reasonable risk that implementation could expand beyond the intended scope.

Out-of-scope items are not future commitments. They only clarify the boundary of the current use case.

## Open Questions

A use case may remain in `Draft` while unresolved product or domain questions exist.

Open questions should be resolved before changing the status to `Ready` when they materially affect behaviour or acceptance criteria.

Implementation-level decisions do not normally belong in `Open Questions`.

## Lifecycle

The normal lifecycle is:

```text id="mzu4rg"
Draft
  ↓
Ready
  ↓
Implemented
```

Implemented use cases remain in this directory as historical documentation.

When a use case is replaced rather than modified, mark the old use case as `Superseded` and reference the replacement.

Do not delete implemented use cases solely because the implementation has changed.

## Changes to Implemented Use Cases

Small clarifications that do not change observable behaviour may be added to an implemented use case.

Changes to expected behaviour should normally result in either:

* a new use case describing the new behaviour, or
* an explicit revision of the existing use case when the original requirement itself was incorrect

Avoid silently rewriting historical requirements after implementation.
