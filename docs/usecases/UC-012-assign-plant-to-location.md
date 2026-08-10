# UC-012: Assign Plant to Location

## Status

Ready

## Goal

Allow the user to assign an active plant to a location, move it to another location, or make it unassigned from its detail view.

## Preconditions

* The plant exists and has the `active` lifecycle status.
* The user is viewing the plant detail defined by UC-007.

## Behaviour

1. Plantly displays the active plant's current location or that no location is assigned.
2. The user initiates changing the location.
3. Plantly provides every existing location and a `No location` option.
4. The user selects a location or `No location` and applies the change.
5. Plantly replaces the current assignment with the selection and displays the updated UC-007 plant detail.

## Edge Cases

### No locations exist

If no locations exist, `No location` remains available.

### Same assignment selected

Selecting the plant's current location or selecting `No location` for an unassigned plant is valid and does not create an additional relationship.

### Plant is dead or archived

Plantly displays the retained location on the plant detail but does not allow it to be changed until the plant is restored to active through UC-006.

### Selected location no longer available

If the selected location no longer exists when the change is applied, Plantly does not change the plant's current assignment and requires another selection.

### Plant no longer available

If the plant no longer exists when the change is applied, Plantly communicates that it could not be found and does not modify another plant.

### Assignment fails

If Plantly cannot complete the change, it communicates the failure and leaves the current assignment unchanged.

## Postconditions

* The active plant has zero or one current location matching the applied selection.
* Invalid or failed assignment leaves the plant's current location unchanged.

## Business Rules

* BR-002 — Plant Location
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given an active plant detail, when the user changes its location, then every existing location and a `No location` option are available.
* [ ] Given an active unassigned plant, when the user selects an existing location, then the plant is assigned to that location and the updated location appears on its UC-007 detail.
* [ ] Given an active assigned plant, when the user selects another location, then the old assignment is replaced by the selected location.
* [ ] Given an active assigned plant, when the user selects `No location`, then the plant becomes unassigned.
* [ ] Given no locations exist, when the user changes an active plant's location, then `No location` remains available.
* [ ] Given a plant is dead or archived, when its detail is displayed, then its retained location is visible but location assignment is unavailable.
* [ ] Given the selected location no longer exists, when the change is applied, then the plant's previous assignment remains unchanged and another location must be selected.
* [ ] Given the selected plant no longer exists, when the change is applied, then Plantly communicates that it was not found and does not modify another plant.
* [ ] Given assignment cannot be completed, when Plantly reports the failure, then the plant's current assignment remains unchanged.

## Out of Scope

* Creating, renaming, or removing locations; those behaviours belong to UC-009 through UC-011.
* Assigning multiple locations to one plant.
* Changing the location of a dead or archived plant.
* Recording location history or movement care events.
