# UC-024: View Plant Images

## Status

Draft

## Goal

Allow the user to review images associated with a plant without changing the plant or its history.

## Preconditions

* The plant exists.
* The user has opened a view that identifies the plant.

## Behaviour

1. Plantly retrieves images associated with the plant.
2. Plantly displays the images with enough context to distinguish their association.
3. The user may select an image to view it in greater detail.
4. Plantly provides access to removal through UC-025 where applicable.

## Edge Cases

### No images

If no images are associated with the plant, Plantly displays an empty image state and invents no content.

### Image unavailable

If an image record exists but its content cannot be retrieved, Plantly communicates that the image is unavailable without preventing access to other available images.

### Plant unavailable

If the plant no longer exists, Plantly communicates that it was not found and displays no other plant's images.

## Postconditions

* Viewing images does not modify the plant, care events, or images.

## Business Rules

* BR-016 — Historical Data Preservation
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given a plant has associated images, when its images are viewed, then each available associated image is displayed once.
* [ ] Given a plant has no associated images, when its images are viewed, then an empty state is displayed.
* [ ] Given the plant is dead or archived and retains images, when its images are viewed, then those images remain available.
* [ ] Given one image cannot be retrieved, when the collection is displayed, then Plantly identifies that image as unavailable and still displays other available images.
* [ ] Given the plant no longer exists, when its images are requested, then Plantly displays no images from another plant and communicates that the plant was not found.
* [ ] Given the user only views images, when no image action is taken, then no stored data is modified.

## Out of Scope

* Adding plant or care-event images; these belong to UC-022 and UC-023.
* Removing images; this belongs to UC-025.
* Editing, downloading, exporting, or analysing images.

## Open Questions

* Does this view combine images attached directly to the plant with images attached to its care events?
* What ordering should be used, and which date determines it?
* Is pagination or another collection limit required?

