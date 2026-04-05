export const PLACEMENT_TYPE_LABELS: Record<string, string> = {
  INDOOR: 'Indoor',
  OUTDOOR: 'Outdoor',
  BOTH: 'Indoor & Outdoor',
};

export const LIGHT_LEVEL_LABELS: Record<string, string> = {
  LOW: 'Low light',
  MEDIUM: 'Medium light',
  BRIGHT_INDIRECT: 'Bright indirect light',
  DIRECT_SUN: 'Direct sun',
  FULL_SUN: 'Full sun',
  PARTIAL_SHADE: 'Partial shade',
};

export const WATERING_STRATEGY_LABELS: Record<string, string> = {
  KEEP_EVENLY_MOIST: 'Keep evenly moist',
  WATER_WHEN_TOP_SOIL_DRY: 'Water when top soil is dry',
  LET_MOSTLY_DRY_OUT: 'Let mostly dry out',
  LET_FULLY_DRY_OUT: 'Let fully dry out',
};

export const HUMIDITY_PREFERENCE_LABELS: Record<string, string> = {
  LOW: 'Low humidity',
  NORMAL: 'Normal humidity',
  HIGH: 'High humidity',
};

export const SEASON_TYPE_LABELS: Record<string, string> = {
  SPRING: 'Spring',
  SUMMER: 'Summer',
  AUTUMN: 'Autumn',
  WINTER: 'Winter',
  ALL_YEAR: 'All year',
};

export const PLANT_TASK_TYPE_LABELS: Record<string, string> = {
  CHECK: 'Check',
  WATER: 'Water',
  FERTILIZE: 'Fertilize',
  PRUNE: 'Prune',
  REPOT: 'Repot',
  MOVE_INSIDE: 'Move inside',
  MOVE_OUTSIDE: 'Move outside',
  PEST_TREATMENT: 'Pest treatment',
};

export const PLANT_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  dead: 'Dead',
  removed: 'Given away / Removed',
};

export const CARE_LOG_TYPE_LABELS: Record<string, string> = {
  WATER: 'Watering',
  FERTILIZE: 'Fertilizing',
  PRUNE: 'Pruning',
  REPOT: 'Repotting',
  CHECK: 'Check-up',
  MOVE_INSIDE: 'Move inside',
  MOVE_OUTSIDE: 'Move outside',
  PEST_TREATMENT: 'Pest treatment',
};

export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  CARE_LOG: 'Care Activity',
  PLANT_ADDED: 'Added',
  PLANT_REMOVED: 'Removed',
  PLANT_DEAD: 'Died',
  PLANT_GIVEN_AWAY: 'Given Away',
};

/**
 * Formats an enum value into a human-readable label.
 * If no mapping exists, it returns the value as-is (with underscores replaced by spaces).
 */
export function formatEnum(value: string | undefined | null, mapping: Record<string, string>): string {
  if (!value) return '';
  return mapping[value] || value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
