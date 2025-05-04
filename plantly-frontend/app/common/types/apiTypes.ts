export interface SpeciesOverviewDtoData {
  speciesId: number;
  commonName: string;
  latinName: string;
  lc: string;
}

export interface SpeciesDtoData {
  speciesId: number;
  latinName: string;
}

export interface CareTipDtoData {
  id: number;
  species: SpeciesDtoData;
  placement: 'SUNNY' | 'SEMI_SHADE' | 'SHADE';
  winterHardy: boolean;
  optimalTempMinC: number;
  optimalTempMaxC: number;
  wateringFrequencyDays: number;
  wateringNotes: string;
  fertilizingFrequencyDays: number;
  fertilizingType: string;
  fertilizingNotes: string;
  repottingCycleMonths: number;
  growingSeasonStart: number;
  growingSeasonEnd: number;
  dormantSeasonStart: number;
  dormantSeasonEnd: number;
  pruningNotes: string;
  pruningMonths: number[];
  wiringNotes: string;
  wiringMonths: number[];
  propagationNotes: string;
  propagationMonths: number[];
  pests: string;
  notes: string;
}