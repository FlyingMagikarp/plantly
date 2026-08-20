# UC-030: Start Plant Care Round

## Status

Ready

## Goal

Allow the user to begin a location-oriented care round over active plants so routine care can be recorded with little navigation.

## Preconditions

* Location assignments and active plants are available.
* The user has opened the care-round workflow.

## Behaviour

1. Plantly presents locations that currently contain active plants in ascending location-ID order and the unassigned group where applicable.
2. The user selects the location or group for the round.
3. Plantly identifies the active plants currently belonging to that selection and orders them by ascending plant ID.
4. Plantly starts a persistent round whose membership is a snapshot of those plants and presents its first plant for care through UC-031.

## Edge Cases

### No active plants

If the selected location or group contains no active plants, Plantly does not start an empty round and communicates that there are no plants to care for there.

### Location removed or unavailable

If the selected location no longer exists when the round starts, Plantly does not substitute another location and communicates that the selection was not found.

### Round cannot start

If Plantly cannot start the round, it communicates the failure, creates no partial active round, and allows the user to try again.

### Another round is active

If another care round is active, Plantly communicates that a round is already active, does not start a new round or modify the existing one, and reopens the existing round at its preserved progress.

## Postconditions

* After success, an active round identifies one selected location or unassigned group and a defined set or sequence of active plants.
* The round and its membership persist across navigation, browser refresh, and application restart.
* At most one care round is active.
* Starting a round creates no care event by itself.

## Business Rules

* BR-002 — Plant Location
* BR-015 — Minimal Logging
* BR-022 — Plant Lifecycle

## Acceptance Criteria

* [ ] Given a location contains active plants, when the user starts a round for it, then Plantly starts a round containing the applicable active plants and presents its first plant.
* [ ] Given locations are available for selection, when the care-round workflow is displayed, then locations are ordered by ascending location ID.
* [ ] Given a selected group contains multiple active plants, when a round starts, then its plant membership is ordered by ascending plant ID.
* [ ] Given a round has started, when a member plant later changes location, then the round's membership and order remain unchanged.
* [ ] Given an active round exists, when the user attempts to start another round, then Plantly communicates that a round is already active, creates no new round, and reopens the existing round at its preserved progress.
* [ ] Given an active round exists, when the user navigates away, refreshes the browser, or restarts the application, then the same round remains active with its membership and progress preserved.
* [ ] Given active unassigned plants exist, when the user starts a round for the unassigned group, then those plants are eligible for the round.
* [ ] Given a selected group contains no active plants, when the user attempts to start a round, then no empty round starts and Plantly communicates that no plants are available.
* [ ] Given the selected location no longer exists, when the user starts the round, then no round starts for another location and Plantly communicates that the location was not found.
* [ ] Given a round starts successfully, when its first plant is presented, then no care event has been created merely by starting the round.

## Out of Scope

* Recording care during the round; this belongs to UC-031.
* Completing a round; this belongs to UC-032.
* Predicting which plants need care or generating an overdue list.
* A round spanning multiple selected locations.
