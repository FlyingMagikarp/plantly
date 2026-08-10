# UC-001: Synchronize Species Definitions

## Status

Ready

## Goal

Synchronize Plantly's runtime species data with the authoritative species Markdown definitions so that valid additions, changes, and removals are reflected without rewriting unchanged species or allowing invalid definitions to leave partial updates.

## Preconditions

* A synchronization has been initiated by an HTTP request to Plantly's synchronization API endpoint.
* Plantly can access the authoritative set of species Markdown definitions under `docs/species/`.

## Behaviour

1. Plantly reads the authoritative set of species Markdown definitions from `docs/species/`, excluding `README.md` and `TEMPLATE.md`.
2. Plantly requires each species definition filename to follow the `SP-000-name.md` convention, where `000` is a permanent, unique three-digit species identifier and `name` is a concise kebab-case species name.
3. Plantly validates each definition against the structure and field rules documented in `docs/species/TEMPLATE.md` and `docs/species/README.md` before making any resulting species changes active.
4. Plantly uses the numeric filename identifier to identify and compare each valid definition with its corresponding runtime species, where one exists.
5. Plantly creates a species for each valid definition that has no corresponding runtime species.
6. Plantly updates each corresponding runtime species whose authoritative definition has changed.
7. Plantly leaves each corresponding runtime species unchanged when its authoritative definition has not changed.
8. Plantly archives each runtime species whose authoritative Markdown definition has been removed.
9. An archived species remains associated with existing plants but is unavailable for selection when adding or changing a plant's species.
10. If an archived species later has a valid authoritative Markdown definition, Plantly updates it from that definition and makes it active again.
11. Plantly makes all creations, updates, archival changes, and reactivations from the synchronization active as one complete result.
12. Plantly returns the synchronization outcome to the API caller: `204 No Content` after successful completion, `422 Unprocessable Content` after validation failure, or `500 Internal Server Error` after an unexpected failure. These responses have no body; detailed errors are written to application logs.

## Edge Cases

### Invalid definition

If any species Markdown definition is invalid, the synchronization fails. No species is created, updated, archived, or reactivated by that synchronization, including species represented by otherwise valid definitions.

### Invalid filename

Except for `README.md` and `TEMPLATE.md`, if a Markdown file under `docs/species/` does not follow the `SP-000-name.md` naming convention, validation fails and species data remains unchanged.

### Supporting Markdown files

Plantly ignores `docs/species/README.md` and `docs/species/TEMPLATE.md`. Their presence or contents do not participate in validation and do not cause synchronization to fail.

### Multiple definitions for one species

If multiple definitions use the same numeric species identifier, validation fails and species data remains unchanged.

### Reused identifier

A numeric species identifier permanently identifies one species and cannot be reused for a different species, including after its original species has been archived. Attempted reuse fails validation and species data remains unchanged.

### Optional notes

The `Notes` section and its entries are optional. A missing or empty `Notes` section is valid. All other fields shown in `docs/species/TEMPLATE.md` are required.

### Invalid temperature range

If the lower bound of `Temperature` is greater than its upper bound, validation fails and species data remains unchanged.

### Fertilizer inconsistent with seasonal phase

If a seasonal phase is `none`, its corresponding fertilizer value must be `none`. If a seasonal phase is `unknown`, its corresponding fertilizer value may be any accepted fertilizer value. A definition that violates these constraints is invalid.

### API failure response

A validation failure returns `422 Unprocessable Content`. An unexpected failure returns `500 Internal Server Error`. Neither response includes a body, and no species changes from the failed synchronization become active.

### No changed definitions

If every definition corresponds to an unchanged active runtime species and no runtime species definition has been removed, the synchronization succeeds without changing species data.

### Removed definition

If a runtime species has no corresponding authoritative Markdown definition, Plantly archives it. Existing plants retain their association with the archived species.

### Restored definition

If a valid definition corresponds to an archived runtime species, Plantly updates the species from the definition and makes it active again rather than creating a duplicate species.

### Synchronization failure

If the synchronization cannot complete, none of its proposed species creations, updates, archival changes, or reactivations become active.

## Postconditions

After successful synchronization:

* every new valid Markdown definition has a corresponding runtime species;
* every changed valid Markdown definition is reflected in its corresponding runtime species;
* runtime species corresponding to unchanged definitions retain their existing state;
* runtime species without an authoritative definition are archived;
* restored valid definitions reactivate their corresponding archived species; and
* all creations, updates, archival changes, and reactivations from the synchronization are active together.

After failed synchronization, species data remains as it was before that synchronization began.

## Business Rules

* BR-001 — Plant Species
* BR-006 — Moisture Preference
* BR-007 — Light Preference
* BR-008 — Temperature
* BR-009 — Seasonal Phases
* BR-010 — Seasonal Guidance
* BR-011 — Fertiliser Guidance
* BR-012 — Controlled Vocabulary
* BR-013 — Species Validation
* BR-014 — Special Care Information
* BR-017 — Species Identifier
* BR-018 — Species Archival
* BR-019 — Species Synchronization Atomicity

## Acceptance Criteria

* [ ] Given a valid Markdown definition for a species that does not exist in runtime data, when synchronization succeeds, then the species is created from that definition.
* [ ] Given a request to `POST /admin/species/sync`, when synchronization completes successfully, then the response is `204 No Content` with no response body.
* [ ] Given a request to `POST /admin/species/sync` containing any validation failure, when synchronization is rejected, then the response is `422 Unprocessable Content` with no response body and species data remains unchanged.
* [ ] Given a request to `POST /admin/species/sync` that encounters an unexpected failure, when synchronization fails, then the response is `500 Internal Server Error` with no response body and species data remains unchanged.
* [ ] Given species Markdown files under `docs/species/` whose filenames follow the `SP-000-name.md` convention, when synchronization is attempted, then those files are included in the authoritative set to be validated.
* [ ] Given `README.md` or `TEMPLATE.md` under `docs/species/`, when synchronization is attempted, then those files are ignored and do not cause validation or synchronization to fail.
* [ ] Given any other Markdown file under `docs/species/` whose filename does not follow the `SP-000-name.md` convention, when synchronization is attempted, then validation fails and species data remains unchanged.
* [ ] Given a valid changed Markdown definition for an existing species, when synchronization succeeds, then the existing species reflects the changed definition.
* [ ] Given a valid unchanged Markdown definition for an existing species, when synchronization succeeds, then that species remains unchanged.
* [ ] Given an active runtime species whose Markdown definition has been removed, when synchronization succeeds, then the species is archived.
* [ ] Given an archived species used by an existing plant, when synchronization succeeds, then the plant retains its association with that species.
* [ ] Given an archived species, when a species is selected for a new plant or as a replacement species for an existing plant, then the archived species is unavailable for selection.
* [ ] Given a valid definition corresponding to an archived species, when synchronization succeeds, then that species is updated and made active without creating a duplicate.
* [ ] Given a synchronization containing new, changed, removed, and restored valid definitions, when synchronization succeeds, then all corresponding changes become active together.
* [ ] Given any invalid Markdown definition, when synchronization is attempted, then the synchronization fails and no species is created, updated, archived, or reactivated by that attempt.
* [ ] Given multiple Markdown definitions that cannot be unambiguously associated with one species, when synchronization is attempted, then validation fails and species data remains unchanged.
* [ ] Given two definitions with the same numeric filename identifier, when synchronization is attempted, then validation fails and species data remains unchanged.
* [ ] Given an identifier belonging to an existing or archived species, when a definition attempts to reuse it for a different species, then validation fails and species data remains unchanged.
* [ ] Given a definition missing any field other than `Notes`, when synchronization is attempted, then validation fails and species data remains unchanged.
* [ ] Given a definition with a missing or empty `Notes` section, when synchronization is attempted, then the absence of notes does not cause validation to fail.
* [ ] Given a definition whose preferred temperature lower bound exceeds its upper bound, when synchronization is attempted, then validation fails and species data remains unchanged.
* [ ] Given a seasonal phase with the value `none` and a corresponding fertilizer value other than `none`, when synchronization is attempted, then validation fails and species data remains unchanged.
* [ ] Given a seasonal phase with the value `unknown` and any accepted fertilizer value, when synchronization is attempted, then that combination does not cause validation to fail.
* [ ] Given no added, changed, removed, or restored definitions, when synchronization succeeds, then no species data is changed.
* [ ] Given a failure before synchronization completes, when the failure is reported, then species data remains as it was before synchronization began.

## Out of Scope

* Maintaining species knowledge through the application UI; species knowledge can only be maintained through the authoritative Markdown definitions.
* Direct manipulation of PostgreSQL by synchronization tooling.
