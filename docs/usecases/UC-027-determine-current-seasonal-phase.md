# UC-027: Determine Current Seasonal Phase

## Status

Draft

## Goal

Determine which recurring seasonal phase currently applies to a species so Plantly can surface relevant guidance without predicting care needs.

## Preconditions

* The species exists and is active or remains associated with an existing plant.
* Its seasonal phases have been defined through UC-026.
* A current calendar date is available.

## Behaviour

1. Plantly obtains the relevant current date.
2. Plantly compares that date with the species' recurring seasonal phase definitions.
3. Plantly identifies the applicable current phase, if any.
4. Plantly returns the result for use by seasonal-guidance views without creating a task or care event.

## Edge Cases

### No phases defined

If the species defines no seasonal phases, Plantly reports that no current phase is defined.

### No matching phase

If phases exist but none includes the current date, Plantly reports that no phase currently applies.

### Boundary date

A date on a phase boundary is evaluated consistently according to the phase-boundary rules established for UC-026.

### Invalid active phase data

If active phase data cannot be evaluated, Plantly does not guess a phase and communicates that current seasonal information is unavailable.

## Postconditions

* The result identifies the applicable phase or explicitly indicates that none is defined or applicable.
* Determination modifies no species, plant, task, or care-event data.

## Business Rules

* BR-009 — Seasonal Phases
* BR-010 — Seasonal Guidance

## Acceptance Criteria

* [ ] Given the current date falls within a defined phase, when Plantly determines the current seasonal phase, then it returns that phase.
* [ ] Given no phases are defined, when Plantly determines the current seasonal phase, then it reports that none is defined.
* [ ] Given phases are defined but none includes the current date, when Plantly determines the current phase, then it reports that none currently applies.
* [ ] Given phase data cannot be evaluated, when determination is attempted, then Plantly does not infer a phase and reports the information as unavailable.
* [ ] Given a phase is determined, when the operation completes, then no care task or care event is created.

## Out of Scope

* Defining phases; this belongs to UC-026.
* Displaying guidance; this belongs to UC-028.
* Predicting watering or other care needs.
* Using observed conditions to override a calendar-defined phase.

## Open Questions

* Which timezone determines the current date?
* If overlapping phases are allowed, does Plantly return one phase or all applicable phases, and how is precedence determined?
* Does archived species knowledge continue to receive a current-phase result for associated plants?

