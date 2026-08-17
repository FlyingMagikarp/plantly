# UC-029: Define Seasonal Fertilizer Guidance

## Status

Draft

## Goal

Allow fertilizer guidance to be represented for a species seasonal phase and synchronized as authoritative species knowledge.

## Preconditions

* The species has an authoritative Markdown definition governed by ADR-001.
* The seasonal phase is defined through UC-026.
* Species synchronization is available through UC-001.

## Behaviour

1. A seasonal phase may include fertilizer guidance.
2. The guidance may describe the recommended fertilizer type, strength, or general feeding strategy using the supported representation.
3. Plantly validates supplied guidance with the complete species-definition set.
4. Successful UC-001 synchronization makes the guidance active with its seasonal phase.
5. Invalid guidance causes the complete synchronization to fail atomically.

## Edge Cases

### No fertilizer guidance

A seasonal phase without fertilizer guidance remains valid.

### Invalid or ambiguous structured value

If structured guidance contains an unknown or ambiguous value, Plantly does not silently convert it and activates none of the synchronization.

### Guidance changed or removed

A successful synchronization replaces the active guidance with the authoritative definition or removes it when no longer defined, without changing historical watering events.

## Postconditions

* After success, the phase's active fertilizer guidance matches its authoritative definition.
* Failure leaves all previously active species data unchanged.

## Business Rules

* BR-004 — Watering and Fertilisation
* BR-010 — Seasonal Guidance
* BR-011 — Fertiliser Guidance
* BR-012 — Controlled Vocabulary
* BR-013 — Species Validation
* BR-014 — Special Care Information
* BR-019 — Species Synchronization Atomicity

## Acceptance Criteria

* [ ] Given a valid phase defines fertilizer guidance, when UC-001 synchronization succeeds, then that guidance becomes active with the phase.
* [ ] Given a phase omits fertilizer guidance, when synchronization succeeds, then the phase remains valid without it.
* [ ] Given structured fertilizer guidance contains an unknown or ambiguous value, when synchronization is attempted, then no synchronization change becomes active.
* [ ] Given authoritative guidance is changed or removed, when synchronization succeeds, then active guidance matches the definition and historical watering events remain unchanged.
* [ ] Given fertilizer guidance becomes active, when it is used, then it does not create a care task or determine that a plant requires watering.

## Out of Scope

* Recording fertilizer use; fertilizer is optional information on watering in UC-014.
* Determining the current phase; this belongs to UC-027.
* Displaying current guidance; this belongs to UC-028.
* Maintaining species knowledge through the normal application UI.

## Open Questions

* Which parts of fertilizer guidance are structured, and what controlled vocabularies apply?
* Are fertilizer type, strength, and feeding strategy independently optional?
* What validation distinguishes structured guidance from exceptional free-form notes?

