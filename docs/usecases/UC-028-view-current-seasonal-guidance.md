# UC-028: View Current Seasonal Guidance

## Status

Draft

## Goal

Allow the user to view concise seasonal care guidance currently relevant to a plant.

## Preconditions

* The plant and its species exist.
* Current-phase determination is available through UC-027.

## Behaviour

1. Plantly determines the current seasonal phase for the plant's species.
2. Plantly displays the applicable phase identity and its seasonal notes or fertilizer guidance when present.
3. Plantly distinguishes unavailable guidance from a valid absence of a current phase or guidance.
4. Viewing guidance creates no task, alert, or care event.

## Edge Cases

### No current phase

If no phase currently applies, Plantly communicates that no current seasonal guidance is defined and invents no recommendation.

### Phase without additional guidance

If a current phase exists without notes or fertilizer guidance, Plantly may identify the phase but does not invent detail.

### Inactive plant

Dead or archived plants retain access to species knowledge, but the intended presentation of current guidance remains unresolved.

### Guidance unavailable

If current guidance cannot be retrieved or determined, Plantly communicates that it is unavailable and allows the user to try again.

## Postconditions

* Displayed guidance reflects the plant's species and currently applicable seasonal phase.
* Viewing guidance modifies no plant, species, task, or care-event data.

## Business Rules

* BR-006 — Moisture Preference
* BR-008 — Temperature
* BR-009 — Seasonal Phases
* BR-010 — Seasonal Guidance
* BR-011 — Fertiliser Guidance
* BR-014 — Special Care Information

## Acceptance Criteria

* [ ] Given a plant's species has a current phase with seasonal guidance, when the user views current guidance, then the applicable phase and its defined guidance are shown.
* [ ] Given a current phase has fertilizer guidance, when current guidance is displayed, then it is presented as guidance for fertilizing during watering and not as an instruction that the plant needs water.
* [ ] Given no phase currently applies, when guidance is viewed, then Plantly communicates that no current seasonal guidance is defined and invents none.
* [ ] Given the current phase contains no additional guidance, when it is displayed, then Plantly invents no notes or recommendation.
* [ ] Given guidance cannot be retrieved or determined, when the view loads, then Plantly communicates the failure and provides a way to try again.
* [ ] Given guidance is viewed, when no other action is taken, then no care task, alert, or care event is created.

## Out of Scope

* Defining or synchronizing seasonal phases; this belongs to UC-026.
* Determining current phase semantics; this belongs to UC-027.
* Predicting care needs, due dates, or urgency.
* Recording a care event.

## Open Questions

* On which plant or species views must current guidance appear?
* Should current guidance be shown for dead or archived plants?
* If multiple phases may apply, how are their guidance values combined or ordered?

