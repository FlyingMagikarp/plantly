# UC-032: Complete Plant Care Round

## Status

Draft

## Goal

Allow the user to finish an active plant-care round and leave the round workflow without changing the care events already recorded.

## Preconditions

* An active care round exists through UC-030.

## Behaviour

1. Plantly identifies when the active round has no remaining applicable plants, or the user initiates completion when allowed.
2. Plantly summarizes the round sufficiently for the user to understand that it is ending.
3. The user completes the round.
4. Plantly marks the round as no longer active and returns the user to an appropriate application view.
5. All care events recorded through UC-031 remain in plant history.

## Edge Cases

### No events recorded

Completing a round that produced no care events does not invent activity.

### Remaining plants

Whether a round may be completed while plants remain unresolved depends on the skip and early-completion rules still to be defined.

### Completion fails

If completion cannot be applied, Plantly communicates the failure, preserves the active round and all recorded care events, and allows the user to try again.

### Round no longer active

If the round is already completed or unavailable, Plantly does not complete another round and communicates its current state.

## Postconditions

* After success, the identified round is no longer active.
* Care events recorded during the round remain associated with their plants.
* Completing a round creates, modifies, or removes no care event.

## Business Rules

* BR-003 — Historical Care Events
* BR-015 — Minimal Logging
* BR-016 — Historical Data Preservation

## Acceptance Criteria

* [ ] Given an active round has no remaining applicable plants, when the user completes it, then that round is no longer active.
* [ ] Given care events were recorded during the round, when completion succeeds, then every recorded event remains in its plant's history unchanged.
* [ ] Given no care events were recorded, when the round completes, then Plantly creates no event or invented activity.
* [ ] Given completion fails, when Plantly reports the failure, then the round remains active, recorded events remain unchanged, and the user can try again.
* [ ] Given the identified round is already completed or unavailable, when completion is requested, then Plantly does not affect another round.
* [ ] Given completion succeeds, when the user leaves the workflow, then no care event is created solely by completing the round.

## Out of Scope

* Starting a round; this belongs to UC-030.
* Recording care during a round; this belongs to UC-031.
* Editing or removing care events as part of completion.
* Analytics, scores, streaks, or care recommendations.

## Open Questions

* May the user complete a round early while plants remain, and how are skipped or unresolved plants represented?
* Is explicit confirmation required to complete a round?
* What summary is shown, and which destination follows completion?
* Is a completed round retained as a record separate from its care events?

