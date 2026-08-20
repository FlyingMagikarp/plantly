# UC-022: Add Plant Image

## Status

Ready

## Goal

Allow the user to attach an image to a plant so its appearance can be retained with the plant record.

## Preconditions

* The plant exists.
* The user has initiated image attachment from a view that identifies the plant.

## Behaviour

1. The user selects an image for the identified plant.
2. Plantly validates that the plant is active and that the selected file is a JPEG or PNG image no larger than 10 MB.
3. Plantly attaches the image to that plant.
4. Plantly makes the image available through UC-024 and provides unobtrusive confirmation.

## Edge Cases

### Invalid image

If the selected file is not a JPEG or PNG image, or is larger than 10 MB, Plantly identifies it as invalid and does not attach it.

### Inactive plant

If the plant is dead or archived, Plantly does not attach the image and communicates that images can only be added to active plants.

### Plant no longer available

If the plant no longer exists when the image is submitted, Plantly attaches no image and communicates that the plant was not found.

### Attachment fails

If attachment fails, Plantly communicates the failure, leaves existing plant data and images unchanged, and allows the user to try again.

## Postconditions

* After success, one new image is associated with the identified plant.
* The image has no caption, capture date, or other user-supplied metadata.
* Invalid input or failure creates no partial or orphaned image.

## Business Rules

* BR-016 — Historical Data Preservation
* BR-022 — Plant Lifecycle
* BR-023 — Faulty Plant Record Deletion

## Acceptance Criteria

* [ ] Given an active plant and a JPEG or PNG image no larger than 10 MB, when the user adds it, then one new image is associated with that plant without requiring image metadata.
* [ ] Given a file is not a JPEG or PNG image or is larger than 10 MB, when the user submits it, then no image is attached and the invalid file is identified.
* [ ] Given a plant is dead or archived, when the user attempts to add an image, then no image is attached and Plantly communicates that the action is unavailable.
* [ ] Given the plant no longer exists, when attachment is submitted, then no image is attached to any plant and Plantly communicates that the plant was not found.
* [ ] Given attachment fails, when Plantly reports the failure, then no partial or orphaned image exists and the user can try again.
* [ ] Given attachment succeeds, when the plant's images are viewed through UC-024, then the new image is available.

## Out of Scope

* Viewing the plant's image collection; this belongs to UC-024.
* Removing an image; this belongs to UC-025.
* Adding captions, capture dates, or other user-supplied image metadata.
* Editing, annotating, or analysing image content.
