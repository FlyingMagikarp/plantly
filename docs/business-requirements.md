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
| [UC-006](usecases/UC-006-remove-plant-from-collection.md) | **Remove Plant from Collection** — Mark a plant dead or archived, restore it, or permanently delete a faulty record with its dependent history. | Implemented |
| [UC-007](usecases/UC-007-view-plant.md) | **View Plant** — Display the maintained details of one plant and the actions available for its lifecycle state. | Implemented |
| [UC-008](usecases/UC-008-view-plant-collection.md) | **View Plant Collection** — Search, sort, and filter the complete plant collection. | Implemented |
| [UC-009](usecases/UC-009-create-location.md) | **Create Location** — Add a uniquely named physical location for organising plants. | Implemented |
| [UC-010](usecases/UC-010-update-location.md) | **Update Location** — Rename a location without changing its identity or plant assignments. | Implemented |
| [UC-011](usecases/UC-011-remove-location.md) | **Remove Location** — Permanently remove a location while preserving its plants as unassigned. | Implemented |
| [UC-012](usecases/UC-012-assign-plant-to-location.md) | **Assign Plant to Location** — Assign, move, or unassign an active plant from its detail view. | Implemented |
| [UC-013](usecases/UC-013-view-plants-by-location.md) | **View Plants by Location** — Display active plants grouped by their current location, including unassigned plants. | Implemented |
| [UC-014](usecases/UC-014-record-watering.md) | **Record Watering** — Record a watering care event. | Implemented |
| [UC-015](usecases/UC-015-record-pruning.md) | **Record Pruning** — Record a pruning care event. | Implemented |
| [UC-016](usecases/UC-016-record-repotting.md) | **Record Repotting** — Record a repotting care event. | Implemented |
| [UC-017](usecases/UC-017-record-pest-treatment.md) | **Record Pest Treatment** — Record a pest-treatment care event. | Implemented |
| [UC-018](usecases/UC-018-record-observation.md) | **Record Observation** — Record a general plant observation. | Implemented |
| [UC-019](usecases/UC-019-view-plant-care-history.md) | **View Plant Care History** — Review the recorded care-event history for a plant. | Implemented |
| [UC-020](usecases/UC-020-correct-care-event.md) | **Correct Care Event** — Correct an inaccurate recorded care event. | Implemented |
| [UC-021](usecases/UC-021-remove-incorrect-care-event.md) | **Remove Incorrect Care Event** — Remove a care event that was recorded incorrectly. | Implemented |
| [UC-022](usecases/UC-022-add-plant-image.md) | **Add Plant Image** — Attach an image to a plant. | Implemented |
| [UC-024](usecases/UC-024-view-plant-images.md) | **View Plant Images** — View images associated with a plant. | Implemented |
| [UC-025](usecases/UC-025-remove-image.md) | **Remove Image** — Remove an image from Plantly. | Implemented |
| [UC-030](usecases/UC-030-start-plant-care-round.md) | **Start Plant Care Round** — Begin a location-oriented plant-care round. | Implemented |
| [UC-031](usecases/UC-031-record-care-during-plant-round.md) | **Record Care During Plant Round** — Record care efficiently while progressing through a care round. | Implemented |
| [UC-032](usecases/UC-032-complete-plant-care-round.md) | **Complete Plant Care Round** — Finish an active care round. | Implemented |
| [UC-033](usecases/UC-033-navigate-application.md) | **Navigate Application** — Provide consistent desktop sidebar and collapsible mobile navigation between implemented application areas. | Implemented |
| [UC-034](usecases/UC-034-view-home-plant-overview.md) | **View Home Plant Overview** — Show active plants by location on Home with nickname and species. | Implemented |
| [UC-035](usecases/UC-035-view-latest-care-on-home.md) | **View Latest Care on Home** — Add the latest recorded care date, or the absence of recorded care, to each Home plant card. | Implemented |
| [UC-036](usecases/UC-036-view-latest-image-on-home.md) | **View Latest Plant Image on Home** — Show the newest associated image on each Home plant card when one exists. | Implemented |

## Known Dependencies

* UC-001 provides the authoritative runtime species data used by species and plant workflows.
* UC-009 through UC-011 establish location maintenance used by UC-012, UC-013, and UC-034.
* UC-014 through UC-018 establish the care events surfaced by UC-019 and the latest-care information added to Home by UC-035.
* UC-034 defines the Home destination required by UC-033.
* UC-035 enriches the Home overview defined by UC-034 after care-event recording is available.
* UC-036 enriches the Home overview defined by UC-034 using the image ordering established by UC-024.

## Requirements Awaiting Use Cases

The following work was previously recorded as a todo but is not yet defined as a behavioural use case:

* Add further authoritative species definitions.
* Back up and migrate plant records from Plantly v1.

These items require clarification before an identifier and lifecycle state are assigned. Applying the shared visual language is governed by `docs/ui-design.md` and the relevant UI use cases rather than tracked as an independent use case.
