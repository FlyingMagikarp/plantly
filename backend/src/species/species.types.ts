export const MOISTURE_VALUES = [
  'dry',
  'slightly-dry',
  'moist',
  'wet',
] as const;

export const LIGHT_VALUES = [
  'low',
  'medium',
  'bright-indirect',
  'direct',
] as const;

export const FERTILIZER_VALUES = [
  'none',
  'balanced',
  'foliage',
  'bloom',
  'species-specific',
] as const;

export type Moisture = (typeof MOISTURE_VALUES)[number];
export type Light = (typeof LIGHT_VALUES)[number];
export type Fertilizer = (typeof FERTILIZER_VALUES)[number];

export interface SpeciesDefinition {
  id: number;
  definitionSlug: string;
  name: string;
  moisture: Moisture;
  light: Light;
  preferredTemperatureMin: number;
  preferredTemperatureMax: number;
  minimumTemperature: number;
  growthPeriod: string;
  bloomPeriod: string;
  dormancyPeriod: string;
  growthFertilizer: Fertilizer;
  bloomFertilizer: Fertilizer;
  dormancyFertilizer: Fertilizer;
  notes: string[];
  sourceHash: string;
}
