# UC-004: Add Plant to Collection

## Status

Ready

## Goal

Allow the user to record a concrete plant in the collection with enough information to identify the plant and associate it with its species.

## Preconditions

* At least one active species exists.
* The user has initiated adding a plant from the plant collection.

## Behaviour

1. Plantly requests a nickname, species, acquisition date, and optional notes for the new plant.
2. Plantly allows selection only from active species.
3. The user enters a nickname, selects an active species, selects an acquisition date, and may enter notes.
4. Plantly validates that the nickname is present, the selected species is active, and the acquisition date is not later than the current date.
5. Plantly assigns the plant the next sequential technical identifier and the `active` lifecycle status.
6. Plantly adds the plant to the collection and displays the resulting plant detail defined by UC-007.

## Edge Cases

### Missing required information

If the nickname, species, or acquisition date is missing, Plantly does not add the plant, identifies the invalid field, and preserves the entered information where practical.

### Future acquisition date

If the acquisition date is later than the current date, Plantly does not add the plant and identifies the acquisition date as invalid. The current date is valid.

### Non-unique nickname

A nickname already used by another plant is valid and does not prevent the plant from being added.

### Species becomes unavailable

If the selected species is archived or no longer exists before the plant is added, Plantly does not add the plant and requires selection of an available active species.

### No active species

If no active species is available, Plantly communicates that a plant cannot be added because an active species is required and does not offer archived species for selection.

### Addition fails

If Plantly cannot add the plant, it communicates the failure, preserves the entered information where practical, and allows the user to try again without creating a partial or duplicate plant.

## Postconditions

* One active plant exists with an immutable sequential technical identifier, the entered nickname, selected active species, acquisition date, and optional notes.
* No plant is created after invalid input or a failed addition.

## Business Rules

* BR-001 — Plant Species
* BR-020 — Plant Identity
* BR-021 — Plant Acquisition Date
* BR-022 — Plant Lifecycle
* BR-018 — Species Archival

## Acceptance Criteria

* [ ] Given an active species exists, when the user supplies a nickname, selects that species, selects the current date or an earlier acquisition date, and adds the plant, then one active plant is added with those values and a system-assigned sequential technical identifier.
* [ ] Given the user supplies notes, when the plant is added, then those notes are stored with the plant.
* [ ] Given the user omits notes, when all required information is valid, then the plant is added without notes.
* [ ] Given another plant has the same nickname, when the user submits otherwise valid information, then the new plant is added with that nickname.
* [ ] Given the nickname, species, or acquisition date is missing, when the user attempts to add the plant, then no plant is added and the invalid field is identified.
* [ ] Given the selected acquisition date is the current date, when the user adds the plant, then the date is accepted.
* [ ] Given the selected acquisition date is in the future, when the user attempts to add the plant, then no plant is added and the acquisition date is identified as invalid.
* [ ] Given active and archived species exist, when the user selects a species, then only active species are available for selection.
* [ ] Given a selected species becomes archived or unavailable before submission, when the user attempts to add the plant, then no plant is added and an active species must be selected.
* [ ] Given no active species exists, when the user attempts to add a plant, then Plantly communicates that an active species is required and does not add a plant.
* [ ] Given a valid addition cannot be completed, when Plantly reports the failure, then no partial or duplicate plant exists and the user can try again.
* [ ] Given a plant is added successfully, when the operation completes, then Plantly displays its UC-007 plant detail.

## Out of Scope

* Creating or editing species.
* Assigning a location; this belongs to UC-012.
* Adding plant images; this belongs to UC-022.
* Recording care events.

