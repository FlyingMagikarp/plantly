# UC-019: View Plant Care History

## Status

Implemented

## Goal

Allow the user to review the recorded care-event history of one plant so past care and observations remain available as useful context.

## Preconditions

* The plant exists.
* The user is viewing the plant detail defined by UC-007.

## Behaviour

1. Plantly retrieves the care events belonging to the selected plant.
2. Plantly orders events by timestamp from most recent to oldest. Events with identical timestamps are ordered by identifier from highest to lowest.
3. Plantly displays the history in pages of 10 events and allows the user to move between available pages.
4. Plantly displays each event's type, timestamp, and any recorded optional detail relevant to that event type.
5. Plantly makes the correction action defined by UC-020 and the removal action defined by UC-021 available for each event.
6. The initial history view does not provide event-type or date filters.
7. Viewing or paging through the history does not modify the plant or its events.

## Edge Cases

### No recorded care events

If the plant has no care events, Plantly displays an empty history state and does not invent activity.

### Inactive plant

A dead or archived plant retains and may display its care history.

### Plant no longer available

If the selected plant no longer exists, Plantly communicates that the plant could not be found and does not display another plant's history.

### History unavailable

If Plantly cannot retrieve the care history, it communicates the failure and allows the user to try again without displaying incomplete data as the complete history.

## Postconditions

* The displayed events all belong to the selected plant and reflect their stored values.
* Viewing the history does not create, modify, or remove any data.

## Business Rules

* BR-003 — Historical Care Events
* BR-004 — Watering and Fertilisation
* BR-005 — Optional Event Data
* BR-016 — Historical Data Preservation
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given a plant has recorded care events, when its care history is displayed, then every displayed event belongs to that plant and shows its type and timestamp.
* [ ] Given events have different timestamps, when the history is displayed, then they are ordered from the most recent timestamp to the oldest.
* [ ] Given events have identical timestamps, when the history is displayed, then they are ordered by identifier from highest to lowest.
* [ ] Given a plant has more than 10 care events, when its history is displayed, then 10 events appear per page and the user can move between available pages.
* [ ] Given the initial history view is displayed, when the user reviews its controls, then no event-type or date filters are provided.
* [ ] Given an event has optional detail, when it is displayed, then the recorded detail relevant to its event type is shown.
* [ ] Given a watering event includes fertiliser information, when it is displayed, then fertiliser appears as part of that watering event and not as a separate event.
* [ ] Given a plant has no recorded care events, when its care history is displayed, then an empty history state is shown and no activity is invented.
* [ ] Given a plant is dead or archived and has retained care events, when its detail is displayed, then its care history remains available.
* [ ] Given a care event is displayed, when its available actions are shown, then correction through UC-020 and removal through UC-021 are available.
* [ ] Given the selected plant no longer exists, when its history is requested, then Plantly communicates that it was not found and does not display another plant's events.
* [ ] Given the history cannot be retrieved, when loading fails, then Plantly communicates the failure and provides a way to try again.
* [ ] Given the user only views the history, when no event action is taken, then no plant or care-event data is modified.

## Out of Scope

* Recording care events; this belongs to UC-014 through UC-018.
* Defining correction or removal behaviour; these belong to UC-020 and UC-021.
* Aggregating, analysing, or charting care history.
* Predicting future care needs.
* Displaying images attached to events; this belongs to UC-023.
