# Domain

## Core Concepts

### Species
Represents general knowledge about a plant species.

A species defines care preferences and seasonal behaviour shared by all individual plants of that species.

Each species has a permanent numeric species identifier assigned by its authoritative Markdown definition. The identifier remains associated with that species for its lifetime and is not reused.

A species is either active or archived. Archiving preserves the species and its associations with existing plants, but an archived species cannot be assigned to a new plant or selected as a replacement species. Restoring its authoritative definition makes the same species active again.

### Plant
Represents a concrete plant in the user's collection.

A plant has a system-assigned sequential technical identifier, a user-provided nickname, an acquisition date, and optional notes. Nicknames identify plants for the user but are not required to be unique.

A plant references one species and may currently be assigned to a location. Its acquisition date cannot be later than the current date.

A plant has exactly one lifecycle status:

* `active` — currently part of the user's collection;
* `dead` — retained as a historical record after the plant has died; or
* `archived` — retained after leaving the collection for another reason, such as being given away or sold.

Dead and archived plants preserve their images and care events and may be restored to active when marked incorrectly. A faulty plant record may instead be permanently deleted, which also permanently deletes its images and care events.

### Location
Represents a physical place where plants are kept.

Examples include a balcony, living room window, propagation cabinet, or shelf.

A location has an immutable system-assigned technical identifier and a required user-provided name. Location names are unique without regard to capitalization. Trailing whitespace is not part of a location name.

Deleting a location removes the location itself. Plants assigned to it remain in the collection and become unassigned.

### CareEvent
Represents something that happened to a plant.

Examples include watering, pruning, repotting, pest treatment, movement, or general observation.

Care events form the historical dataset of Plantly.

### SeasonalPhase
Represents a recurring period in the lifecycle of a species.

Examples include active growth, flowering, dormancy, or reduced growth.

### FertilizerRegime
Describes the recommended fertilisation approach during a seasonal phase.


## Relationships

```mermaid
classDiagram
    Species "1" --> "*" Plant : describes
    Location "0..1" <-- "*" Plant : located at
    Plant "1" --> "*" CareEvent : has
    Species "1" --> "*" SeasonalPhase : follows
    SeasonalPhase "0..1" --> "0..1" FertilizerRegime : recommends
```
