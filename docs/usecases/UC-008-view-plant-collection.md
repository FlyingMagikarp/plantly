# UC-008: View Plant Collection

## Status

Implemented

## Goal

Provide a scannable, searchable collection of plants that can be sorted and filtered by the names, location, and lifecycle information currently relevant to identifying a plant.

## Preconditions

* The user has opened the plant collection in the web application.

## Behaviour

1. Plantly initially selects the `active` status, leaves `dead` and `archived` unselected, selects all active and archived species, selects all locations and the `No location` option, and displays the resulting active plants.
2. For each displayed plant, Plantly shows its nickname, species name, and current location or that no location is assigned.
3. The user may sort displayed plants by nickname, species name, or location name in ascending or descending order.
4. Plantly provides a status dropdown with checkboxes for `active`, `dead`, and `archived`; plants matching any selected status are included.
5. Plantly provides a species dropdown with checkboxes for every active and archived species; plants belonging to any selected species are included.
6. Plantly provides a location dropdown with checkboxes for every location and a `No location` option; plants assigned to any selected location are included, and unassigned plants are included when `No location` is selected.
7. Plantly provides a search field that performs case-insensitive partial matching across plant nickname and species name. Location names are not searched.
8. Status, species, location, and search filters apply together to determine which plants are displayed, and sorting applies to that filtered result.
9. The user may select a displayed plant to open its detail defined by UC-007.

## Edge Cases

### No plants

If no plants exist, Plantly displays an empty state that guides the user toward adding the first plant through UC-004.

### No matching plants

If plants exist but none match the combined filters, Plantly displays an empty state that reflects the active filters rather than the collection-wide empty state.

### No selected statuses, species, or locations

If no status, no species, or neither a location nor `No location` is selected in its corresponding checkbox filter, no plants match that filter.

### Archived species

Archived species remain available in the species filter and plants associated with them can be included when their plant status and all other filters also match.

### Equal sort values

Plants with equal values for the selected sort field remain present; their relative order is not specified by this use case.

### Collection unavailable

If Plantly cannot retrieve the plant collection, it communicates that the collection could not be loaded and allows the user to try again.

## Postconditions

* Viewing, filtering, searching, sorting, and navigating from the collection do not modify plant or species data.
* The displayed collection reflects all selected filters, the search text, and the selected sort field and direction.

## Business Rules

* BR-001 — Plant Species
* BR-002 — Plant Location
* BR-020 — Plant Identity
* BR-022 — Plant Lifecycle
* BR-018 — Species Archival

## Acceptance Criteria

* [ ] Given active, dead, and archived plants exist, when the user opens the collection, then only the `active` status, all active and archived species, all locations, and `No location` are selected; active plants are displayed; and dead and archived plants are excluded.
* [ ] Given a plant is displayed, when the user views its collection entry, then the plant's nickname, species name, and current location or `No location` are displayed.
* [ ] Given plants with different nicknames are displayed, when the user sorts by nickname ascending or descending, then the plants follow the selected order.
* [ ] Given plants with different species names are displayed, when the user sorts by species name ascending or descending, then the plants follow the selected order.
* [ ] Given plants with different location names are displayed, when the user sorts by location ascending or descending, then the plants follow the selected order.
* [ ] Given lifecycle status checkboxes are displayed, when the user changes the selected statuses, then plants matching any selected status and all other filters are displayed.
* [ ] Given active and archived species exist, when the species filter is opened, then every active and archived species is available as a checkbox option.
* [ ] Given species checkboxes are displayed, when the user changes the selected species, then plants belonging to any selected species and matching all other filters are displayed.
* [ ] Given locations and unassigned plants exist, when the location filter is opened, then every location and a `No location` option are available as checkbox options.
* [ ] Given location checkboxes are displayed, when the user changes the selected locations, then plants assigned to any selected location and matching all other filters are displayed.
* [ ] Given `No location` is selected, when filters are applied, then unassigned plants matching all other filters are displayed.
* [ ] Given search text matches part of a plant nickname with different letter casing, when the search is applied, then that plant is included if it also matches the status and species filters.
* [ ] Given search text matches part of a species name with different letter casing, when the search is applied, then plants of that species are included if they also match the status and species filters.
* [ ] Given search text matches only a location name, when the search is applied, then that match does not cause plants at the location to be included.
* [ ] Given a plant matches neither its nickname nor species name, when search text is applied, then the plant is excluded.
* [ ] Given status, species, location, and search filters are active, when the collection is displayed, then only plants satisfying every filter category are shown and the selected sort applies to that result.
* [ ] Given no status, no species, or no location option is selected, when the filters are applied, then no plants are displayed and Plantly shows a filtered empty state.
* [ ] Given no plants exist, when the collection is opened, then Plantly displays an empty state with an action to add the first plant through UC-004.
* [ ] Given plants exist but none match the filters, when the filtered collection is displayed, then Plantly shows a filtered empty state rather than the collection-wide empty state.
* [ ] Given a plant is displayed, when the user selects its entry, then Plantly opens that plant's UC-007 detail.
* [ ] Given the collection cannot be retrieved, when loading fails, then Plantly communicates the failure and provides a way to try again.
* [ ] Given the user views, filters, searches, sorts, or navigates from the collection, when the displayed result changes, then no plant or species data is modified.

## Out of Scope

* Displaying plant images.
* Displaying recent care events or care summaries.
* Additional sort fields beyond nickname, species name, and location.
* Pagination.
