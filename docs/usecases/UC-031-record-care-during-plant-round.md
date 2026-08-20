# UC-031: Record Care During Plant Round

## Status

Ready

## Goal

Allow the user to record care efficiently for plants while progressing through an active care round.

## Preconditions

* An active care round exists through UC-030.
* Plantly has presented a current active plant in that round.

## Behaviour

1. Plantly identifies the current plant and presents the supported care actions from UC-014 through UC-018.
2. The user may record a care event with the same required and optional information as its underlying use case.
3. Plantly validates and records the event according to that care-event use case.
4. After success, Plantly associates the event with the active round, provides unobtrusive confirmation, and keeps the current plant in place so the user may record additional events for it.
5. The user may manually advance to the next plant, skip a plant without recording care, or return to a previous plant while the round remains active.
6. The user may continue until the round is ready to complete through UC-032.

## Edge Cases

### Event recording fails

If recording fails, Plantly leaves the current plant in place, creates no partial or duplicate event, and allows the user to try again.

### Current plant becomes unavailable

If the current plant is deleted or becomes inactive, Plantly records no event for it and prevents the round from applying care to another plant by mistake.

### Plant location changes

A location change does not change the round's snapshot membership or order.

### No optional detail

Routine care remains valid with only the information required by the selected care-event type.

### End of round reached

After the user advances beyond the final plant, Plantly presents completion through UC-032. The completed round cannot be navigated for further care recording.

## Postconditions

* Each successful action creates exactly one care event for the identified current plant.
* Each successful care event is associated with the active round.
* Successful recording does not automatically change the current plant.
* Skipping or navigating between plants creates no care event.
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
* [ ] Given recording succeeds, when confirmation is shown, then the same plant remains current and the event is associated with the active round.
* [ ] Given one event has been recorded for the current plant, when the user records another supported event, then both events are associated with that plant and the active round.
* [ ] Given an active round has not completed, when the user manually advances or returns, then the corresponding next or previous snapshot member is presented without creating a care event.
* [ ] Given an active round has not completed, when the user skips a plant, then no care event is created for that action and the next snapshot member is presented.
* [ ] Given the current plant changes location after the round starts, when the round continues, then its membership and ordering remain unchanged.
* [ ] Given the user records any care-event type through the round, when its form is presented, then the same optional details available in the underlying use case remain available.
* [ ] Given recording fails, when Plantly reports the failure, then no partial or duplicate event exists and the round remains on the same plant.
* [ ] Given the current plant no longer exists or is inactive, when care is submitted, then no event is recorded for that or another plant.

## Out of Scope

* Defining the underlying event behaviours; these belong to UC-014 through UC-018.
* Correcting or removing existing care events; these belong to UC-020 and UC-021.
* Starting or completing the round; these belong to UC-030 and UC-032.
* Predicting or recommending which care action a plant needs.
