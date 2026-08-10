# Species Definitions

Species knowledge is maintained as Markdown files in this directory.

Each file describes general care information for one species. Species definitions are validated and synchronized with Plantly's runtime database.

Use `TEMPLATE.md` when adding a new species.

## Files and Identity

Species definition filenames must follow `SP-000-name.md`:

* `000` is the permanent, unique three-digit identifier for the species.
* `name` is a concise kebab-case species name.

The numeric identifier associates a definition with its runtime species. It cannot be reused for a different species, including after the original species is archived. Duplicate or reused identifiers make the complete synchronization invalid.

`README.md` and `TEMPLATE.md` are supporting files and are ignored during synchronization. Any other Markdown file in this directory that does not follow the species filename convention makes synchronization invalid.

## Required and Optional Content

Every field shown in `TEMPLATE.md` is required except `Notes`. The `Notes` section may be omitted or left empty.

## Care

### Moisture

Describes the preferred substrate moisture before watering.

* `dry` — allow the substrate to dry completely or almost completely
* `slightly-dry` — allow the upper portion of the substrate to dry before watering
* `moist` — keep the substrate consistently lightly moist, but not saturated
* `wet` — prefers consistently wet or water-retentive conditions

### Light

Light uses an ordered scale:

`low < medium < bright-indirect < direct`

* `low` — tolerates low-light conditions
* `medium` — prefers moderate indirect light
* `bright-indirect` — prefers bright light without substantial direct sun
* `direct` — benefits from or requires significant direct sunlight

### Temperature

`Temperature` defines the preferred temperature range in degrees Celsius.

Example:

`Temperature: 18-28 °C`

`Minimum Temperature` defines the approximate lowest temperature the species should be exposed to.

Example:

`Minimum Temperature: 12 °C`

The minimum temperature is a care threshold, not part of the preferred range.

The lower bound of `Temperature` must not exceed its upper bound.

## Seasons

Seasonal periods use full English month names.

Examples:

* `March-October`
* `November-March`

Ranges may cross the end of the calendar year.

Special values:

* `year-round` — the phase may occur throughout the year
* `none` — the species does not meaningfully have this phase
* `unknown` — the phase exists or may exist, but its timing is not currently known

Seasonal phases describe typical behavior rather than guaranteed dates. Actual plant behavior may vary with growing conditions.

## Fertilizer

Fertilizer guidance describes the general fertilizer type appropriate during each seasonal phase.

Accepted values:

* `none` — no fertilizer recommended
* `balanced` — general-purpose fertilizer with a balanced nutrient profile
* `foliage` — fertilizer favoring vegetative or foliage growth
* `bloom` — fertilizer intended to support flowering
* `species-specific` — the species has requirements that do not fit the general categories

Details for `species-specific` fertilizer guidance should be described under Notes.

Fertilizer guidance does not determine watering frequency. Fertilizer is applied as part of watering.

When a seasonal phase is `none`, its corresponding fertilizer value must also be `none`. When a seasonal phase is `unknown`, its corresponding fertilizer value may be any accepted fertilizer value.

## Notes

Notes contain species-specific information that does not justify additional structured fields.

Examples include:

* unusual care requirements
* flowering triggers
* substrate considerations
* special fertilizer requirements
* useful observations
* exceptions to general care guidance

Keep notes concise and focused on information useful during normal plant care.
