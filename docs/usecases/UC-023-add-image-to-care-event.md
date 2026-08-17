# UC-023: Add Image to Care Event

## Status

Draft

## Goal

Allow the user to attach an image to a recorded care event so visual context is preserved with the historical event.

## Preconditions

* The plant and care event exist, and the event belongs to that plant.
* The user has initiated image attachment for that event.

## Behaviour

1. The user selects an image for the identified care event.
2. Plantly validates the plant, care event, relationship, and selected file.
3. Plantly attaches the image to that event without creating or changing a care event.
4. Plantly provides unobtrusive confirmation and makes the image available with the event.

## Edge Cases

### Invalid image

If the file does not meet supported image constraints, Plantly identifies it as invalid and attaches nothing.

### Event or plant unavailable

If the plant or event no longer exists, or the event does not belong to the identified plant, Plantly attaches nothing and communicates that the selected resource was not found.

### Attachment fails

If attachment fails, Plantly communicates the failure, leaves the event and existing images unchanged, and allows the user to try again.

## Postconditions

* After success, one new image is associated with the identified care event.
* The care event's recorded facts are unchanged.
* Invalid input or failure creates no partial or orphaned image.

## Business Rules

* BR-003 — Historical Care Events
* BR-005 — Optional Event Data
* BR-016 — Historical Data Preservation
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given an existing care event and a valid supported image, when the user adds it, then one new image is associated with that event.
* [ ] Given an invalid or unsupported file, when the user submits it, then no image is attached and the invalid file is identified.
* [ ] Given the event does not exist or does not belong to the identified plant, when attachment is submitted, then no image is attached and Plantly communicates that the event was not found.
* [ ] Given attachment succeeds, when the event is displayed, then the attached image is available without a second care event being created.
* [ ] Given attachment fails, when Plantly reports the failure, then the event and existing images remain unchanged and no orphaned image exists.

## Out of Scope

* Attaching an image while initially recording an event.
* Attaching an image directly to a plant; this belongs to UC-022.
* Removing an image; this belongs to UC-025.
* Editing, annotating, or analysing image content.

## Open Questions

* Which image formats and maximum file size are supported?
* May images be added to events belonging to dead or archived plants?
* Where and how are care-event images displayed?
* Is optional image metadata such as a caption or capture date required?

