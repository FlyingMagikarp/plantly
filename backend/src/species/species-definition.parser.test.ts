import { describe, expect, it } from 'vitest';
import { SpeciesDefinitionValidationError } from './species-definition-validation.error';
import { parseSpeciesDefinition } from './species-definition.parser';

interface DefinitionOptions {
  moisture: string;
  light: string;
  temperature: string;
  minimumTemperature: string;
  growthPeriod: string;
  bloomPeriod: string;
  dormancyPeriod: string;
  growthFertilizer: string;
  bloomFertilizer: string;
  dormancyFertilizer: string;
  notes?: string[];
  includeNotesSection: boolean;
}

const defaults: DefinitionOptions = {
  moisture: 'moist',
  light: 'bright-indirect',
  temperature: '18-28 °C',
  minimumTemperature: '12 °C',
  growthPeriod: 'March-October',
  bloomPeriod: 'unknown',
  dormancyPeriod: 'November-February',
  growthFertilizer: 'balanced',
  bloomFertilizer: 'species-specific',
  dormancyFertilizer: 'none',
  notes: ['Keep notes concise.', 'A second useful observation.'],
  includeNotesSection: true,
};

describe('UC-001: Synchronize Species Definitions parser', () => {
  it('parses every structured field and optional note from a valid definition', () => {
    const parsed = parseSpeciesDefinition(
      'SP-042-test-species.md',
      definition(),
    );

    expect(parsed).toMatchObject({
      id: 42,
      definitionSlug: 'test-species',
      name: 'Test Species',
      moisture: 'moist',
      light: 'bright-indirect',
      preferredTemperatureMin: 18,
      preferredTemperatureMax: 28,
      minimumTemperature: 12,
      growthPeriod: 'March-October',
      bloomPeriod: 'unknown',
      dormancyPeriod: 'November-February',
      growthFertilizer: 'balanced',
      bloomFertilizer: 'species-specific',
      dormancyFertilizer: 'none',
      notes: ['Keep notes concise.', 'A second useful observation.'],
    });
    expect(parsed.sourceHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it.each([
    ['omitted', definition({ includeNotesSection: false })],
    ['empty', definition({ notes: [] })],
  ])('accepts an %s Notes section', (_description, markdown) => {
    expect(
      parseSpeciesDefinition('SP-042-test-species.md', markdown).notes,
    ).toEqual([]);
  });

  it.each([
    'Moisture: moist',
    'Light: bright-indirect',
    'Temperature: 18-28 °C',
    'Minimum Temperature: 12 °C',
    'Growth: March-October',
    'Bloom: unknown',
    'Dormancy: November-February',
    'Growth: balanced',
    'Bloom: species-specific',
    'Dormancy: none',
  ])('rejects a definition missing required %s', (line) => {
    expect(() =>
      parseSpeciesDefinition(
        'SP-042-test-species.md',
        removeFirstLine(definition(), line),
      ),
    ).toThrow(SpeciesDefinitionValidationError);
  });

  it.each([
    ['unsupported moisture', { moisture: 'damp' }],
    ['unsupported light', { light: 'full-sun' }],
    ['unsupported fertilizer', { growthFertilizer: 'weekly' }],
    ['unsupported seasonal period', { growthPeriod: 'Spring-Autumn' }],
  ])('rejects %s controlled vocabulary', (_description, options) => {
    expect(() =>
      parseSpeciesDefinition(
        'SP-042-test-species.md',
        definition(options),
      ),
    ).toThrow(SpeciesDefinitionValidationError);
  });

  it('rejects a preferred temperature range whose lower bound exceeds its upper bound', () => {
    expect(() =>
      parseSpeciesDefinition(
        'SP-042-test-species.md',
        definition({ temperature: '29-15 °C' }),
      ),
    ).toThrow(/lower bound exceeds/);
  });

  it('rejects fertilizer when its seasonal phase is none', () => {
    expect(() =>
      parseSpeciesDefinition(
        'SP-042-test-species.md',
        definition({ dormancyPeriod: 'none', dormancyFertilizer: 'balanced' }),
      ),
    ).toThrow(/fertilizer must be none/);
  });

  it.each(['none', 'balanced', 'foliage', 'bloom', 'species-specific'])(
    'accepts %s fertilizer when its seasonal phase is unknown',
    (fertilizer) => {
      expect(() =>
        parseSpeciesDefinition(
          'SP-042-test-species.md',
          definition({ bloomPeriod: 'unknown', bloomFertilizer: fertilizer }),
        ),
      ).not.toThrow();
    },
  );

  it.each([
    'SP-42-test-species.md',
    'SP-042-Test-Species.md',
    'SP-042-test_species.md',
    'test-species.md',
  ])('rejects invalid species filename %s', (filename) => {
    expect(() => parseSpeciesDefinition(filename, definition())).toThrow(
      /filename does not follow/,
    );
  });

  it('produces the same source hash for semantically unchanged whitespace', () => {
    const compact = definition();
    const spaced = compact.replace(/\n/g, '\r\n\r\n');

    expect(
      parseSpeciesDefinition('SP-042-test-species.md', compact).sourceHash,
    ).toBe(
      parseSpeciesDefinition('SP-042-test-species.md', spaced).sourceHash,
    );
  });
});

function definition(overrides: Partial<DefinitionOptions> = {}): string {
  const options = { ...defaults, ...overrides };
  const notes = options.includeNotesSection
    ? `\n\n## Notes${
        options.notes?.length
          ? `\n\n${options.notes.map((note) => `* ${note}`).join('\n')}`
          : ''
      }`
    : '';

  return `# Test Species

## Care

Moisture: ${options.moisture}
Light: ${options.light}
Temperature: ${options.temperature}
Minimum Temperature: ${options.minimumTemperature}

## Seasons

Growth: ${options.growthPeriod}
Bloom: ${options.bloomPeriod}
Dormancy: ${options.dormancyPeriod}

## Fertilizer

Growth: ${options.growthFertilizer}
Bloom: ${options.bloomFertilizer}
Dormancy: ${options.dormancyFertilizer}${notes}
`;
}

function removeFirstLine(markdown: string, line: string): string {
  return markdown.replace(`${line}\n`, '');
}
