# UC-032: Complete Plant Care Round

## Status

Implemented

## Goal

Allow the user to finish an active plant-care round and leave the round workflow without changing the care events already recorded.

## Preconditions

* An active care round exists through UC-030.

## Behaviour

1. Plantly identifies when the user has advanced beyond the final plant, or the user initiates early completion while plants remain.
2. Plantly asks the user to confirm completion.
3. Plantly displays a summary containing every plant for which at least one care event was recorded during the round; skipped plants and plants without a recorded event are omitted.
4. If the user confirms, Plantly marks the round as completed, retains it as a historical record, and associates its recorded care events with it.
5. Plantly displays the completed summary and then returns the user to Home.
6. All care events recorded through UC-031 remain in plant history.

## Edge Cases

### No events recorded

Completing a round that produced no care events does not invent activity.

### Remaining plants

The user may complete a round while snapshot members remain. Those plants receive no care event merely because the round completes and are omitted from the summary unless an event was previously recorded for them during the round.

### Completion cancelled

If the user does not confirm completion, Plantly keeps the round active with its progress and recorded care events unchanged.

### Completion fails

If completion cannot be applied, Plantly communicates the failure, preserves the active round and all recorded care events, and allows the user to try again.

### Round no longer active

If the round is already completed or unavailable, Plantly does not complete another round and communicates its current state.

## Postconditions

* After success, the identified round is no longer active.
* The completed round remains stored as a historical record.
* Care events recorded during the round remain associated with their plants.
* Care events recorded during the round are associated with that round.
* The summary contains each plant that received at least one care event during the round and omits all other plants.
* Completing a round creates, modifies, or removes no care event.

## Business Rules

* BR-003 — Historical Care Events
* BR-015 — Minimal Logging
* BR-016 — Historical Data Preservation

## Acceptance Criteria

* [ ] Given an active round has no remaining applicable plants, when the user completes it, then that round is no longer active.
* [ ] Given an active round still has remaining plants, when the user initiates early completion, then Plantly permits completion without recording care for those plants.
* [ ] Given completion is initiated, when confirmation is displayed, then the user may cancel and leave the round active with its progress and care events unchanged.
* [ ] Given the user confirms completion, when it succeeds, then the round is retained as a completed historical record and its recorded care events remain associated with it.
* [ ] Given care events were recorded during the round, when completion succeeds, then every recorded event remains in its plant's history unchanged.
* [ ] Given one or more plants received care events during the round, when the completion summary is displayed, then each such plant appears in the summary and skipped plants without events do not appear.
* [ ] Given no care events were recorded, when the round completes, then Plantly creates no event or invented activity.
* [ ] Given completion fails, when Plantly reports the failure, then the round remains active, recorded events remain unchanged, and the user can try again.
* [ ] Given the identified round is already completed or unavailable, when completion is requested, then Plantly does not affect another round.
* [ ] Given completion succeeds, when the user leaves the workflow, then no care event is created solely by completing the round.
* [ ] Given completion succeeds and its summary has been displayed, when the user continues, then Home is displayed.

## Out of Scope

* Starting a round; this belongs to UC-030.
* Recording care during a round; this belongs to UC-031.
* Editing or removing care events as part of completion.
* Analytics, scores, streaks, or care recommendations.
