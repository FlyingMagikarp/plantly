# Plantly Business Requirements

## Purpose

This document is the authoritative overview of Plantly use cases. It records every assigned use-case identifier, its current intent, and its lifecycle state.

Detailed behavioural requirements and acceptance criteria remain in the individual files under `docs/usecases/`. A row marked `Planned` reserves an identifier and records only a high-level intent; it is not an implementable specification.

## States

* `Planned` — the identifier and high-level intent are recorded, but no detailed use-case specification exists yet.
* `Draft` — a specification exists, but requirements are still being defined.
* `Ready` — the specification is sufficiently defined for implementation.
* `Implemented` — implementation and validation are complete.
* `Superseded` — the use case has been replaced or is no longer applicable.

## Use-Case Overview

| Number | Title and quick summary | State |
| --- | --- | --- |
| [UC-001](usecases/UC-001-sync-species-definitions.md) | **Synchronize Species Definitions** — Validate the authoritative species Markdown set and atomically create, update, archive, or reactivate runtime species data. | Implemented |
| [UC-002](usecases/UC-002-view-species.md) | **View Species** — Display one species' care knowledge and its associated recorded plants. | Implemented |
| [UC-003](usecases/UC-003-list-species.md) | **List Species** — Provide a sortable and filterable species overview with associated plant counts. | Implemented |
| [UC-004](usecases/UC-004-add-plant-to-collection.md) | **Add Plant to Collection** — Register an individual plant with its nickname, species, acquisition date, and optional notes. | Implemented |
| [UC-005](usecases/UC-005-update-plant.md) | **Update Plant** — Change the maintained details of an active plant without changing its technical identity. | Implemented |
| [UC-006](usecases/UC-006-remove-plant-from-collection.md) | **Remove Plant from Collection** — Mark a plant dead or archived, restore it, or permanently delete a faulty record with its dependent history. | Ready |
| [UC-007](usecases/UC-007-view-plant.md) | **View Plant** — Display the maintained details of one plant and the actions available for its lifecycle state. | Implemented |
| [UC-008](usecases/UC-008-view-plant-collection.md) | **View Plant Collection** — Search, sort, and filter the complete plant collection. | Implemented |
| [UC-009](usecases/UC-009-create-location.md) | **Create Location** — Add a uniquely named physical location for organising plants. | Implemented |
| [UC-010](usecases/UC-010-update-location.md) | **Update Location** — Rename a location without changing its identity or plant assignments. | Implemented |
| [UC-011](usecases/UC-011-remove-location.md) | **Remove Location** — Permanently remove a location while preserving its plants as unassigned. | Implemented |
| [UC-012](usecases/UC-012-assign-plant-to-location.md) | **Assign Plant to Location** — Assign, move, or unassign an active plant from its detail view. | Implemented |
| [UC-013](usecases/UC-013-view-plants-by-location.md) | **View Plants by Location** — Display active plants grouped by their current location, including unassigned plants. | Implemented |
| UC-014 | **Record Watering** — Record a watering care event. | Planned |
| UC-015 | **Record Pruning** — Record a pruning care event. | Planned |
| UC-016 | **Record Repotting** — Record a repotting care event. | Planned |
| UC-017 | **Record Pest Treatment** — Record a pest-treatment care event. | Planned |
| UC-018 | **Record Observation** — Record a general plant observation. | Planned |
| UC-019 | **View Plant Care History** — Review the recorded care-event history for a plant. | Planned |
| UC-020 | **Correct Care Event** — Correct an inaccurate recorded care event. | Planned |
| UC-021 | **Remove Incorrect Care Event** — Remove a care event that was recorded incorrectly. | Planned |
| UC-022 | **Add Plant Image** — Attach an image to a plant. | Planned |
| UC-023 | **Add Image to Care Event** — Attach an image to a recorded care event. | Planned |
| UC-024 | **View Plant Images** — View images associated with a plant. | Planned |
| UC-025 | **Remove Image** — Remove an image from Plantly. | Planned |
| UC-026 | **Define Species Seasonal Phases** — Represent recurring seasonal phases for a species. | Planned |
| UC-027 | **Determine Current Seasonal Phase** — Determine which seasonal phase currently applies to a species. | Planned |
| UC-028 | **View Current Seasonal Guidance** — Display the seasonal care guidance currently relevant to a plant. | Planned |
| UC-029 | **Define Seasonal Fertilizer Guidance** — Represent fertilizer guidance associated with seasonal phases. | Planned |
| UC-030 | **Start Plant Care Round** — Begin a location-oriented plant-care round. | Planned |
| UC-031 | **Record Care During Plant Round** — Record care efficiently while progressing through a care round. | Planned |
| UC-032 | **Complete Plant Care Round** — Finish an active care round. | Planned |
| [UC-033](usecases/UC-033-navigate-application.md) | **Navigate Application** — Provide consistent desktop sidebar and collapsible mobile navigation between implemented application areas. | Implemented |
| [UC-034](usecases/UC-034-view-home-plant-overview.md) | **View Home Plant Overview** — Show active plants by location on Home with nickname and species. | Implemented |
| [UC-035](usecases/UC-035-view-latest-care-on-home.md) | **View Latest Care on Home** — Add the latest recorded care date, or the absence of recorded care, to each Home plant card. | Draft |

## Known Dependencies

* UC-001 provides the authoritative runtime species data used by species and plant workflows.
* UC-009 through UC-011 establish location maintenance used by UC-012, UC-013, and UC-034.
* UC-014 through UC-018 establish the care events surfaced by UC-019 and the latest-care information added to Home by UC-035.
* UC-034 defines the Home destination required by UC-033.
* UC-035 enriches the Home overview defined by UC-034 after care-event recording is available.

## Requirements Awaiting Use Cases

The following work was previously recorded as a todo but is not yet defined as a behavioural use case:

* Add further authoritative species definitions.
* Back up and migrate plant records from Plantly v1.

These items require clarification before an identifier and lifecycle state are assigned. Applying the shared visual language is governed by `docs/ui-design.md` and the relevant UI use cases rather than tracked as an independent use case.
