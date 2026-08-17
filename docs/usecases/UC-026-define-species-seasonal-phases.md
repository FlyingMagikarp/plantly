# UC-026: Define Species Seasonal Phases

## Status

Draft

## Goal

Allow recurring seasonal phases to be represented in an authoritative species definition and synchronized as species knowledge.

## Preconditions

* The species has an authoritative Markdown definition governed by ADR-001.
* Species synchronization is available through UC-001.

## Behaviour

1. A species definition may include zero or more recurring seasonal phases.
2. Each phase identifies its phase type, recurring period, and optional seasonal notes.
3. Plantly validates every supplied phase as part of the complete species-definition set.
4. A successful UC-001 synchronization makes the complete phase definition active with its species.
5. Invalid phase data causes the synchronization to fail atomically.

## Edge Cases

### No seasonal phases

A species definition without seasonal phases remains valid when all other required species data is valid.

### Invalid phase

If a phase has an unknown type, invalid recurring period, or inconsistent boundary, Plantly identifies the definition as invalid and activates none of the synchronization.

### Existing phases changed or removed

When an authoritative definition changes or removes phases, a successful synchronization makes the new complete definition active without changing historical care events.

## Postconditions

* After successful synchronization, the active species contains exactly the seasonal phases from its authoritative definition.
* Failed validation or synchronization leaves all previously active species data unchanged.

## Business Rules

* BR-009 — Seasonal Phases
* BR-010 — Seasonal Guidance
* BR-012 — Controlled Vocabulary
* BR-013 — Species Validation
* BR-019 — Species Synchronization Atomicity

## Acceptance Criteria

* [ ] Given a valid species definition contains seasonal phases, when UC-001 synchronization succeeds, then those phases become active for that species.
* [ ] Given a valid species definition contains no seasonal phases, when synchronization succeeds, then the species remains valid with no phases.
* [ ] Given any seasonal phase is invalid, when synchronization is attempted, then no species creation, update, archival, reactivation, or phase change becomes active.
* [ ] Given an authoritative definition removes a phase, when synchronization succeeds, then that phase is no longer active for the species and historical care events remain unchanged.
* [ ] Given a phase is defined, when it becomes active, then it creates no care task or care event.

## Out of Scope

* Maintaining species knowledge through the normal application UI.
* Determining which phase currently applies; this belongs to UC-027.
* Displaying current guidance; this belongs to UC-028.
* Defining fertilizer guidance; this belongs to UC-029.

## Open Questions

* What controlled vocabulary identifies phase types?
* How are recurring period boundaries represented, including periods that cross a calendar-year boundary?
* May phases overlap, and may more than one phase of the same type occur in a year?
* Are seasonal notes part of a phase definition, and what validation applies to them?

