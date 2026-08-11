import { createHash } from 'node:crypto';
import { basename } from 'node:path';
import { SpeciesDefinitionValidationError } from './species-definition-validation.error';
import {
  FERTILIZER_VALUES,
  LIGHT_VALUES,
  MOISTURE_VALUES,
  type Fertilizer,
  type SpeciesDefinition,
} from './species.types';

const FILENAME_PATTERN = /^SP-(\d{3})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const NUMBER = '-?\\d+(?:\\.\\d+)?';
const TEMPERATURE_RANGE_PATTERN = new RegExp(
  `^(${NUMBER})\\s*-\\s*(${NUMBER})\\s*°C$`,
);
const TEMPERATURE_PATTERN = new RegExp(`^(${NUMBER})\\s*°C$`);
const MONTH =
  '(?:January|February|March|April|May|June|July|August|September|October|November|December)';
const MONTH_RANGE_PATTERN = new RegExp(`^${MONTH}-${MONTH}$`);

interface ParsedSections {
  Care: Map<string, string>;
  Seasons: Map<string, string>;
  Fertilizer: Map<string, string>;
  Notes?: string[];
}

export function parseSpeciesDefinition(
  filePath: string,
  source: string,
): SpeciesDefinition {
  const filename = basename(filePath);
  const filenameMatch = FILENAME_PATTERN.exec(filename);
  if (!filenameMatch) {
    throw invalid(filename, 'filename does not follow SP-000-name.md');
  }

  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const firstLineIndex = lines.findIndex((line) => line.trim() !== '');
  const titleMatch = /^# ([^#].*\S|\S)$/.exec(
    firstLineIndex >= 0 ? lines[firstLineIndex].trim() : '',
  );
  if (!titleMatch || titleMatch[1].includes('<') || titleMatch[1].includes('>')) {
    throw invalid(filename, 'a concrete level-one species name is required');
  }

  const sections = parseSections(filename, lines.slice(firstLineIndex + 1));
  const moisture = acceptedValue(
    filename,
    sections.Care,
    'Moisture',
    MOISTURE_VALUES,
  );
  const light = acceptedValue(
    filename,
    sections.Care,
    'Light',
    LIGHT_VALUES,
  );
  const [preferredTemperatureMin, preferredTemperatureMax] = temperatureRange(
    filename,
    requiredField(filename, sections.Care, 'Temperature'),
  );
  if (preferredTemperatureMin > preferredTemperatureMax) {
    throw invalid(filename, 'Temperature lower bound exceeds its upper bound');
  }

  const minimumTemperature = temperature(
    filename,
    requiredField(filename, sections.Care, 'Minimum Temperature'),
  );
  const growthPeriod = seasonalPeriod(
    filename,
    requiredField(filename, sections.Seasons, 'Growth'),
    true,
  );
  const bloomPeriod = seasonalPeriod(
    filename,
    requiredField(filename, sections.Seasons, 'Bloom'),
    true,
  );
  const dormancyPeriod = seasonalPeriod(
    filename,
    requiredField(filename, sections.Seasons, 'Dormancy'),
    false,
  );
  const growthFertilizer = acceptedValue(
    filename,
    sections.Fertilizer,
    'Growth',
    FERTILIZER_VALUES,
  );
  const bloomFertilizer = acceptedValue(
    filename,
    sections.Fertilizer,
    'Bloom',
    FERTILIZER_VALUES,
  );
  const dormancyFertilizer = acceptedValue(
    filename,
    sections.Fertilizer,
    'Dormancy',
    FERTILIZER_VALUES,
  );

  requireNoneFertilizer(filename, 'Growth', growthPeriod, growthFertilizer);
  requireNoneFertilizer(filename, 'Bloom', bloomPeriod, bloomFertilizer);
  requireNoneFertilizer(
    filename,
    'Dormancy',
    dormancyPeriod,
    dormancyFertilizer,
  );

  const definitionWithoutHash = {
    id: Number(filenameMatch[1]),
    definitionSlug: filenameMatch[2],
    name: titleMatch[1],
    moisture,
    light,
    preferredTemperatureMin,
    preferredTemperatureMax,
    minimumTemperature,
    growthPeriod,
    bloomPeriod,
    dormancyPeriod,
    growthFertilizer,
    bloomFertilizer,
    dormancyFertilizer,
    notes: sections.Notes ?? [],
  };

  return {
    ...definitionWithoutHash,
    sourceHash: createHash('sha256')
      .update(JSON.stringify(definitionWithoutHash))
      .digest('hex'),
  };
}

function parseSections(filename: string, lines: string[]): ParsedSections {
  const sectionNames = ['Care', 'Seasons', 'Fertilizer', 'Notes'] as const;
  const fields = {
    Care: new Map<string, string>(),
    Seasons: new Map<string, string>(),
    Fertilizer: new Map<string, string>(),
  };
  let notes: string[] | undefined;
  let current: (typeof sectionNames)[number] | undefined;
  const seen = new Set<string>();

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === '') continue;

    const headingMatch = /^## (.+)$/.exec(line);
    if (headingMatch) {
      const heading = headingMatch[1];
      if (!sectionNames.includes(heading as (typeof sectionNames)[number])) {
        throw invalid(filename, `unknown section ${heading}`);
      }
      if (seen.has(heading)) {
        throw invalid(filename, `duplicate section ${heading}`);
      }
      seen.add(heading);
      current = heading as (typeof sectionNames)[number];
      if (current === 'Notes') notes = [];
      continue;
    }

    if (!current) {
      throw invalid(filename, 'content appears outside a recognized section');
    }
    if (current === 'Notes') {
      const noteMatch = /^\* (\S.*)$/.exec(line);
      if (!noteMatch || noteMatch[1].includes('<OPTIONAL_SPECIES_SPECIFIC_NOTE>')) {
        throw invalid(filename, 'Notes entries must be non-empty Markdown bullets');
      }
      notes?.push(noteMatch[1]);
      continue;
    }

    const fieldMatch = /^([^:]+):\s*(\S.*)$/.exec(line);
    if (!fieldMatch) {
      throw invalid(filename, `invalid field line in ${current}`);
    }
    const sectionFields = fields[current];
    if (sectionFields.has(fieldMatch[1])) {
      throw invalid(filename, `duplicate ${current}.${fieldMatch[1]} field`);
    }
    sectionFields.set(fieldMatch[1], fieldMatch[2]);
  }

  for (const required of ['Care', 'Seasons', 'Fertilizer'] as const) {
    if (!seen.has(required)) throw invalid(filename, `missing ${required} section`);
  }
  requireExactFields(filename, fields.Care, [
    'Moisture',
    'Light',
    'Temperature',
    'Minimum Temperature',
  ]);
  requireExactFields(filename, fields.Seasons, [
    'Growth',
    'Bloom',
    'Dormancy',
  ]);
  requireExactFields(filename, fields.Fertilizer, [
    'Growth',
    'Bloom',
    'Dormancy',
  ]);

  return { ...fields, Notes: notes };
}

function requireExactFields(
  filename: string,
  fields: Map<string, string>,
  expected: string[],
): void {
  for (const field of expected) requiredField(filename, fields, field);
  for (const field of fields.keys()) {
    if (!expected.includes(field)) throw invalid(filename, `unknown field ${field}`);
  }
}

function requiredField(
  filename: string,
  fields: Map<string, string>,
  name: string,
): string {
  const value = fields.get(name);
  if (value === undefined) throw invalid(filename, `missing required field ${name}`);
  return value;
}

function acceptedValue<T extends string>(
  filename: string,
  fields: Map<string, string>,
  name: string,
  accepted: readonly T[],
): T {
  const value = requiredField(filename, fields, name);
  if (!accepted.includes(value as T)) {
    throw invalid(filename, `${name} has an unsupported value`);
  }
  return value as T;
}

function temperatureRange(filename: string, value: string): [number, number] {
  const match = TEMPERATURE_RANGE_PATTERN.exec(value);
  if (!match) throw invalid(filename, 'Temperature has an invalid format');
  const temperatures: [number, number] = [Number(match[1]), Number(match[2])];
  if (!temperatures.every(Number.isFinite)) {
    throw invalid(filename, 'Temperature must contain finite numbers');
  }
  return temperatures;
}

function temperature(filename: string, value: string): number {
  const match = TEMPERATURE_PATTERN.exec(value);
  if (!match) throw invalid(filename, 'Minimum Temperature has an invalid format');
  const parsed = Number(match[1]);
  if (!Number.isFinite(parsed)) {
    throw invalid(filename, 'Minimum Temperature must be a finite number');
  }
  return parsed;
}

function seasonalPeriod(
  filename: string,
  value: string,
  allowsYearRound: boolean,
): string {
  if (
    value === 'none' ||
    value === 'unknown' ||
    (allowsYearRound && value === 'year-round') ||
    MONTH_RANGE_PATTERN.test(value)
  ) {
    return value;
  }
  throw invalid(filename, 'seasonal period has an unsupported value');
}

function requireNoneFertilizer(
  filename: string,
  phase: string,
  period: string,
  fertilizer: Fertilizer,
): void {
  if (period === 'none' && fertilizer !== 'none') {
    throw invalid(filename, `${phase} fertilizer must be none when its phase is none`);
  }
}

function invalid(filename: string, reason: string): SpeciesDefinitionValidationError {
  return new SpeciesDefinitionValidationError(`${filename}: ${reason}`);
}
