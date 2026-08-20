# UC-036: View Latest Plant Image on Home

## Status

Implemented

## Goal

Help the user identify plants quickly by showing each active plant's most recently added image on its Home overview card.

## Preconditions

* The user has opened the Home plant overview from UC-034.

## Behaviour

1. Plantly retrieves the most recently added image associated with each active plant in the Home overview.
2. When an active plant has one or more images, Plantly displays its newest image on that plant's overview card.
3. The plant card continues to provide the plant information and navigation defined by UC-034 and UC-035.

## Edge Cases

### No images

If a plant has no associated image, Plantly displays no image and does not add an image placeholder or empty-state message to its card.

### Images added at the same time

If multiple images have the same addition date, Plantly uses the same stable newest-first ordering defined by UC-024.

### Image unavailable

If the newest image content cannot be displayed, Plantly leaves the image area empty without preventing the rest of the overview from being used.

## Postconditions

* Viewing the latest image does not modify the plant or its images.
* At most one image is displayed on each active plant card.

## Business Rules

* BR-016 — Historical Data Preservation
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given an active plant has multiple images, when Home is displayed, then only its most recently added image is displayed on that plant's card.
* [ ] Given multiple images have the same addition date, when Home is displayed repeatedly, then the image selected as newest is stable and follows UC-024 ordering.
* [ ] Given an active plant has no images, when Home is displayed, then its card contains no image, image placeholder, or image empty-state message.
* [ ] Given the newest image content is unavailable, when Home is displayed, then the image area is left empty and the plant card remains usable.
* [ ] Given a dead or archived plant retains images, when Home is displayed, then neither that plant nor its images are included.
* [ ] Given the user views Home, when no other action is taken, then no plant or image data is modified.

## Out of Scope

* Viewing the complete image collection or image detail; this belongs to UC-024.
* Adding or removing images; these belong to UC-022 and UC-025.
* Selecting a preferred cover image independently of newest-first ordering.
* Captions, image editing, or image analysis.
