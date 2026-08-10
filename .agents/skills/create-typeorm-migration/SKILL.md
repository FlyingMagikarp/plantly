---
name: create-typeorm-migration
description: Create, review, and safely verify a Plantly TypeORM migration for an accepted persistence change. Use when a Plantly use case or implementation changes entities, columns, constraints, indexes, relationships, enums, or stored data and requires schema evolution, including choosing between generated and handwritten migrations. Do not use for direct database edits or speculative schema design.
---

# Create Plantly TypeORM Migration

Create one focused migration for an already accepted schema or data change. Implement persistence evolution without deciding product behavior or inventing a domain model.

## Confirm the Change

1. Read `AGENTS.md`, `docs/architecture.md`, relevant domain and business rules, applicable ADRs, and the governing use case.
2. Inspect affected entities, existing migrations, `backend/src/database/data-source.ts`, package scripts, and the worktree.
3. Confirm the change is required by accepted behavior and the entity model represents the intended final state.
4. Identify preservation requirements, existing-data assumptions, nullability, defaults, uniqueness, foreign keys, indexes, and rollback consequences.

Stop when schema meaning is ambiguous. Never infer destructive retention, identifier, deletion, enum-storage, or historical-data policy merely to make generation succeed.

## Choose the Method

Prefer `migration:generate` when entity metadata can express a straightforward schema diff. Prefer `migration:create` for data backfills, transformations, preservation-sensitive renames, staged constraints or nullability, PostgreSQL-specific operations, and generated diffs that are destructive or ambiguous.

Generation is a starting point, never approval. Review and edit every generated migration.

Use root scripts with paths relative to `backend/`:

```text
npm run migration:generate -- src/database/migrations/<PascalCaseName>
npm run migration:create -- src/database/migrations/<PascalCaseName>
```

Use a concise PascalCase transition name and exclude unrelated schema changes.

## Review `up`

- Require every statement to serve the accepted change.
- Preserve existing rows and historical care data.
- Treat drops, truncation, lossy conversions, destructive defaults, and cascade changes as high risk.
- For a required column on a populated table, stage the change or perform an accepted deterministic backfill before `NOT NULL`.
- Preserve data by distinguishing renames from drop-and-recreate.
- Add appropriate database constraints without moving business behavior into persistence.
- Keep raw SQL narrow and PostgreSQL-compatible. Migration-owned transformations needed for schema evolution are allowed; operational imports or direct database manipulation are not.

## Review `down`

- Reverse `up` in dependency-safe order when safe.
- Do not pretend a lossy transformation is reversible. Report the limitation and require direction if a destructive rollback is expected.
- Avoid broad cascades unless the complete effect is understood and required.

## Verify Safely

1. Run backend type checking, linting, and build.
2. Inspect final migration source rather than trusting command success.
3. Use a disposable Plantly v2 database whose identity is explicitly confirmed.
4. Apply all migrations from a clean schema.
5. Inspect migration status and resulting schema as needed.
6. When `down` is safe, revert the new migration and apply it again.

Never roll back, drop schemas, or run destructive verification against an unidentified database, Plantly v1, production, or a shared database. If no disposable database exists, run static checks and report runtime verification pending.

Use repository commands:

```text
npm run migration:run
npm run migration:revert
npm run typecheck:backend
npm run lint:backend
npm run build:backend
```

Never enable `synchronize`.

## Report

Report the migration path and method, `up` transitions, rollback behavior and irreversibility, preservation safeguards, verified database identity without secrets, commands and results, and pending verification.
