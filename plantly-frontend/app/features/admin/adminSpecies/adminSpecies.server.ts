import { API_URL } from "~/common/constants/constants";
import type { CareTipDtoData, SpeciesDtoData, SpeciesOverviewDtoData } from "~/common/types/apiTypes";


export async function getAllSpecies(token?: string):Promise<SpeciesOverviewDtoData[]> {
    const response = await fetch(API_URL + '/sec/species', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }) ;

    return await response.json() as SpeciesOverviewDtoData[];
}

export async function getSpecies(speciesId: number, token?: string):Promise<SpeciesDtoData> {
  const response = await fetch(API_URL + `/sec/species/${speciesId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }) ;

  return await response.json() as SpeciesDtoData;
}

export async function getSpeciesTranslations(speciesId: number, token?: string):Promise<SpeciesOverviewDtoData[]> {
  const response = await fetch(API_URL + `/sec/speciesTranslation/${speciesId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }) ;

  return await response.json() as SpeciesOverviewDtoData[];
}

export async function getSpeciesCareTip(speciesId: number, token?: string):Promise<CareTipDtoData> {
  const response = await fetch(API_URL + `/sec/caretip/${speciesId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }) ;

  return await response.json() as CareTipDtoData;
}