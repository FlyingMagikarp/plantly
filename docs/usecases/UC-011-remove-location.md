# UC-011: Remove Location

## Status

Ready

## Goal

Allow the user to permanently remove a location without removing plants that are assigned to it.

## Preconditions

* The location exists.
* The user has initiated removal from location management.

## Behaviour

1. Plantly displays a confirmation that identifies the location and explains that assigned plants will become unassigned.
2. If the user cancels, Plantly makes no change.
3. If the user confirms, Plantly permanently deletes the location and makes every plant assigned to it unassigned.
4. Plantly displays the remaining locations in location management.

## Edge Cases

### Location has no plants

A location with no assigned plants can be removed through the same confirmation flow.

### Inactive plants are assigned

Deleting a location makes active, dead, and archived plants assigned to it unassigned. Their lifecycle statuses and other data remain unchanged.

### Location no longer available

If the location no longer exists when removal is confirmed, Plantly communicates that it could not be found and does not change any plant.

### Removal fails

If Plantly cannot complete removal, it communicates the failure and leaves the location and every plant assignment unchanged.

## Postconditions

* After successful removal, the location no longer exists and every formerly assigned plant is unassigned.
* Cancellation or failure leaves the location and all assignments unchanged.

## Business Rules

* BR-002 — Plant Location
* BR-025 — Location Deletion

## Acceptance Criteria

* [ ] Given an existing location, when the user initiates removal, then Plantly displays a confirmation identifying the location and explaining that assigned plants will become unassigned.
* [ ] Given removal confirmation is displayed, when the user cancels, then the location and every plant assignment remain unchanged.
* [ ] Given a location has no assigned plants, when the user confirms removal, then the location is permanently deleted.
* [ ] Given active, dead, or archived plants are assigned to a location, when the user confirms removal, then the location is permanently deleted and every assigned plant becomes unassigned without otherwise being changed.
* [ ] Given the selected location no longer exists, when removal is confirmed, then Plantly communicates that it was not found and does not change any plant.
* [ ] Given removal cannot be completed, when Plantly reports the failure, then the location and every plant assignment remain unchanged.

## Out of Scope

* Deleting plants assigned to the location.
* Deleting or changing plant care history.
* Merging locations.
