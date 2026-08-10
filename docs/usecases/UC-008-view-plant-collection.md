# UC-008: View Plant Collection

## Status

Ready

## Goal

Provide a scannable, searchable collection of plants that can be sorted and filtered by the names and lifecycle information currently relevant to identifying a plant.

## Preconditions

* The user has opened the plant collection in the web application.

## Behaviour

1. Plantly initially selects the `active` status, leaves `dead` and `archived` unselected, selects all active and archived species, and displays the resulting active plants.
2. For each displayed plant, Plantly shows its nickname and species name.
3. The user may sort displayed plants by nickname or species name in ascending or descending order.
4. Plantly provides a status dropdown with checkboxes for `active`, `dead`, and `archived`; plants matching any selected status are included.
5. Plantly provides a species dropdown with checkboxes for every active and archived species; plants belonging to any selected species are included.
6. Plantly provides a search field that performs case-insensitive partial matching across both plant nickname and species name.
7. Status, species, and search filters apply together to determine which plants are displayed, and sorting applies to that filtered result.
8. The user may select a displayed plant to open its detail defined by UC-007.

## Edge Cases

### No plants

If no plants exist, Plantly displays an empty state that guides the user toward adding the first plant through UC-004.

### No matching plants

If plants exist but none match the combined filters, Plantly displays an empty state that reflects the active filters rather than the collection-wide empty state.

### No selected statuses or species

If no status or no species is selected in its corresponding checkbox filter, no plants match that filter.

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
* BR-020 — Plant Identity
* BR-022 — Plant Lifecycle
* BR-018 — Species Archival

## Acceptance Criteria

* [ ] Given active, dead, and archived plants exist, when the user opens the collection, then only the `active` status and all active and archived species are selected, active plants are displayed, and dead and archived plants are excluded.
* [ ] Given a plant is displayed, when the user views its collection entry, then the plant's nickname and species name are displayed.
* [ ] Given plants with different nicknames are displayed, when the user sorts by nickname ascending or descending, then the plants follow the selected order.
* [ ] Given plants with different species names are displayed, when the user sorts by species name ascending or descending, then the plants follow the selected order.
* [ ] Given lifecycle status checkboxes are displayed, when the user changes the selected statuses, then plants matching any selected status and all other filters are displayed.
* [ ] Given active and archived species exist, when the species filter is opened, then every active and archived species is available as a checkbox option.
* [ ] Given species checkboxes are displayed, when the user changes the selected species, then plants belonging to any selected species and matching all other filters are displayed.
* [ ] Given search text matches part of a plant nickname with different letter casing, when the search is applied, then that plant is included if it also matches the status and species filters.
* [ ] Given search text matches part of a species name with different letter casing, when the search is applied, then plants of that species are included if they also match the status and species filters.
* [ ] Given a plant matches neither its nickname nor species name, when search text is applied, then the plant is excluded.
* [ ] Given status, species, and search filters are active, when the collection is displayed, then only plants satisfying every filter category are shown and the selected sort applies to that result.
* [ ] Given no status or no species checkbox is selected, when the filters are applied, then no plants are displayed and Plantly shows a filtered empty state.
* [ ] Given no plants exist, when the collection is opened, then Plantly displays an empty state with an action to add the first plant through UC-004.
* [ ] Given plants exist but none match the filters, when the filtered collection is displayed, then Plantly shows a filtered empty state rather than the collection-wide empty state.
* [ ] Given a plant is displayed, when the user selects its entry, then Plantly opens that plant's UC-007 detail.
* [ ] Given the collection cannot be retrieved, when loading fails, then Plantly communicates the failure and provides a way to try again.
* [ ] Given the user views, filters, searches, sorts, or navigates from the collection, when the displayed result changes, then no plant or species data is modified.

## Out of Scope

* Displaying or filtering by location; location behaviour belongs to UC-012 and UC-013.
* Displaying plant images.
* Displaying recent care events or care summaries.
* Additional sort fields.
* Pagination.
