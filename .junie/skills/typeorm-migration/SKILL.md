---
name: typeorm-migration
description: Safely create, review, and update TypeORM migrations for the Plantly NestJS/PostgreSQL project.
---

# TypeORM migration skill

Use this skill when:
- a TypeORM entity changes
- a database table, column, relation, enum, index, or constraint changes
- a migration must be created, reviewed, fixed, or explained
- migration execution fails and needs debugging

## Project context

This project uses:
- NestJS
- TypeORM
- PostgreSQL

The database schema is important and should be changed carefully.
Do not assume generated migrations are always correct.

## Goals

- Keep schema changes explicit and safe
- Avoid accidental data loss
- Keep entities and migrations aligned
- Prefer small, reviewable migrations
- Explain risky or destructive changes before applying them

## Working rules

1. Read the affected entity files first.
2. Check existing migrations before creating a new one.
3. Determine whether the change is:
    - additive
    - modifying
    - destructive
4. Prefer a focused migration for one change set.
5. Review generated migration code before trusting it.
6. Do not assume renames are detected correctly.
7. If a change may drop data, call it out explicitly.
8. Keep `up` and `down` methods meaningful and coherent.

## Required review checklist

Before finalizing a migration, check for:

- dropped tables
- dropped columns
- recreated columns that should actually be renamed
- enum recreation issues
- wrong nullability changes
- wrong default value changes
- broken foreign keys
- missing indexes
- accidental relation changes
- unintended cascade behavior
- data-loss risks in `down` migrations

## Special caution areas

### Renames
TypeORM may express a rename as drop + add.
When a field or table is being renamed, prefer an actual rename strategy if preserving data matters.

### Enums
PostgreSQL enums need extra care.
Do not casually drop and recreate enums if existing data depends on them.
Review enum migrations carefully.

### Nullability
Changing nullable to non-nullable can fail if existing rows do not satisfy the constraint.
Check whether existing data requires backfilling before applying the migration.

### Defaults
Be careful when adding or removing defaults.
Confirm whether the default is intended only for new rows or whether existing rows need updating too.

### Foreign keys and relations
Check that relation changes produce the expected foreign keys and delete/update behavior.
Do not introduce cascade behavior unless it is intentional.

## Migration workflow

When asked to create or update a migration:

1. Inspect the changed entities.
2. Inspect relevant old migrations.
3. Summarize what schema change is expected.
4. Create or draft the migration.
5. Review the migration line by line for accidental destructive behavior.
6. Confirm whether manual edits are needed.
7. Explain the final migration in plain language.

## Execution workflow

Before running a migration:
- check the configured data source
- check environment configuration
- check whether the migration is safe for existing data

After running a migration:
- confirm success
- verify the affected table/column/relation behavior if possible
- mention anything not verified

## Debugging workflow

When migration execution fails:

1. read the exact error carefully
2. identify whether the issue is:
    - environment/configuration
    - invalid generated SQL
    - PostgreSQL constraint or enum issue
    - existing data incompatible with the new schema
3. explain the root cause clearly
4. propose the smallest safe fix
5. avoid rewriting unrelated migrations unless necessary

## Things to avoid

Do not:
- blindly trust generated migrations
- mix unrelated schema changes into one migration
- drop and recreate structures when a safer change exists
- hide data-loss risks
- run destructive migration steps without clearly stating the impact
- modify old historical migrations unless explicitly required

## Expected output format

For migration tasks, provide:
1. expected schema change
2. migration summary
3. risks or destructive parts
4. whether manual review is still needed
5. how it should be validated

## Plantly-specific notes

The Plantly domain may include tables related to:
- plants
- species
- care logs
- care tips
- reminders/checks
- locations

Preserve domain clarity in table and column naming.
Do not oversimplify flexible care-log structures into rigid single-purpose schema designs unless explicitly requested.