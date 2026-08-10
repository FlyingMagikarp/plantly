# UC-007: View Plant

## Status

Ready

## Goal

Allow the user to view the complete currently maintained information for one plant and access the actions appropriate to its lifecycle status.

## Preconditions

* The plant exists.

## Behaviour

1. The user selects a plant entry from the collection defined by UC-008 or from another view that links to the plant.
2. Plantly opens the detail view for the selected plant.
3. Plantly displays the plant's technical identifier, nickname, species name, acquisition date, optional notes, lifecycle status, and current location or that no location is assigned.
4. The user may select the species name to open its detail view defined by UC-002.
5. For an active plant, Plantly provides access to editing defined by UC-005, location assignment defined by UC-012, and the direct dead and archive actions defined by UC-006.
6. For a dead or archived plant, Plantly provides the restore action defined by UC-006 and does not provide editing of maintained plant fields.
7. For every plant status, Plantly provides access to permanent deletion through the additional top-right menu defined by UC-006.

## Edge Cases

### No plant notes

If the plant has no notes, the detail view communicates that no notes are recorded without inventing note content.

### Archived species

If the plant belongs to an archived species, Plantly continues to display and link to that species.

### No assigned location

If the plant has no current location, the detail view communicates that no location is assigned.

### Plant no longer available

If the selected plant no longer exists when its detail is requested, Plantly communicates that the plant could not be found and does not display another plant's data.

### Detail unavailable

If Plantly cannot retrieve the selected plant, it communicates that the detail could not be loaded and allows the user to try again.

## Postconditions

* The selected plant's maintained data is displayed without being modified.
* Selecting its species opens the corresponding UC-002 species detail.

## Business Rules

* BR-001 — Plant Species
* BR-002 — Plant Location
* BR-020 — Plant Identity
* BR-021 — Plant Acquisition Date
* BR-022 — Plant Lifecycle
* BR-018 — Species Archival

## Acceptance Criteria

* [ ] Given a plant is displayed in the UC-008 collection, when the user selects it, then Plantly opens that plant's detail view.
* [ ] Given a plant detail is open, when its data is displayed, then its technical identifier, nickname, species name, acquisition date, notes, lifecycle status, and current location reflect the selected plant.
* [ ] Given a plant has no current location, when its detail is displayed, then Plantly communicates that no location is assigned.
* [ ] Given the plant has no notes, when its detail is displayed, then Plantly communicates that no notes are recorded and does not invent note content.
* [ ] Given the plant belongs to an archived species, when its detail is displayed, then the archived species name remains visible and links to its UC-002 detail.
* [ ] Given the user selects the plant's species, when navigation occurs, then Plantly opens the corresponding UC-002 species detail.
* [ ] Given an active plant detail is displayed, when available actions are shown, then editing, location assignment, marking dead, and archiving are available.
* [ ] Given a dead or archived plant detail is displayed, when available actions are shown, then restoration is available and editing maintained fields is unavailable.
* [ ] Given a plant detail is displayed for any lifecycle status, when the additional top-right menu is opened, then permanent deletion is available.
* [ ] Given the selected plant no longer exists, when its detail is requested, then Plantly communicates that it was not found and does not display another plant's data.
* [ ] Given the selected plant cannot be retrieved, when loading fails, then Plantly communicates the failure and provides a way to try again.
* [ ] Given the user only views a plant or follows its species link, when navigation occurs, then no plant or species data is modified.

## Out of Scope

* Displaying or managing plant images; those behaviours begin with UC-022.
* Displaying recent care events or full care history; care-history display belongs to UC-019.
* Managing locations; those behaviours belong to UC-009 through UC-011.
* Displaying plants grouped by location; this belongs to UC-013.
* Displaying seasonal guidance; this belongs to UC-028.
