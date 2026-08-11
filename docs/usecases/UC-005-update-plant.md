# UC-005: Update Plant

## Status

Implemented

## Goal

Allow the user to correct or change the maintained details of an active plant without changing its technical identity.

## Preconditions

* The plant exists and has the `active` lifecycle status.
* The user has initiated editing from the plant detail defined by UC-007.

## Behaviour

1. Plantly displays the plant's current nickname, species, acquisition date, and optional notes for editing, including an archived species already associated with the plant.
2. The user may change the nickname, species, acquisition date, and notes, including clearing existing notes.
3. When changing species, Plantly allows selection only from active species. An existing archived species may be retained while other fields are changed, but it cannot be newly selected as a replacement species.
4. Plantly validates that the nickname is present, any replacement species is active, and the acquisition date is not later than the current date.
5. Plantly applies all valid changes together while retaining the plant's technical identifier and `active` status.
6. Plantly displays the updated plant detail defined by UC-007.

## Edge Cases

### Plant is dead or archived

If the plant is dead or archived, Plantly does not allow its maintained fields to be updated. The plant must first be restored to active through UC-006.

### Invalid information

If the nickname or species is missing, or the acquisition date is missing or in the future, Plantly does not apply any changes, identifies the invalid field, and preserves the entered information where practical. The current date is valid.

### Non-unique nickname

Changing the nickname to one already used by another plant is valid.

### Species becomes unavailable

If the selected replacement species is archived or no longer exists before the update is applied, Plantly does not apply any changes and requires selection of an available active species.

### Existing species is archived

If an active plant's existing species has been archived, the user may retain that species while updating other fields. If the user changes the species, the replacement must be active.

### Plant no longer available

If the plant no longer exists when the update is submitted, Plantly communicates that the plant could not be found and does not modify another plant.

### Update fails

If Plantly cannot complete the update, it communicates the failure, preserves the entered information where practical, and leaves every stored plant field unchanged.

## Postconditions

* After a successful update, the active plant contains all submitted values and retains its original technical identifier.
* After an invalid or failed update, every stored plant field remains unchanged.

## Business Rules

* BR-001 — Plant Species
* BR-020 — Plant Identity
* BR-021 — Plant Acquisition Date
* BR-022 — Plant Lifecycle
* BR-018 — Species Archival

## Acceptance Criteria

* [ ] Given an active plant, when the user submits a changed nickname, active species, valid acquisition date, or notes, then all submitted values are reflected in that plant.
* [ ] Given an active plant with notes, when the user clears the notes and submits valid information, then the plant no longer has notes.
* [ ] Given another plant has the submitted nickname, when an otherwise valid update is submitted, then the nickname is accepted.
* [ ] Given an active plant, when it is updated, then its technical identifier and lifecycle status remain unchanged.
* [ ] Given active and archived species exist, when the user chooses a replacement species, then only active species are available for selection.
* [ ] Given a selected replacement species becomes archived or unavailable before submission, when the user submits the update, then no plant fields are changed and an active species must be selected.
* [ ] Given an active plant already belongs to an archived species, when the user updates other valid fields without replacing that species, then the update succeeds and the existing species association is retained.
* [ ] Given the submitted acquisition date is the current date, when the update is submitted, then the date is accepted.
* [ ] Given a required value is missing or the acquisition date is in the future, when the update is submitted, then no plant fields are changed and the invalid field is identified.
* [ ] Given a dead or archived plant, when the user attempts to edit its maintained fields, then the update is unavailable and the plant remains unchanged.
* [ ] Given the selected plant no longer exists, when an update is submitted, then Plantly communicates that it was not found and does not modify another plant.
* [ ] Given a valid update cannot be completed, when Plantly reports the failure, then every stored plant field remains unchanged and the user can try again.
* [ ] Given an update succeeds, when the operation completes, then Plantly displays the updated UC-007 plant detail.

## Out of Scope

* Changing plant lifecycle status; this belongs to UC-006.
* Assigning or changing a location; this belongs to UC-012.
* Managing plant images.
* Recording or changing care events.
