# UC-025: Remove Image

## Status

Draft

## Goal

Allow the user to permanently remove an unwanted or incorrect image from Plantly without removing its plant or care event.

## Preconditions

* The image exists and is associated with an existing plant or care event.
* The user has selected that image from an identifying context.

## Behaviour

1. The user initiates removal of a specific image.
2. Plantly identifies the image and asks the user to confirm permanent removal.
3. If confirmed, Plantly permanently removes the image and its stored association.
4. Plantly updates the image view and provides unobtrusive confirmation.
5. If cancelled, Plantly leaves all data unchanged.

## Edge Cases

### Removal cancelled

If the user does not confirm, Plantly leaves the image and all other data unchanged.

### Image unavailable

If the image no longer exists or is not associated with the identified context, Plantly removes nothing and communicates that it was not found.

### Removal fails

If removal fails, Plantly communicates the failure, retains the image and its association, and allows the user to try again.

## Postconditions

* After success, the selected image and its association no longer exist.
* The associated plant, care event, other images, and historical facts remain unchanged.

## Business Rules

* BR-003 — Historical Care Events
* BR-016 — Historical Data Preservation
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given an image is displayed, when the user initiates removal, then Plantly asks for confirmation and identifies the permanent consequence.
* [ ] Given removal confirmation is displayed, when the user cancels, then the image and all other data remain unchanged.
* [ ] Given the user confirms removal of an existing image, when removal succeeds, then only that image and its association are removed.
* [ ] Given the image no longer exists or does not belong to the identified context, when removal is confirmed, then Plantly removes no other image and communicates that the image was not found.
* [ ] Given removal fails, when Plantly reports the failure, then the image remains available and the user can try again.
* [ ] Given a care-event image is removed, when its event is subsequently viewed, then the event and its recorded facts remain unchanged.

## Out of Scope

* Removing a plant or care event.
* Bulk image removal.
* Recovering a permanently removed image.

## Open Questions

* May images belonging to dead or archived plants be removed independently?
* Must removal be available from every place an image is displayed?

