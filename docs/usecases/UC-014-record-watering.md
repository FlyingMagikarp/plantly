# UC-014: Record Watering

## Status

Implemented

## Goal

Allow the user to quickly record that a plant was watered, optionally including fertiliser and other useful detail, without making routine care cumbersome.

## Preconditions

* The plant exists and is active.
* The user has initiated watering from a view that identifies the plant.

## Behaviour

1. Plantly identifies the plant and prepares a watering event with a timestamp.
2. The user may adjust the timestamp to the current time or an earlier time and may add optional notes or indicate that fertiliser was included.
3. Plantly validates the plant, timestamp, and any supplied optional data.
4. Plantly records one watering event for the identified plant.
5. Plantly provides immediate, unobtrusive confirmation without requiring the user to dismiss a success dialog.

## Edge Cases

### Watering without optional detail

A watering with no fertiliser or other optional detail is valid and is recorded as a watering event.

### Watering with fertiliser

Fertiliser supplied during watering is stored as optional information on the watering event and does not create a separate fertilisation event.

### Inactive plant

If the plant is dead or archived, Plantly does not allow or record watering for it.

### Future timestamp

If the selected timestamp is in the future, Plantly identifies it as invalid and does not record the event.

### Plant no longer available

If the identified plant no longer exists when the event is submitted, Plantly does not record the event and communicates that the plant could not be found.

### Invalid event data

If the timestamp or supplied optional data is invalid, Plantly identifies the invalid information, preserves the entered information where practical, and does not record a partial event.

### Recording fails

If Plantly cannot record the watering, it communicates the failure, allows the user to try again, and does not create a partial or duplicate event.

## Postconditions

* One watering event exists for the identified plant with the selected timestamp and any supplied optional detail.
* No event exists after invalid input or a failed recording attempt.

## Business Rules

* BR-003 — Historical Care Events
* BR-004 — Watering and Fertilisation
* BR-005 — Optional Event Data
* BR-015 — Minimal Logging
* BR-016 — Historical Data Preservation

## Acceptance Criteria

* [ ] Given an existing plant, when the user records watering with a valid timestamp and no optional detail, then one watering event is recorded for that plant.
* [ ] Given the user includes fertiliser information, when watering is recorded, then the information belongs to the watering event and no separate fertilisation event is created.
* [ ] Given the user includes optional notes, when watering is recorded, then the notes are stored on the event.
* [ ] Given a dead or archived plant, when the user attempts to record watering, then no event is recorded.
* [ ] Given a future timestamp, when the user attempts to record watering, then no event is recorded and the timestamp is identified as invalid.
* [ ] Given invalid event data, when the user attempts to record watering, then no event is recorded and the invalid information is identified.
* [ ] Given the plant no longer exists, when the user submits the watering, then no event is recorded for any plant and Plantly communicates that the plant was not found.
* [ ] Given recording fails, when Plantly reports the failure, then no partial or duplicate event exists and the user can try again.
* [ ] Given watering is recorded successfully, when the operation completes, then unobtrusive confirmation is shown without a success dialog that must be dismissed.

## Out of Scope

* Determining whether or when a plant needs water.
* Creating a separate fertilisation event.
* Correcting or removing an existing event; these belong to UC-020 and UC-021.
* Recording care as part of a care round; this belongs to UC-031.
