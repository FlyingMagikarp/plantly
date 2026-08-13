# UC-016: Record Repotting

## Status

Implemented

## Goal

Allow the user to record that a plant was repotted, with optional detail that may make the event useful in its future care history.

## Preconditions

* The plant exists and is active.
* The user has initiated repotting from a view that identifies the plant.

## Behaviour

1. Plantly identifies the plant and prepares a repotting event with a timestamp.
2. The user may adjust the timestamp to the current time or an earlier time and may add optional notes.
3. Plantly validates the plant, timestamp, and supplied optional data.
4. Plantly records one repotting event for the identified plant.
5. Plantly provides immediate, unobtrusive confirmation without requiring the user to dismiss a success dialog.

## Edge Cases

### No optional detail

A repotting event with no optional detail is valid.

### Inactive plant

If the plant is dead or archived, Plantly does not allow or record repotting for it.

### Future timestamp

If the selected timestamp is in the future, Plantly identifies it as invalid and does not record the event.

### Plant no longer available

If the identified plant no longer exists when the event is submitted, Plantly does not record the event and communicates that the plant could not be found.

### Invalid event data

If the timestamp or supplied optional data is invalid, Plantly identifies the invalid information, preserves entered information where practical, and does not record a partial event.

### Recording fails

If Plantly cannot record the repotting, it communicates the failure, allows the user to try again, and does not create a partial or duplicate event.

## Postconditions

* One repotting event exists for the identified plant with the selected timestamp and any supplied optional detail.
* No event exists after invalid input or a failed recording attempt.

## Business Rules

* BR-003 — Historical Care Events
* BR-005 — Optional Event Data
* BR-015 — Minimal Logging
* BR-016 — Historical Data Preservation

## Acceptance Criteria

* [ ] Given an existing plant, when the user records repotting with a valid timestamp and no optional detail, then one repotting event is recorded for that plant.
* [ ] Given the user includes optional notes, when repotting is recorded, then the notes are stored on the event.
* [ ] Given a dead or archived plant, when the user attempts to record repotting, then no event is recorded.
* [ ] Given a future timestamp, when the user attempts to record repotting, then no event is recorded and the timestamp is identified as invalid.
* [ ] Given invalid event data, when the user attempts to record repotting, then no event is recorded and the invalid information is identified.
* [ ] Given the plant no longer exists, when the user submits the repotting, then no event is recorded for any plant and Plantly communicates that the plant was not found.
* [ ] Given recording fails, when Plantly reports the failure, then no partial or duplicate event exists and the user can try again.
* [ ] Given repotting is recorded successfully, when the operation completes, then unobtrusive confirmation is shown without a success dialog that must be dismissed.

## Out of Scope

* Recommending when or how a plant should be repotted.
* Changing the plant's location assignment as a consequence of repotting.
* Attaching an image; this belongs to UC-023.
* Correcting or removing an existing event; these belong to UC-020 and UC-021.
* Recording care as part of a care round; this belongs to UC-031.
