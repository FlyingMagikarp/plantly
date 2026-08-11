# UC-010: Update Location

## Status

Implemented

## Goal

Allow the user to rename an existing location without changing its technical identity or plant assignments.

## Preconditions

* The location exists.
* The user has initiated renaming it from location management.

## Behaviour

1. Plantly displays the current location name for editing.
2. The user changes the name and submits it.
3. Plantly removes trailing whitespace and validates that the resulting name is present and is not used by another location, ignoring capitalization.
4. Plantly updates the name while retaining the location's technical identifier and all plant assignments.
5. Plantly displays the updated location in location management.

## Edge Cases

### Capitalization-only change

Changing only the capitalization of the selected location's name is valid because the selected location is not a conflicting location.

### Missing or duplicate name

If the cleaned name is missing or is used by another location ignoring capitalization, Plantly does not apply the change and identifies the invalid field.

### Location no longer available

If the location no longer exists when the update is submitted, Plantly communicates that it could not be found and does not modify another location.

### Update fails

If Plantly cannot complete the update, it communicates the failure, preserves the entered name where practical, and leaves the stored location unchanged.

## Postconditions

* The location has the cleaned submitted name and retains its technical identifier and plant assignments.
* An invalid or failed update leaves the location unchanged.

## Business Rules

* BR-002 — Plant Location
* BR-024 — Location Identity

## Acceptance Criteria

* [ ] Given an existing location and a unique non-empty name, when the user submits the name, then the location is renamed and retains its technical identifier and plant assignments.
* [ ] Given a submitted name has trailing whitespace, when the location is renamed, then the whitespace is removed before storage.
* [ ] Given a location named `Balcony`, when the user renames that location to `balcony`, then the capitalization-only change succeeds.
* [ ] Given another location named `Kitchen` exists, when the user renames a location to `kitchen` or `Kitchen   `, then the rename is rejected and both locations remain unchanged.
* [ ] Given the cleaned name is empty, when the user submits it, then the rename is rejected and the stored location remains unchanged.
* [ ] Given the selected location no longer exists, when the update is submitted, then Plantly communicates that it was not found and does not modify another location.
* [ ] Given a valid update fails, when Plantly reports the failure, then the location name, technical identifier, and plant assignments remain unchanged.

## Out of Scope

* Changing a location's technical identifier.
* Assigning or moving plants; this belongs to UC-012.
* Adding location attributes other than its name.
