# UC-020: Correct Care Event

## Status

Implemented

## Goal

Allow the user to correct an inaccurate care event while preserving the event as the corrected historical fact.

## Preconditions

* The plant exists.
* The care event exists and belongs to that plant.
* The event is available from the plant care history defined by UC-019.

## Behaviour

1. The user initiates correction for a specific care event.
2. Plantly identifies the plant and event and displays its current timestamp and notes as editable values; its event type and plant cannot be changed.
3. The user changes the timestamp, notes, or both.
4. Plantly validates the corrected event according to its event type.
5. Plantly applies the valid correction to that event without creating an additional care event.
6. Plantly displays the corrected event in the plant's care history and provides unobtrusive confirmation.

## Edge Cases

### No changes

If the user submits the event without changing any value, Plantly does not create another event or alter unrelated data.

### Inactive plant

If the event belongs to a dead or archived plant, Plantly does not allow or apply a correction.

### Future timestamp

If the corrected timestamp is in the future, Plantly identifies it as invalid and leaves the stored event unchanged.

### Invalid corrected data

If a corrected value is invalid, Plantly identifies the invalid information, preserves the attempted changes where practical, and leaves the stored event unchanged.

### Event no longer available

If the event no longer exists or no longer belongs to the identified plant when the correction is submitted, Plantly communicates that it could not be found and does not modify another event.

### Plant no longer available

If the plant no longer exists, Plantly communicates that it could not be found and does not modify an event belonging to another plant.

### Correction fails

If Plantly cannot apply the correction, it communicates the failure, leaves the stored event unchanged, and allows the user to try again.

## Postconditions

* The identified event contains the accepted corrected values and remains associated with the same plant.
* No additional care event is created by a correction.
* Invalid or failed corrections leave the stored event unchanged.

## Business Rules

* BR-003 — Historical Care Events
* BR-004 — Watering and Fertilisation
* BR-005 — Optional Event Data
* BR-016 — Historical Data Preservation

## Acceptance Criteria

* [ ] Given a care event for an active plant is displayed in UC-019, when the user initiates correction, then its current timestamp and notes are editable and its event type and plant are not editable.
* [ ] Given the user supplies a valid correction to the timestamp, notes, or both, when the correction succeeds, then the same event contains the corrected values and no additional event is created.
* [ ] Given a dead or archived plant, when the user attempts to correct one of its events, then the event remains unchanged.
* [ ] Given a future corrected timestamp, when the user submits the correction, then the event remains unchanged and the timestamp is identified as invalid.
* [ ] Given the user submits no changes, when the action completes, then no additional event is created and unrelated data is unchanged.
* [ ] Given corrected data is invalid, when the user submits it, then the stored event remains unchanged and the invalid information is identified.
* [ ] Given the event no longer exists or does not belong to the identified plant, when the correction is submitted, then Plantly modifies no event and communicates that the selected event was not found.
* [ ] Given the plant no longer exists, when the correction is submitted, then Plantly modifies no event and communicates that the plant was not found.
* [ ] Given correction fails, when Plantly reports the failure, then the event retains all previously stored values and the user can try again.
* [ ] Given correction succeeds, when the history is displayed, then the corrected values are shown and unobtrusive confirmation is provided.

## Out of Scope

* Removing an incorrect event; this belongs to UC-021.
* Preserving or displaying an audit trail of earlier values unless that is established as a separate requirement.
* Moving an event to a different plant.
* Changing an event's type.
* Correcting event-specific fields other than notes.
