# UC-006: Remove Plant from Collection

## Status

Ready

## Goal

Allow the user to mark a plant dead or archived while preserving its history, restore an incorrectly marked plant, or permanently delete a faulty plant record and its dependent data.

## Preconditions

* The plant exists.
* The user is viewing the plant detail defined by UC-007.

## Behaviour

1. For an active plant, Plantly makes the actions to mark it dead or archived directly available on its detail view.
2. Plantly makes permanent deletion available through an additional menu in the top-right area of the plant detail, regardless of plant status.
3. Before marking a plant dead, archiving it, or permanently deleting it, Plantly displays a confirmation dialog that identifies the plant and the requested action.
4. If the user cancels a confirmation, Plantly makes no change.
5. If the user confirms marking the plant dead or archived, Plantly applies the selected status and preserves the plant, its care events, and its images.
6. For a dead or archived plant, Plantly provides an action on its detail view to restore it to active.
7. If the user restores a plant, Plantly changes its status to active without changing its other data, care events, or images.
8. If the user confirms permanent deletion, Plantly permanently deletes the plant and all care events and images belonging to it.
9. After permanent deletion, Plantly returns to the plant collection defined by UC-008 and the deleted plant is no longer available.

## Edge Cases

### Confirmation cancelled

Cancelling any removal confirmation leaves the plant status, plant fields, care events, and images unchanged.

### Repeated status action

Plantly does not offer marking a plant with the status it already has. A dead or archived plant must be restored to active before it can be marked with another non-active status.

### Permanent deletion from any status

An active, dead, or archived plant may be permanently deleted. Plantly does not attempt to determine whether the plant record is faulty; the confirmation makes the destructive result explicit to the user.

### Plant no longer available

If the plant no longer exists when a status change, restoration, or deletion is confirmed, Plantly communicates that the plant could not be found and does not modify or delete another plant.

### Status change or restoration fails

If Plantly cannot change or restore the status, it communicates the failure and leaves the plant, its care events, and its images unchanged.

### Permanent deletion fails

If permanent deletion cannot complete, Plantly communicates the failure and does not leave a partially deleted plant, care-event history, or image collection.

## Postconditions

* A plant confirmed as dead or archived has the selected status and retains all plant data, care events, and images.
* A restored plant is active and retains all other data.
* A permanently deleted plant and all of its care events and images no longer exist.
* A cancelled or failed action leaves the plant and all dependent data unchanged.

## Business Rules

* BR-003 — Historical Care Events
* BR-016 — Historical Data Preservation
* BR-022 — Plant Lifecycle
* BR-023 — Faulty Plant Record Deletion

## Acceptance Criteria

* [ ] Given an active plant detail is displayed, when the user views its available actions, then marking the plant dead and archiving it are directly available.
* [ ] Given any plant detail is displayed, when the user opens the additional top-right menu, then permanent deletion is available.
* [ ] Given the user initiates marking a plant dead, archiving it, or permanently deleting it, when the action is initiated, then Plantly displays a confirmation dialog identifying the plant and requested action before applying any change.
* [ ] Given a removal confirmation is displayed, when the user cancels it, then the plant, its status, care events, and images remain unchanged.
* [ ] Given an active plant, when the user confirms marking it dead, then its status becomes `dead` and its plant data, care events, and images are preserved.
* [ ] Given an active plant, when the user confirms archiving it, then its status becomes `archived` and its plant data, care events, and images are preserved.
* [ ] Given a dead or archived plant, when the user views its detail, then an action to restore it to active is available.
* [ ] Given a dead or archived plant, when the user restores it, then its status becomes `active` and all other plant data, care events, and images remain unchanged.
* [ ] Given a plant is dead, when its available actions are displayed, then marking it dead again or directly changing it to archived is unavailable until it is restored.
* [ ] Given a plant is archived, when its available actions are displayed, then archiving it again or directly changing it to dead is unavailable until it is restored.
* [ ] Given an active, dead, or archived plant, when the user confirms permanent deletion, then the plant and all care events and images belonging to it are permanently deleted.
* [ ] Given permanent deletion succeeds, when the operation completes, then Plantly displays the UC-008 collection and the deleted plant is unavailable.
* [ ] Given the selected plant no longer exists, when an action is confirmed, then Plantly communicates that it was not found and does not affect another plant.
* [ ] Given a status change, restoration, or deletion fails, when Plantly reports the failure, then no partial change or deletion is retained.

## Out of Scope

* Recording a reason for marking a plant dead or archived.
* Automatically determining whether a plant record is faulty.
* Deleting individual care events or images independently.
