# Business Rules

## Plants and Species

### BR-001 — Plant Species

A plant belongs to exactly one species.

### BR-002 — Plant Location

A plant may have zero or one current location.

A location may contain any number of plants.

Only an active plant may be assigned to a location, moved between locations, or made unassigned. Dead and archived plants retain their current location assignment but it cannot be changed unless the plant is restored to active.

### BR-024 — Location Identity

Each location has an immutable, system-assigned technical identifier and a required user-provided name.

Location names must be unique without regard to capitalization. Trailing whitespace is removed before a location name is validated or stored.

### BR-025 — Location Deletion

A location may be permanently deleted after confirmation.

Deleting a location makes every plant assigned to it unassigned. It does not delete or otherwise change those plants or their historical data.

### BR-020 — Plant Identity

Each plant has an immutable, system-assigned sequential technical identifier and a required user-provided nickname.

Plant nicknames are not required to be unique.

### BR-021 — Plant Acquisition Date

Each plant has an acquisition date. The acquisition date may be the current date but must not be in the future.

### BR-022 — Plant Lifecycle

A plant has exactly one lifecycle status: `active`, `dead`, or `archived`.

Marking a plant dead or archived preserves the plant, its care events, and its images. A dead or archived plant may be restored to active to correct an accidental status change.

Only active plants may have their nickname, species, acquisition date, or notes changed.

### BR-023 — Faulty Plant Record Deletion

A faulty plant record may be permanently deleted regardless of its lifecycle status.

Permanent deletion also permanently deletes all care events and images belonging to that plant. This deliberate correction of faulty data is an exception to the normal preservation of historical care data.

Marking a plant dead, archiving a plant, and permanently deleting a plant each require confirmation before the change is applied.

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

A species must define a preferred temperature range and minimum tolerated temperature.

The lower bound of the preferred temperature range must not exceed its upper bound.

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

### BR-017 — Species Identifier

Each species has a permanent numeric identifier supplied by its authoritative Markdown filename.

An identifier must be unique and must not be reused for a different species, including after its species is archived.

### BR-018 — Species Archival

A species whose authoritative Markdown definition is removed is archived rather than deleted.

An archived species remains associated with existing plants but cannot be assigned to a new plant or selected as a replacement species. Restoring a valid definition with the same identifier reactivates the existing species.

### BR-019 — Species Synchronization Atomicity

A species synchronization becomes active only as one complete result.

If any definition is invalid or synchronization otherwise fails, no species creation, update, archival, or reactivation from that synchronization becomes active.

---

## Data Collection

### BR-015 — Minimal Logging

Routine care events must require only the information necessary to identify what happened and when.

Additional data collection must remain optional unless it is essential to the meaning of that event.

### BR-016 — Historical Data Preservation

Historical care data should be retained even when it is not currently used by an application feature.

The absence of a current report or visualisation is not by itself a reason to discard collected care data.
