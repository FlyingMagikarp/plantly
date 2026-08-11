# UC-003: List Species

## Status

Implemented

## Goal

Provide a scannable overview of all species and the number of recorded plants associated with each species, while allowing the user to exclude archived species and sort the overview.

## Preconditions

* The user has opened the species overview in the web application.

## Behaviour

1. Plantly displays every active and archived species in the species overview by default.
2. For each species, Plantly displays its permanent numeric identifier, species name, archival status, and the number of recorded plants associated with it.
3. Species with no associated plants display a plant count of zero.
4. The user may enable a filter that excludes archived species from the overview.
5. The user may disable that filter to include archived species again.
6. The user may sort the displayed species by permanent numeric identifier, species name, or number of recorded plants.
7. Each supported sort field may be ordered in ascending or descending order.
8. Filtering and sorting apply together to the currently displayed species.

## Edge Cases

### No species

If no species exist, Plantly displays an empty state rather than species rows.

### No active species

If excluding archived species leaves no species to display, Plantly displays an empty state that reflects the active filter.

### Equal sort values

Species with equal values for the selected sort field remain present in the overview; their relative order is not specified by this use case.

### Overview unavailable

If Plantly cannot retrieve the species overview, it communicates that the overview could not be loaded and allows the user to try again.

## Postconditions

* Viewing, filtering, and sorting the species overview do not change species or plant data.
* The overview reflects the selected archived-species filter and sort field and direction.

## Business Rules

* BR-001 — Plant Species
* BR-017 — Species Identifier
* BR-018 — Species Archival

## Acceptance Criteria

* [ ] Given active and archived species exist, when the user opens the species overview, then every active and archived species is displayed by default.
* [ ] Given a species is displayed, when the user views its overview entry, then its permanent numeric identifier, species name, archival status, and associated plant count are displayed.
* [ ] Given a species has no associated plants, when it is displayed, then its associated plant count is zero.
* [ ] Given active and archived species are displayed, when the user enables the exclusion of archived species, then only active species remain displayed.
* [ ] Given archived species are excluded, when the user disables the exclusion, then archived species are displayed again alongside active species.
* [ ] Given species with different numeric identifiers are displayed, when the user sorts by identifier in ascending or descending order, then the displayed species follow the selected numeric order.
* [ ] Given species with different names are displayed, when the user sorts by species name in ascending or descending order, then the displayed species follow the selected name order.
* [ ] Given species with different associated plant counts are displayed, when the user sorts by number of recorded plants in ascending or descending order, then the displayed species follow the selected numeric count order.
* [ ] Given archived species are excluded, when the user changes the sort field or direction, then the sort applies only to the active species currently displayed.
* [ ] Given no species match the current archived-species filter, when the overview is displayed, then Plantly shows an empty state instead of species entries.
* [ ] Given the species overview cannot be retrieved, when loading fails, then Plantly communicates the failure and provides a way to try again.
* [ ] Given the user filters or sorts the species overview, when the displayed overview changes, then no species or plant data is modified.

## Out of Scope

* Viewing the full details of one species; this belongs to UC-002.
* Creating, editing, archiving, or restoring species through the web application.
* Adding, updating, or removing plants from the collection.
* Searching species by free text.
* Paginating the species overview.

