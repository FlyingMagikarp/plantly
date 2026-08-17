# UC-030: Start Plant Care Round

## Status

Draft

## Goal

Allow the user to begin a location-oriented care round over active plants so routine care can be recorded with little navigation.

## Preconditions

* Location assignments and active plants are available.
* The user has opened the care-round workflow.

## Behaviour

1. Plantly presents locations that currently contain active plants and the unassigned group where applicable.
2. The user selects the location or group for the round.
3. Plantly identifies the active plants currently belonging to that selection.
4. Plantly starts a round and presents its first plant for care through UC-031.

## Edge Cases

### No active plants

If the selected location or group contains no active plants, Plantly does not start an empty round and communicates that there are no plants to care for there.

### Location removed or unavailable

If the selected location no longer exists when the round starts, Plantly does not substitute another location and communicates that the selection was not found.

### Round cannot start

If Plantly cannot start the round, it communicates the failure, creates no partial active round, and allows the user to try again.

## Postconditions

* After success, an active round identifies one selected location or unassigned group and a defined set or sequence of active plants.
* Starting a round creates no care event by itself.

## Business Rules

* BR-002 — Plant Location
* BR-015 — Minimal Logging
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given a location contains active plants, when the user starts a round for it, then Plantly starts a round containing the applicable active plants and presents its first plant.
* [ ] Given active unassigned plants exist, when the user starts a round for the unassigned group, then those plants are eligible for the round.
* [ ] Given a selected group contains no active plants, when the user attempts to start a round, then no empty round starts and Plantly communicates that no plants are available.
* [ ] Given the selected location no longer exists, when the user starts the round, then no round starts for another location and Plantly communicates that the location was not found.
* [ ] Given a round starts successfully, when its first plant is presented, then no care event has been created merely by starting the round.

## Out of Scope

* Recording care during the round; this belongs to UC-031.
* Completing a round; this belongs to UC-032.
* Predicting which plants need care or generating an overdue list.
* A round spanning multiple selected locations.

## Open Questions

* In what order are plants included in a round?
* Is membership a snapshot at start, or does it change when plant status or location changes during the round?
* May more than one round be active, and what happens when the user starts a new round while one is active?
* Must an active round survive navigation, browser refresh, or application restart?

