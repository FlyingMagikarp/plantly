# UC-013: View Plants by Location

## Status

Implemented

## Goal

Provide a location-oriented overview of active plants so the user can scan the collection according to where plants are currently kept.

## Preconditions

* The user has opened the plants-by-location view.

## Behaviour

1. Plantly retrieves active plants and their current location assignments.
2. Plantly displays a `No location` group first, followed by a group for each location that contains active plants.
3. Each active plant appears exactly once as a card in its assigned location group or, if unassigned, in `No location`.
4. Each plant card displays the plant's nickname and species name.
5. The user may select a plant card to open its detail defined by UC-007.

## Edge Cases

### No active plants

If no active plants exist, Plantly displays an empty state that guides the user toward adding a plant through UC-004.

### No unassigned active plants

The `No location` group remains visible and first even when it contains no plants.

### Inactive plants

Dead and archived plants do not appear in this overview, including when they retain a location assignment.

### Location removed

Plants whose location is removed through UC-011 appear in `No location` when this view next reflects the stored state.

### Overview unavailable

If Plantly cannot retrieve the overview, it communicates that the plants could not be loaded and allows the user to try again.

## Postconditions

* Viewing groups or navigating to a plant does not modify plants, locations, or assignments.
* Every displayed active plant appears in exactly one group matching its current assignment.

## Business Rules

* BR-001 — Plant Species
* BR-002 — Plant Location
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given assigned and unassigned active plants exist, when the overview is displayed, then `No location` is the first group and each location containing active plants has its own group.
* [ ] Given an active plant is assigned to a location, when the overview is displayed, then the plant appears exactly once in that location's group.
* [ ] Given an active plant is unassigned, when the overview is displayed, then the plant appears exactly once in `No location`.
* [ ] Given dead or archived plants exist, when the overview is displayed, then none of those plants appears in any group.
* [ ] Given a group contains an active plant, when its card is displayed, then the plant's nickname and species name are shown.
* [ ] Given `No location` contains no active plants, when the overview is displayed, then the empty `No location` group remains first.
* [ ] Given a location is removed, when the overview next displays its formerly assigned active plants, then they appear in `No location`.
* [ ] Given a plant card is displayed, when the user selects it, then Plantly opens that plant's UC-007 detail.
* [ ] Given no active plants exist, when the overview is opened, then Plantly displays an empty state with access to UC-004.
* [ ] Given the overview cannot be retrieved, when loading fails, then Plantly communicates the failure and provides a way to try again.
* [ ] Given the user views groups or follows a plant link, when navigation occurs, then no plant, location, or assignment data is modified.

## Out of Scope

* Displaying dead or archived plants.
* Sorting or filtering within the grouped overview.
* Assigning or moving plants directly from the overview; this belongs to UC-012.
* Recording historical plant movement.
