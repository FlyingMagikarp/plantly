# UC-021: Remove Incorrect Care Event

## Status

Ready

## Goal

Allow the user to remove a care event that was recorded incorrectly so the plant's care history contains only events that represent historical facts.

## Preconditions

* The plant exists and is active.
* The care event exists and belongs to that plant.
* The event is available from the plant care history defined by UC-019.

## Behaviour

1. The user initiates removal for a specific care event.
2. Plantly identifies the plant and event and asks the user to confirm the permanent removal, clearly identifying the event and the consequence.
3. If the user confirms, Plantly permanently removes the identified care event and any images attached to it.
4. Plantly displays the plant's updated care history and provides unobtrusive confirmation.
5. If the user cancels, Plantly leaves the care event and all other data unchanged.

## Edge Cases

### Removal cancelled

If the user does not confirm removal, Plantly leaves the event and all other data unchanged.

### Inactive plant

If the event belongs to a dead or archived plant, Plantly does not allow or apply removal.

### Event no longer available

If the event no longer exists or no longer belongs to the identified plant when removal is confirmed, Plantly communicates that it could not be found and does not remove another event.

### Plant no longer available

If the plant no longer exists when removal is confirmed, Plantly communicates that it could not be found and does not remove an event belonging to another plant.

### Removal fails

If Plantly cannot remove the event, it communicates the failure, leaves the event unchanged, and allows the user to try again.

### Last event on a history page

If removal leaves the current history page empty while earlier events remain, Plantly displays the nearest available page rather than an empty page that implies the plant has no care history.

## Postconditions

* After successful removal, the identified care event and any images attached to it no longer exist, and the event no longer appears in the plant's care history.
* Cancelling or failing removal leaves the identified event and all unrelated data unchanged.
* No other care event is removed or modified.

## Business Rules

* BR-003 — Historical Care Events
* BR-016 — Historical Data Preservation
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given a care event is displayed in UC-019, when the user initiates removal, then Plantly asks for confirmation and identifies the event as being permanently removed.
* [ ] Given the removal confirmation is displayed, when the user cancels, then the event and all other data remain unchanged.
* [ ] Given a care event belongs to a dead or archived plant, when the user attempts to remove it, then the event and any attached images remain unchanged.
* [ ] Given the user confirms removal of an existing event belonging to the identified active plant, when removal succeeds, then that event no longer exists or appears in the plant's care history and no other event is modified or removed.
* [ ] Given the removed care event has attached images, when removal succeeds, then those images are also permanently removed.
* [ ] Given the event no longer exists or does not belong to the identified plant, when removal is confirmed, then Plantly removes no event and communicates that the selected event was not found.
* [ ] Given the plant no longer exists, when removal is confirmed, then Plantly removes no event and communicates that the plant was not found.
* [ ] Given removal fails, when Plantly reports the failure, then the event remains unchanged and the user can try again.
* [ ] Given removal succeeds, when the care history is displayed, then it reflects the removal and unobtrusive confirmation is provided.
* [ ] Given removal empties the current history page while earlier events remain, when the updated history is displayed, then Plantly shows the nearest available page containing events.

## Out of Scope

* Correcting an inaccurate event while preserving it; this belongs to UC-020.
* Removing more than one care event in a single action.
* Removing a plant or any other care events belonging to it.
* Preserving or displaying an audit trail of removed events unless established as a separate requirement.
* Removing images independently while retaining their care event; this belongs to UC-025.
