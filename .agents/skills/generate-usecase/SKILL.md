# Generate Use Case

## Purpose

Generate a Plantly behavioral use-case specification from a user-provided feature or behavior description.

The generated use case must follow the project use-case template and conventions defined in:

* `docs/usecases/README.md`
* `docs/usecases/UC-000-template.md`

The completed use case must be stored under `docs/usecases/`.

## Input

A natural-language description of the desired feature or behavior.

The description may be incomplete.

## Required Context

Before generating a use case, read:

* `AGENTS.md`
* `docs/product.md`
* `docs/domain.md`
* `docs/business-rules.md`
* `docs/architecture.md`
* `docs/usecases/README.md`
* `docs/usecases/UC-000-template.md`
* relevant ADRs under `docs/decisions/`
* existing use cases under `docs/usecases/`

Use existing project terminology consistently.

Do not duplicate or contradict existing product principles, domain definitions, business rules, architectural decisions, or use cases.

## Process

### 1. Understand the Request

Identify:

* the desired outcome
* the behavior being requested
* relevant domain concepts
* relevant business rules
* likely preconditions
* expected successful outcome
* relevant edge cases
* explicit scope boundaries

Do not begin implementation.

Do not make implementation decisions.

### 2. Inspect Existing Use Cases

Inspect existing files under `docs/usecases/`.

Determine:

* whether the requested behavior already exists
* whether it overlaps with an existing use case
* whether an existing use case should be referenced
* the next available use-case identifier

Use-case identifiers are sequential and must never be reused.

### 3. Identify Missing Information

Do not invent requirements.

Distinguish between behavioral ambiguity and unspecified literal values.

#### Behavioral ambiguity

If missing information would materially change application behavior, scope, business rules, data meaning, or acceptance criteria, ask the user for clarification before generating the final use case.

Examples:

* What should happen when a referenced resource does not exist?
* Is an action allowed more than once?
* Should existing data be replaced or preserved?
* Is a field required or optional?
* Should an operation fail completely when part of the input is invalid?

Ask only questions that materially affect the specification.

Do not ask about implementation choices that can be decided during implementation.

#### Unspecified literal values

Do not block use-case generation for unspecified literal strings or values that do not materially affect behavior.

Use explicit placeholders instead.

Examples:

* `<VALIDATION_ERROR_MESSAGE>`
* `<SUCCESS_MESSAGE>`
* `<DEFAULT_NAME>`
* `<DISPLAY_LABEL>`

Placeholders must be clearly recognizable and must not look like finalized product copy.

Never invent user-facing copy merely to complete the specification.

### 4. Check Project Consistency

Verify the requested behavior against:

* product principles
* domain concepts
* business rules
* architectural decisions
* existing use cases

If the request conflicts with existing project documentation, do not silently resolve the conflict.

Explain the conflict and ask the user how it should be resolved.

If the request requires a new project-wide decision, identify that decision explicitly.

Do not create or modify an ADR unless explicitly requested.

### 5. Determine Scope

The use case should represent one coherent behavioral outcome.

If the input contains multiple independent behaviors that should reasonably be separate use cases, do not combine them into one large specification.

Identify the proposed split and ask the user before creating multiple use cases when the intended boundary is unclear.

Avoid including speculative future functionality.

### 6. Generate the Use Case

Generate the use case using:

`docs/usecases/UC-000-template.md`

Follow all conventions from:

`docs/usecases/README.md`

The specification must describe observable behavior rather than implementation.

Use references to existing business rules instead of copying their definitions.

Acceptance criteria must be concrete and testable.

Use Given / When / Then wording where practical.

Include relevant failure and edge-case behavior.

Explicitly identify nearby functionality as out of scope when there is a reasonable risk of scope expansion.

### 7. Assign Identifier and Filename

Determine the next available sequential use-case identifier from the existing files in `docs/usecases/`.

Use the naming convention:

`UC-000-title.md`

The title portion must:

* use kebab-case
* be concise
* describe the behavior
* avoid implementation terminology

Example:

`UC-003-record-watering.md`

Never reuse an existing identifier, including identifiers belonging to superseded use cases.

### 8. Set Status

New use cases default to:

`Draft`

A use case may be created as `Ready` only when:

* behavior is sufficiently defined
* no material product or domain questions remain
* acceptance criteria are complete and testable
* there are no unresolved conflicts with project documentation

If placeholders remain only for non-behavioral literal values, the use case may still be `Ready` when those values are not required for implementation.

### 9. Write the File

Write the completed specification to:

`docs/usecases/UC-000-title.md`

Do not overwrite an existing use case.

Do not modify unrelated use cases.

### 10. Report the Result

After creating the file, report:

* created use-case identifier
* file path
* status
* any placeholders used
* any important assumptions explicitly supplied by the user
* any follow-up decisions that remain

Keep the report concise.

## Specification Rules

### Do

* describe behavior
* use existing domain terminology
* reference business rules by identifier
* define observable outcomes
* include meaningful edge cases
* create testable acceptance criteria
* preserve explicit user requirements
* use placeholders for undefined literal values
* ask questions when behavior is ambiguous
* keep use cases focused

### Do Not

* invent requirements
* invent business rules
* invent user-facing copy
* prescribe implementation
* define database schemas
* define TypeORM entities
* choose API routes unless externally required
* choose React components
* choose NestJS modules or services
* introduce authentication or multi-user behavior
* introduce speculative functionality
* silently resolve documentation conflicts
* modify project-wide documentation without explicit instruction

## Completion Criteria

The skill is complete when:

* the request has been understood
* material ambiguities have been resolved or explicitly remain as open questions
* the use case follows the project template
* relevant business rules are referenced
* acceptance criteria are testable
* the identifier is unique and sequential
* the filename follows project conventions
* the use-case file exists under `docs/usecases/`
* no unrelated files have been modified
