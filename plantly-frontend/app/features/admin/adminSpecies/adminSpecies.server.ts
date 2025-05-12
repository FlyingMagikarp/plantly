import { API_URL } from "~/common/constants/constants";
import type {ICareTipDtoData, INameLcPair, ISpeciesDtoData, ISpeciesOverviewDtoData} from "~/common/types/apiTypes";


export async function getAllSpecies(token?: string):Promise<ISpeciesOverviewDtoData[]> {
    const response = await fetch(API_URL + '/sec/species', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }) ;

    return await response.json() as ISpeciesOverviewDtoData[];
}

export async function getSpecies(speciesId: number, token?: string):Promise<ISpeciesDtoData> {
  const response = await fetch(API_URL + `/sec/species/${speciesId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }) ;

  return await response.json() as ISpeciesDtoData;
}

export async function getSpeciesTranslations(speciesId: number, token?: string):Promise<ISpeciesOverviewDtoData[]> {
  const response = await fetch(API_URL + `/sec/speciesTranslation/${speciesId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }) ;

  return await response.json() as ISpeciesOverviewDtoData[];
}

export async function getSpeciesCareTip(speciesId: number, token?: string):Promise<ICareTipDtoData> {
  const response = await fetch(API_URL + `/sec/caretip/${speciesId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }) ;

  return await response.json() as ICareTipDtoData;
}

export async function updateSpeciesNames(speciesId: string, latinName: string, commonNames: INameLcPair[], token?: string):Promise<Response> {
  return await fetch(API_URL + `/admin/species/updateNames/${speciesId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({latinName: latinName, commonNames: commonNames})
  })
}

export async function updateSpeciesCareTip(speciesId: string, careTip: ICareTipDtoData, token?: string):Promise<Response> {
  return await fetch(API_URL + `/admin/species/updateCareTips/${speciesId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({careTipDto: careTip})
  })
}

export async function deleteSpecies(specieId: number, token?: string):Promise<Response> {
  return await fetch(API_URL + `/admin/species/${specieId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  })
}