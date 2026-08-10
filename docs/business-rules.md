# Business Rules

## Plants and Species

### BR-001 — Plant Species

A plant belongs to exactly one species.

### BR-002 — Plant Location

A plant may have zero or one current location.

A location may contain any number of plants.

---

## Care Events

### BR-003 — Historical Care Events

Care events represent historical facts about what happened to a plant.

Care events should normally not be modified after creation. Incorrect events may be corrected or removed when necessary.

### BR-004 — Watering and Fertilisation

Fertilisation is not a separate care event.

Fertilizer is water-soluble and is applied as part of watering. A watering event may therefore optionally contain fertilisation information.

A watering without fertiliser and a watering with fertiliser are both watering events.

### BR-005 — Optional Event Data

Only the plant, event type, and timestamp are required for a care event.

Additional information such as notes, fertiliser details, measurements, or other event-specific metadata is optional unless explicitly required by the event type.

---

## Species Knowledge

### BR-006 — Moisture Preference

A species has a general soil moisture preference using controlled vocabulary:

* `dry`
* `slightly-dry`
* `moist`
* `wet`

This preference is guidance and does not determine when an individual plant must be watered.

### BR-007 — Light Preference

A species has a general light preference using controlled vocabulary.

The exact vocabulary is defined by the domain model and may evolve as the application is developed.

### BR-008 — Temperature

Species may define a preferred temperature range and minimum tolerated temperature.

Temperature information is guidance rather than a guarantee of plant health or survival.

---

## Seasonal Behaviour

### BR-009 — Seasonal Phases

A species may define recurring seasonal phases such as active growth, flowering, reduced growth, or dormancy.

Not every species is required to define every type of phase.

### BR-010 — Seasonal Guidance

A seasonal phase may modify the care guidance for a species.

This may include fertiliser recommendations or other seasonal notes.

Entering a seasonal phase does not automatically create a care task or care event.

### BR-011 — Fertiliser Guidance

A seasonal phase may recommend a fertiliser type, strength, or general feeding strategy.

Fertiliser guidance describes how fertiliser should be used when watering. It does not determine that a plant currently requires watering.

---

## Species Data

### BR-012 — Controlled Vocabulary

Structured species properties must use their defined controlled vocabulary.

Unknown or ambiguous values must not be silently converted into a different value.

### BR-013 — Species Validation

Species data must be validated before it becomes active application data.

Invalid species data must not partially update the existing species record.

### BR-014 — Special Care Information

Care requirements that do not fit the common structured species properties may be stored as free-form notes rather than expanding the core model.

---

## Data Collection

### BR-015 — Minimal Logging

Routine care events must require only the information necessary to identify what happened and when.

Additional data collection must remain optional unless it is essential to the meaning of that event.

### BR-016 — Historical Data Preservation

Historical care data should be retained even when it is not currently used by an application feature.

The absence of a current report or visualisation is not by itself a reason to discard collected care data.
