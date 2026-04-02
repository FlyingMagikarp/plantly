# Plantly – Junie Guidelines

## Product Goal
Plantly is a plant care web application.

It aims to provide a simple and intuitive way to manage your plants.

The app will only be used by the admin and no other users

Care Tips for species will be updated manually.

Plants can be added, with location and name.

Care logs can be added for each plant.

Care logs can be checked.

The app will automatically create reminders for watering, checking up and recommend other actions like repotting depending on the current season.

The app will also provide a smart recommendation system based on the care logs.



## Project overview

Current stack:
- Backend: NestJS
- ORM: TypeORM
- Database: PostgreSQL
- Frontend: React Router v7 + TypeScript
- Validation: Zod on the frontend
- Styling: Tailwind CSS v4

Main domain areas:
- plants
- species
- care logs
- reminders / checks
- user-contributed care tips
- locations

The goal is a maintainable, production-suitable codebase with clear domain boundaries.
The Application will be used by a single user, so no authentication is required.
---

## General working style

When working on non-trivial tasks:

1. Read the relevant files first.
2. Identify the existing pattern before introducing a new one.
3. Summarize the intended approach before making large changes.
4. Prefer small, reviewable edits over large speculative refactors.
5. Reuse existing conventions whenever possible.
6. After changes, verify the result with the appropriate tests or checks.
7. Clearly state assumptions, limitations, and anything not verified.

Do not make broad architectural changes unless explicitly asked.

---

## Core engineering principles

- Prefer explicit, readable code over clever abstractions.
- Keep the domain model clear and understandable.
- Avoid unnecessary indirection.
- Avoid introducing generic utility abstractions unless there is clear repeated usage.
- Keep files cohesive and focused.
- Preserve consistency with the existing codebase over personal style preferences.

---

## Architecture rules

### Backend
- Keep the backend under the folder `plantly/plantly-backend`.
- Use feature-based NestJS modules.
- Keep controllers thin.
- Put business and domain logic in services.
- Keep persistence concerns out of controllers.
- Avoid mixing transport logic, business logic, and DB logic in one place.
- Keep DTOs explicit and validated.
- Prefer predictable and simple service flows over “magic”.

### Frontend
- Keep the frontend under the folder `plantly/plantly-frontend`.
- Use TypeScript everywhere.
- Prefer existing React Router v7 patterns already present in the project.
- Keep components focused and composable.
- Keep form logic explicit.
- Use Zod for frontend validation where applicable.
- Do not introduce state management libraries unless clearly needed.
- Prefer server-driven data flow patterns already used in the app.

### Shared
- Keep backend and frontend contracts aligned.
- When changing request/response shapes, update types and validation accordingly.
- Avoid silent contract drift between frontend and backend.

---

## Domain-specific rules

The plant domain is important. Do not flatten or oversimplify it.

### Species vs user data
- Species care information is structured reference data.
- Care-tips can be added for a specific plant instance and should be kept separate from the species data.

### Plant lifecycle
Plants may have lifecycle and activity states such as:
- active
- inactive
- removed
- dead

Preserve lifecycle history and avoid destructive simplifications.
If changing lifecycle logic, explain the implications clearly.

### Care logs
Care logs may include multiple event types, such as:
- watering
- fertilizing
- pruning
- repotting
- check

Do not hardcode assumptions that only one care event type exists.
Do not design the system in a way that makes future log expansion difficult.

### Check/reminder logic
- A "check" is a valid domain event.
- Reminder logic should remain understandable and deterministic.
- Do not bury reminder rules in scattered helper functions.
- Prefer explicit rules and clear naming.

### Metric units
- The project uses metric units only.
- Do not introduce imperial units unless explicitly requested.

---

## Database and TypeORM rules

- PostgreSQL is the source of truth.
- Use TypeORM in a predictable and explicit way.
- Use migrations to manage schema changes.
- Make sure to always include a down migration.
- Keep entities and migrations aligned.
- Prefer explicit migrations over hidden schema drift.
- Review generated migrations before trusting them.
- Be careful with enum changes, renames, and destructive schema edits.
- Do not silently drop or recreate columns/tables unless explicitly intended.
- If a migration may cause data loss, explain it clearly.

When changing persistence:
1. inspect related entities
2. inspect existing migrations
3. identify whether the change is additive, modifying, or destructive
4. update code and migration coherently
5. note any data migration implications

---

## Testing and verification
Add test cases for essential use-cases when they are part of the feature being implemented, especially for important backend service logic and core user flows such as creating a new plant.

For non-trivial backend logic:
- add or update tests where appropriate
- prefer tests for service/domain logic
- do not rely only on compilation as proof of correctness

For frontend changes:
- verify the flow matches the existing UX and routing patterns
- ensure validation and error states are handled clearly

When claiming a task is complete, verify using the most relevant checks available, such as:
- lint
- unit tests
- integration tests
- type checks
- build
- application startup when relevant

If something could not be verified, say so explicitly.

---

## Commands and validation

Before running commands, inspect the repo and use the existing scripts rather than inventing new ones.

Typical categories of commands:
- install dependencies
- run tests
- lint
- type check
- run migrations
- start backend/frontend locally

Prefer the project’s existing npm scripts and configuration.

Do not run destructive commands unless clearly needed and approved.

Examples of destructive or risky actions:
- dropping or resetting the database
- deleting migrations
- force-overwriting large parts of the codebase
- mass renames or broad refactors unrelated to the task

---

## Code style expectations

- Follow existing naming conventions.
- Use descriptive names.
- Avoid overly short variable names unless conventional.
- Avoid introducing a new architectural style inside one feature.
- Keep functions and classes reasonably focused.
- Prefer explicit return shapes over ambiguous dynamic objects.
- Do not add comments for obvious code.
- Add comments only where logic or intent is non-obvious.

---

## Dependency rules

- Do not add new dependencies without a clear benefit.
- Prefer existing libraries already used in the project.
- If adding a dependency, explain why it is needed.
- Avoid adding libraries for trivial helper functionality.

---

## Refactoring rules

Refactor only when:
- it directly supports the requested task
- it reduces clear duplication
- it fixes a real design issue

Do not perform repo-wide cleanup unless explicitly asked.
Do not mix feature work with large unrelated cleanup.

If you notice a larger issue outside the requested task:
- mention it
- keep the current change scoped
- do not automatically expand the task

---

## UI and frontend styling rules

- Follow existing Tailwind CSS v4 conventions.
- Reuse existing component patterns where possible.
- Keep styling consistent with the rest of the app.
- Do not introduce a different UI styling philosophy inside one feature.
- Prefer clean, functional UI over unnecessary visual complexity.

---

## Error handling

- Fail clearly, not silently.
- Prefer understandable validation and domain errors.
- Do not swallow backend errors without reason.
- Keep error messages useful for debugging, but do not leak secrets or sensitive data.

---

## What to avoid

Do not:
- invent new requirements
- make speculative architecture changes
- replace existing patterns without reason
- weaken security behavior for convenience
- perform large refactors unrelated to the task
- add dependencies casually
- hide important assumptions
- claim something was verified when it was not

---

## Preferred task completion format

For larger tasks, provide:
1. what was changed
2. why it was changed
3. files affected
4. how it was verified
5. any assumptions, risks, or follow-up items

---

## Project-specific intent

This project should remain:
- understandable by one developer
- production-suitable
- easy to evolve over time
- domain-driven enough to preserve plant care concepts
- simple where possible, but not oversimplified

When in doubt:
- choose clarity over cleverness
- choose consistency over novelty
- choose safe incremental changes over broad rewrites

---

## Efficiency and scope control

- Prefer small, focused tasks over broad multi-feature requests.
- For larger work, first propose a plan, then implement only one step at a time.
- Inspect only the files and modules relevant to the current task.
- Avoid repo-wide analysis unless explicitly requested.
- Keep summaries concise unless a detailed explanation is requested.
- Prefer the most relevant validation command(s) only.
- Do not run every possible test or command after small changes.
- When debugging, analyze provided stack traces or error output before running additional commands.
- Avoid speculative refactors, cleanup, or future-proofing unless explicitly requested.