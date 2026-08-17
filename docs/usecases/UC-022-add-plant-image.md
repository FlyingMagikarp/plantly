# UC-022: Add Plant Image

## Status

Draft

## Goal

Allow the user to attach an image to a plant so its appearance can be retained with the plant record.

## Preconditions

* The plant exists.
* The user has initiated image attachment from a view that identifies the plant.

## Behaviour

1. The user selects an image for the identified plant.
2. Plantly validates the plant and selected file.
3. Plantly attaches the image to that plant.
4. Plantly makes the image available through UC-024 and provides unobtrusive confirmation.

## Edge Cases

### Invalid image

If the selected file does not meet the supported image constraints, Plantly identifies it as invalid and does not attach it.

### Plant no longer available

If the plant no longer exists when the image is submitted, Plantly attaches no image and communicates that the plant was not found.

### Attachment fails

If attachment fails, Plantly communicates the failure, leaves existing plant data and images unchanged, and allows the user to try again.

## Postconditions

* After success, one new image is associated with the identified plant.
* Invalid input or failure creates no partial or orphaned image.

## Business Rules

* BR-016 — Historical Data Preservation
* BR-022 — Plant Lifecycle
* BR-023 — Faulty Plant Record Deletion

## Acceptance Criteria

* [ ] Given an existing plant and a valid supported image, when the user adds it, then one new image is associated with that plant.
* [ ] Given an invalid or unsupported file, when the user submits it, then no image is attached and the invalid file is identified.
* [ ] Given the plant no longer exists, when attachment is submitted, then no image is attached to any plant and Plantly communicates that the plant was not found.
* [ ] Given attachment fails, when Plantly reports the failure, then no partial or orphaned image exists and the user can try again.
* [ ] Given attachment succeeds, when the plant's images are viewed through UC-024, then the new image is available.

## Out of Scope

* Attaching an image to a care event; this belongs to UC-023.
* Viewing the plant's image collection; this belongs to UC-024.
* Removing an image; this belongs to UC-025.
* Editing, annotating, or analysing image content.

## Open Questions

* Which image formats and maximum file size are supported?
* May images be added to dead or archived plants?
* Is optional image metadata such as a caption or capture date required?

