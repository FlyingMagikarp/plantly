# UC-002: View Species

## Status

Ready

## Goal

Allow the user to view the complete care knowledge for one species and, when applicable, navigate to the recorded plants associated with it.

## Preconditions

* The species exists in Plantly's runtime data.
* The species is displayed as an entry in the species overview defined by UC-003.

## Behaviour

1. The user selects a species entry from the species overview.
2. Plantly opens the detail view for the selected species.
3. Plantly displays the species name and all species data defined by `docs/species/TEMPLATE.md`: moisture preference, light preference, preferred temperature range, minimum temperature, growth period, bloom period, dormancy period, fertilizer guidance for each seasonal phase, and species notes.
4. If one or more recorded plants belong to the species, Plantly displays a plant section after the species data containing those plants.
5. If no recorded plants belong to the species, Plantly omits the entire plant section rather than displaying an empty list or plant-section empty state.
6. The user may select a plant from the plant section.
7. Plantly opens the selected plant's detail view defined by UC-007.

## Edge Cases

### Archived species

An archived species can still be opened from the species overview and its detail view continues to display its species data and associated recorded plants.

### No species notes

If the selected species has no notes, the detail view communicates that no notes are defined without inventing note content.

### Species no longer available

If the selected species is no longer available when its detail view is requested, Plantly communicates that the species could not be found and does not display data belonging to another species.

### Detail unavailable

If Plantly cannot retrieve the selected species, it communicates that the detail view could not be loaded and allows the user to try again.

## Postconditions

* The selected species data is displayed without being modified.
* Selecting an associated plant opens the detail view for that plant.

## Business Rules

* BR-001 — Plant Species
* BR-006 — Moisture Preference
* BR-007 — Light Preference
* BR-008 — Temperature
* BR-009 — Seasonal Phases
* BR-010 — Seasonal Guidance
* BR-011 — Fertiliser Guidance
* BR-014 — Special Care Information
* BR-018 — Species Archival

## Acceptance Criteria

* [ ] Given a species is displayed in the UC-003 species overview, when the user selects its entry, then Plantly opens the detail view for that species.
* [ ] Given a species detail view is open, when its data is displayed, then the species name, moisture preference, light preference, preferred temperature range, minimum temperature, growth period, bloom period, dormancy period, fertilizer guidance for growth, bloom, and dormancy, and species notes reflect the selected species.
* [ ] Given an archived species is displayed in the UC-003 species overview, when the user selects it, then its species detail is displayed.
* [ ] Given one or more recorded plants belong to the selected species, when the species detail is displayed, then a plant section appears after the species data and lists every recorded plant belonging to that species.
* [ ] Given no recorded plants belong to the selected species, when the species detail is displayed, then the entire plant section is omitted.
* [ ] Given a recorded plant appears in the species detail's plant section, when the user selects that plant, then Plantly opens that plant's detail view defined by UC-007.
* [ ] Given the selected species has no notes, when its detail is displayed, then Plantly communicates that no notes are defined and does not invent note content.
* [ ] Given the selected species no longer exists when its detail is requested, when Plantly handles the request, then it communicates that the species was not found and does not display another species's data.
* [ ] Given the selected species detail cannot be retrieved, when loading fails, then Plantly communicates the failure and provides a way to try again.
* [ ] Given the user views a species or selects one of its associated plants, when navigation occurs, then no species or plant data is modified.

## Out of Scope

* Editing species knowledge through the web application.
* Creating, archiving, restoring, or deleting species.
* Adding, updating, or removing plants from the collection.
* Defining the contents or other behaviour of the UC-007 plant detail view.

