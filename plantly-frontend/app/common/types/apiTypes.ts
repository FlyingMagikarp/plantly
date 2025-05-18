export interface ISpeciesOverviewDtoData {
  speciesId: number;
  commonName: string;
  latinName: string;
  lc: string;
}

export interface ISpeciesDtoData {
  speciesId: number;
  latinName: string;
}

export interface ICareTipDtoData {
  id: number;
  species: ISpeciesDtoData;
  placement: 'sunny' | 'semi_shade' | 'shade';
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
  soil: string;
}

export interface INameLcPair {
  commonName: string;
  lc: string;
}

export interface IPlantDtoData {
  id: number;
  speciesId: number;
  speciesLatinName: string;
  nickname: string;
  acquiredAt: Date;
  locationId: number;
  locationName: string;
  notes: string;
  removed: boolean;
  died: boolean;
  inactiveReason: string;
  inactiveDate: Date;
  checkFreq: number;
}

export interface ILocationDtoData {
  id: number;
  name: string;
  description: string;
}