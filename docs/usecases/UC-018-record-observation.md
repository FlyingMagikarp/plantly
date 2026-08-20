# UC-018: Record Observation

## Status

Implemented

## Goal

Allow the user to record a general observation about a plant when no more specific care-event type describes what happened.

## Preconditions

* The plant exists and is active.
* The user has initiated an observation from a view that identifies the plant.

## Behaviour

1. Plantly identifies the plant and prepares an observation event with a timestamp.
2. The user may adjust the timestamp to the current time or an earlier time and may add optional notes.
3. Plantly validates the plant, timestamp, and optional notes.
4. Plantly records one observation event for the identified plant.
5. Plantly provides immediate, unobtrusive confirmation without requiring the user to dismiss a success dialog.

## Edge Cases

### Missing observation content

An observation without notes is valid.

### Inactive plant

If the plant is dead or archived, Plantly does not allow or record an observation for it.

### Future timestamp

If the selected timestamp is in the future, Plantly identifies it as invalid and does not record the event.

### Plant no longer available

If the identified plant no longer exists when the event is submitted, Plantly does not record the event and communicates that the plant could not be found.

### Invalid event data

If the timestamp or optional notes are invalid, Plantly identifies the invalid information, preserves entered information where practical, and does not record a partial event.

### Recording fails

If Plantly cannot record the observation, it communicates the failure, allows the user to try again, and does not create a partial or duplicate event.

## Postconditions

* One observation event exists for the identified plant with the selected timestamp and any optional notes.
* No event exists after invalid input or a failed recording attempt.

## Business Rules

* BR-003 — Historical Care Events
* BR-005 — Optional Event Data
* BR-015 — Minimal Logging
* BR-016 — Historical Data Preservation

## Acceptance Criteria

* [ ] Given an existing active plant, when the user records an observation with a valid timestamp and no notes, then one observation event is recorded for that plant.
* [ ] Given the user includes optional notes, when the observation is recorded, then the notes are stored on the event.
* [ ] Given a dead or archived plant, when the user attempts to record an observation, then no event is recorded.
* [ ] Given a future timestamp, when the user attempts to record an observation, then no event is recorded and the timestamp is identified as invalid.
* [ ] Given invalid event data, when the user attempts to record an observation, then no event is recorded and the invalid information is identified.
* [ ] Given the plant no longer exists, when the user submits the observation, then no event is recorded for any plant and Plantly communicates that the plant was not found.
* [ ] Given recording fails, when Plantly reports the failure, then no partial or duplicate event exists and the user can try again.
* [ ] Given an observation is recorded successfully, when the operation completes, then unobtrusive confirmation is shown without a success dialog that must be dismissed.

## Out of Scope

* Diagnosing plant health from an observation.
* Generating care tasks or urgency from an observation.
* Correcting or removing an existing event; these belong to UC-020 and UC-021.
* Recording care as part of a care round; this belongs to UC-031.
