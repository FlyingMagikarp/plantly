# UC-031: Record Care During Plant Round

## Status

Draft

## Goal

Allow the user to record care efficiently for plants while progressing through an active care round.

## Preconditions

* An active care round exists through UC-030.
* Plantly has presented a current active plant in that round.

## Behaviour

1. Plantly identifies the current plant and presents the supported care actions from UC-014 through UC-018.
2. The user may record a care event with the same required and optional information as its underlying use case.
3. Plantly validates and records the event according to that care-event use case.
4. After success, Plantly provides unobtrusive confirmation and advances to the next applicable plant.
5. The user may continue until the round is ready to complete through UC-032.

## Edge Cases

### Event recording fails

If recording fails, Plantly leaves the current plant in place, creates no partial or duplicate event, and allows the user to try again.

### Current plant becomes unavailable

If the current plant is deleted or becomes inactive, Plantly records no event for it and prevents the round from applying care to another plant by mistake.

### Plant location changes

The effect of a location change during a round depends on the unresolved round-membership rule in UC-030.

### No optional detail

Routine care remains valid with only the information required by the selected care-event type.

## Postconditions

* Each successful action creates exactly one care event for the identified current plant.
* A failed action creates no event and does not silently advance the round.
* Existing events and unrelated plants remain unchanged.

## Business Rules

* BR-003 — Historical Care Events
* BR-004 — Watering and Fertilisation
* BR-005 — Optional Event Data
* BR-015 — Minimal Logging
* BR-016 — Historical Data Preservation
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given an active round presents an active plant, when the user records a supported care action with valid data, then exactly one event of that type is recorded for that plant.
* [ ] Given the user records watering with fertilizer, when it succeeds, then one watering event contains the fertilizer information and no separate fertilization event is created.
* [ ] Given the user supplies no optional detail, when valid routine care is recorded, then the event is accepted.
* [ ] Given recording succeeds, when the round advances, then the next applicable plant is presented and unobtrusive confirmation is shown.
* [ ] Given recording fails, when Plantly reports the failure, then no partial or duplicate event exists and the round remains on the same plant.
* [ ] Given the current plant no longer exists or is inactive, when care is submitted, then no event is recorded for that or another plant.

## Out of Scope

* Defining the underlying event behaviours; these belong to UC-014 through UC-018.
* Correcting or removing existing care events; these belong to UC-020 and UC-021.
* Starting or completing the round; these belong to UC-030 and UC-032.
* Predicting or recommending which care action a plant needs.

## Open Questions

* May the user skip a plant, return to a previous plant, or manually advance without recording care?
* May more than one care event be recorded for the same plant before advancing?
* Does a successful event always advance automatically, or may the user remain on the plant?
* Which optional event details remain available in the compact round workflow?

