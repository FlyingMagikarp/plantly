# UC-025: Remove Image

## Status

Ready

## Goal

Allow the user to permanently remove an unwanted or incorrect image from Plantly without removing its plant.

## Preconditions

* The image exists and is associated with an existing plant.
* The user has selected that image from the image view on the plant detail view defined by UC-024.

## Behaviour

1. From the image view on the plant detail view, the user initiates removal of a specific image.
2. Plantly identifies the image and asks the user to confirm permanent removal.
3. If confirmed, Plantly permanently removes the image and its stored association.
4. Plantly updates the image view and provides unobtrusive confirmation.
5. If cancelled, Plantly leaves all data unchanged.

## Edge Cases

### Removal cancelled

If the user does not confirm, Plantly leaves the image and all other data unchanged.

### Image unavailable

If the image no longer exists or is not associated with the identified context, Plantly removes nothing and communicates that it was not found.

### Inactive plant

If the associated plant is dead or archived, Plantly does not offer or apply independent image removal and leaves the image unchanged.

### Removal fails

If removal fails, Plantly communicates the failure, retains the image and its association, and allows the user to try again.

## Postconditions

* After success, the selected image and its association no longer exist.
* The associated plant, other images, and historical facts remain unchanged.

## Business Rules

* BR-016 — Historical Data Preservation
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given an image is displayed, when the user initiates removal, then Plantly asks for confirmation and identifies the permanent consequence.
* [ ] Given an image is displayed outside the image view on the plant detail view, when it is viewed, then independent removal is not offered from that context.
* [ ] Given an image belongs to a dead or archived plant, when the image is viewed, then independent removal is unavailable and the image remains unchanged.
* [ ] Given removal confirmation is displayed, when the user cancels, then the image and all other data remain unchanged.
* [ ] Given the user confirms removal of an existing image, when removal succeeds, then only that image and its association are removed.
* [ ] Given the image no longer exists or does not belong to the identified context, when removal is confirmed, then Plantly removes no other image and communicates that the image was not found.
* [ ] Given removal fails, when Plantly reports the failure, then the image remains available and the user can try again.

## Out of Scope

* Removing a plant.
* Bulk image removal.
* Recovering a permanently removed image.
