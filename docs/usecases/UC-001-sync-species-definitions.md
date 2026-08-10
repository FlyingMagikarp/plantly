# UC-001: Synchronize Species Definitions

## Status

Draft

## Goal

Synchronize Plantly's runtime species data with the authoritative species Markdown definitions so that valid additions and changes become active without rewriting unchanged species or allowing invalid definitions to leave partial updates.

## Preconditions

* A synchronization has been initiated through an available synchronization mechanism.
* Plantly can access the authoritative set of species Markdown definitions under `docs/species/`.

## Behaviour

1. Plantly reads the authoritative set of species Markdown definitions from `docs/species/`, excluding `README.md` and `TEMPLATE.md`.
2. Plantly requires each species definition filename to follow the `SP-000-name.md` convention, where `000` is a three-digit species identifier and `name` is a concise kebab-case species name.
3. Plantly validates all definitions before making any resulting species changes active.
4. Plantly compares each valid definition with the corresponding runtime species, where one exists.
5. Plantly creates a species for each valid definition that has no corresponding runtime species.
6. Plantly updates each corresponding runtime species whose authoritative definition has changed.
7. Plantly leaves each corresponding runtime species unchanged when its authoritative definition has not changed.
8. Plantly makes all creations and updates from the synchronization active as one complete result.
9. Plantly reports whether the synchronization succeeded or failed.

## Edge Cases

### Invalid definition

If any species Markdown definition is invalid, the synchronization fails. No species is created or updated by that synchronization, including species represented by otherwise valid definitions.

### Invalid filename

Except for `README.md` and `TEMPLATE.md`, if a Markdown file under `docs/species/` does not follow the `SP-000-name.md` naming convention, validation fails and no species is created or updated.

### Supporting Markdown files

Plantly ignores `docs/species/README.md` and `docs/species/TEMPLATE.md`. Their presence or contents do not participate in validation and do not cause synchronization to fail.

### Multiple definitions for one species

If the authoritative set cannot unambiguously identify one definition for each species, validation fails and no species is created or updated.

### No changed definitions

If every definition corresponds to an unchanged runtime species, the synchronization succeeds without changing species data.

### Synchronization failure

If the synchronization cannot complete, none of its proposed species creations or updates become active.

## Postconditions

After successful synchronization:

* every new valid Markdown definition has a corresponding runtime species;
* every changed valid Markdown definition is reflected in its corresponding runtime species;
* runtime species corresponding to unchanged definitions retain their existing state; and
* all creations and updates from the synchronization are active together.

After failed synchronization, species data remains as it was before that synchronization began.

## Business Rules

* BR-006 — Moisture Preference
* BR-007 — Light Preference
* BR-008 — Temperature
* BR-009 — Seasonal Phases
* BR-010 — Seasonal Guidance
* BR-011 — Fertiliser Guidance
* BR-012 — Controlled Vocabulary
* BR-013 — Species Validation
* BR-014 — Special Care Information

## Acceptance Criteria

* [ ] Given a valid Markdown definition for a species that does not exist in runtime data, when synchronization succeeds, then the species is created from that definition.
* [ ] Given species Markdown files under `docs/species/` whose filenames follow the `SP-000-name.md` convention, when synchronization is attempted, then those files are included in the authoritative set to be validated.
* [ ] Given `README.md` or `TEMPLATE.md` under `docs/species/`, when synchronization is attempted, then those files are ignored and do not cause validation or synchronization to fail.
* [ ] Given any other Markdown file under `docs/species/` whose filename does not follow the `SP-000-name.md` convention, when synchronization is attempted, then validation fails and species data remains unchanged.
* [ ] Given a valid changed Markdown definition for an existing species, when synchronization succeeds, then the existing species reflects the changed definition.
* [ ] Given a valid unchanged Markdown definition for an existing species, when synchronization succeeds, then that species remains unchanged.
* [ ] Given a synchronization containing both new and changed valid definitions, when synchronization succeeds, then all corresponding creations and updates become active together.
* [ ] Given any invalid Markdown definition, when synchronization is attempted, then the synchronization fails and no species is created or updated by that attempt.
* [ ] Given multiple Markdown definitions that cannot be unambiguously associated with one species, when synchronization is attempted, then validation fails and species data remains unchanged.
* [ ] Given no new or changed definitions, when synchronization succeeds, then no species data is changed.
* [ ] Given a failure before synchronization completes, when the failure is reported, then species data remains as it was before synchronization began.

## Out of Scope

* Maintaining species knowledge through the application UI; species knowledge can only be maintained through the authoritative Markdown definitions.
* Direct manipulation of PostgreSQL by synchronization tooling.

## Open Questions

The use case must remain in `Draft` until these decisions are defined:

* What mechanism or event triggers synchronization?
* What happens to a runtime species when its Markdown definition is removed from `docs/species/`?
* What content structure must each species Markdown definition follow, including its required and optional fields?
* What controlled vocabularies, beyond those already established by business rules, are accepted during validation?
