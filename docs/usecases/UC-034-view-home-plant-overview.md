# UC-034: View Home Plant Overview

## Status

Draft

## Goal

Provide a useful Home view where the user can scan active plants by their current location and see when care was last recorded for each plant.

## Preconditions

* The user has opened Home.

## Behaviour

1. Plantly retrieves active plants, their species, their current location assignments, and the most recent recorded care event for each plant when one exists.
2. Plantly displays a `No location` group first, followed by a group for each location that contains active plants.
3. Each active plant appears exactly once as a card in its assigned location group or, if unassigned, in `No location`.
4. Each plant card displays the plant's nickname, species name, and the date of its most recent recorded care event.
5. If a plant has no recorded care events, its card communicates that no care has been recorded using `<NO_CARE_RECORDED_LABEL>`.
6. The user may select a plant card to open its detail defined by UC-007.
7. Plantly adapts the card layout to mobile and desktop while preserving access to the same plants and required card information.

## Edge Cases

### No active plants

If no active plants exist, Plantly displays an empty state that guides the user toward adding a plant through UC-004.

### No unassigned active plants

The `No location` group remains visible and first even when it contains no plants.

### Inactive plants

Dead and archived plants do not appear on Home, including when they retain a location assignment or have recorded care events.

### No recorded care event

An active plant without a care event remains visible and displays `<NO_CARE_RECORDED_LABEL>` instead of an invented date.

### Multiple recorded care events

If a plant has multiple care events, the displayed date belongs to the event with the latest recorded timestamp, regardless of event type.

### Location removed

Plants whose location is removed through UC-011 appear in `No location` when Home next reflects the stored state.

### Overview unavailable

If Plantly cannot retrieve the Home overview, it communicates that the plants could not be loaded and allows the user to try again.

## Postconditions

* Viewing Home or navigating to a plant does not modify plants, species, locations, assignments, or care events.
* Every displayed active plant appears in exactly one group matching its current location assignment.
* Every displayed care-event date reflects the most recent recorded care event for that plant.

## Business Rules

* BR-001 — Plant Species
* BR-002 — Plant Location
* BR-003 — Historical Care Events
* BR-005 — Optional Event Data
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given assigned and unassigned active plants exist, when Home is displayed, then `No location` is the first group and each location containing active plants has its own group.
* [ ] Given an active plant is assigned to a location, when Home is displayed, then the plant appears exactly once in that location's group.
* [ ] Given an active plant is unassigned, when Home is displayed, then the plant appears exactly once in `No location`.
* [ ] Given dead or archived plants exist, when Home is displayed, then none of those plants appears in any group.
* [ ] Given a group contains an active plant, when its card is displayed, then the plant's nickname and species name are shown.
* [ ] Given an active plant has one or more recorded care events, when its card is displayed, then the date of the event with the latest timestamp is shown.
* [ ] Given an active plant has recorded care events of different types, when its card is displayed, then the latest event determines the displayed date regardless of event type.
* [ ] Given an active plant has no recorded care events, when its card is displayed, then `<NO_CARE_RECORDED_LABEL>` is shown and no date is invented.
* [ ] Given `No location` contains no active plants, when Home is displayed, then the empty `No location` group remains first.
* [ ] Given a location is removed, when Home next displays its formerly assigned active plants, then they appear in `No location`.
* [ ] Given a plant card is displayed, when the user selects it, then Plantly opens that plant's UC-007 detail.
* [ ] Given no active plants exist, when Home is opened, then Plantly displays an empty state with access to UC-004.
* [ ] Given Home cannot be retrieved, when loading fails, then Plantly communicates the failure and provides a way to try again.
* [ ] Given Home is displayed on mobile or desktop, when the layout adapts to the available width, then every required group, plant card, and card value remains available.
* [ ] Given the user views Home or follows a plant link, when navigation occurs, then no plant, species, location, assignment, or care-event data is modified.

## Out of Scope

* Displaying dead or archived plants.
* Sorting or filtering within Home.
* Assigning or moving plants directly from Home; this belongs to UC-012.
* Recording, correcting, or removing care events.
* Displaying the care-event type, notes, measurements, or a care-history summary on a plant card.
* Predicting when care is due or colour-coding cards as requiring attention.
* Dashboard widgets, analytics, weather, or reporting.

## Open Questions

* After Home replaces the current plants-by-location entry point, should the existing dedicated plants-by-location route remain available, redirect to Home, or be removed?
