# UC-009: Create Location

## Status

Implemented

## Goal

Allow the user to create a named physical location to which plants can be assigned.

## Preconditions

* The user has opened location management in the web application.

## Behaviour

1. The user initiates creating a location.
2. Plantly requests the location name.
3. The user enters a name and submits it.
4. Plantly removes trailing whitespace and validates that the resulting name is present and is not already used by another location, ignoring capitalization.
5. Plantly creates the location with an immutable system-assigned technical identifier and displays the created location in location management.

## Edge Cases

### Missing name

If the name is missing or consists only of trailing whitespace, Plantly does not create a location, identifies the name as invalid, and preserves the entered value where practical.

### Duplicate name

If another location has the same name ignoring capitalization and trailing whitespace, Plantly does not create a location and identifies that the name is already used.

### Creation fails

If Plantly cannot create the location, it communicates the failure, preserves the entered name where practical, and does not create a partial or duplicate location.

## Postconditions

* One location exists with the cleaned name and a new immutable system-assigned technical identifier.
* Invalid or failed creation leaves the set of locations unchanged.

## Business Rules

* BR-024 — Location Identity

## Acceptance Criteria

* [ ] Given no location has the submitted name, when the user submits a non-empty name, then one location is created with that name and a system-assigned technical identifier.
* [ ] Given a name has trailing whitespace, when the user creates the location, then the trailing whitespace is removed before the name is stored.
* [ ] Given a location named `Balcony` exists, when the user submits `balcony` or `BALCONY` as a new location name, then no location is created and the duplicate name is identified.
* [ ] Given a location named `Balcony` exists, when the user submits `Balcony   ` as a new location name, then no location is created and the duplicate name is identified.
* [ ] Given the submitted name is missing or empty after trailing whitespace is removed, when the user attempts creation, then no location is created and the name is identified as invalid.
* [ ] Given valid creation cannot be completed, when Plantly reports the failure, then no partial or duplicate location exists and the user can try again.

## Out of Scope

* Assigning plants to the new location; this belongs to UC-012.
* Adding location attributes other than its name.
