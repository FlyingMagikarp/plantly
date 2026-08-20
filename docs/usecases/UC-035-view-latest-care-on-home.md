# UC-035: View Latest Care on Home

## Status

Implemented

## Goal

Enrich the Home plant overview so the user can see when care was last recorded for each active plant while scanning plants by location.

## Preconditions

* The Home plant overview defined by UC-034 is available.
* Care events can be recorded through UC-014 through UC-018.

## Behaviour

1. When Plantly retrieves the Home overview, it also retrieves the most recent recorded care event for each active plant when one exists.
2. Each Home plant card displays the date of that plant's most recent recorded care event.
3. If a plant has no recorded care events, its card displays `No CareLog yet` instead of an invented date.
4. Latest-care information appears without changing the location grouping, plant selection, or responsive behavior defined by UC-034.

## Edge Cases

### No recorded care event

An active plant without a care event remains visible and displays `No CareLog yet`.

### Multiple recorded care events

If a plant has multiple care events, the displayed date belongs to the event with the latest recorded timestamp.

### Different care-event types

The latest recorded event determines the displayed date regardless of event type.

### Inactive plants

Care events belonging to dead or archived plants do not cause those plants to appear on Home.

### Latest-care information unavailable

If Plantly cannot retrieve the information required for the Home overview, it communicates that the overview could not be loaded and allows the user to try again without displaying invented or stale latest-care values as current.

## Postconditions

* Every displayed care-event date reflects the most recent recorded care event for that plant.
* Viewing latest-care information does not create, modify, or remove plants, species, locations, assignments, or care events.

## Business Rules

* BR-003 — Historical Care Events
* BR-005 — Optional Event Data
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given an active plant has one recorded care event, when its Home card is displayed, then the event's date is shown.
* [ ] Given an active plant has multiple recorded care events, when its Home card is displayed, then the date of the event with the latest timestamp is shown.
* [ ] Given an active plant has recorded care events of different types, when its Home card is displayed, then the latest event determines the displayed date regardless of event type.
* [ ] Given an active plant has no recorded care events, when its Home card is displayed, then `No CareLog yet` is shown and no date is invented.
* [ ] Given dead or archived plants have recorded care events, when Home is displayed, then those plants do not appear.
* [ ] Given latest-care information cannot be retrieved, when Home is opened, then Plantly communicates that the overview could not be loaded and provides a way to try again.
* [ ] Given Home is displayed on mobile or desktop, when the layout adapts to the available width, then each visible plant's latest-care date or `No CareLog yet` remains available.
* [ ] Given the user views latest-care information or follows a plant link, when navigation occurs, then no plant, species, location, assignment, or care-event data is modified.

## Out of Scope

* Recording, correcting, or removing care events.
* Displaying the care-event type, notes, measurements, images, or a care-history summary on a Home plant card.
* Predicting when care is due or colour-coding cards as requiring attention.
* Sorting or filtering Home by care-event information.
