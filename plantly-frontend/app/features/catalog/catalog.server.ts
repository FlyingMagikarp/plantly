import type { ISpeciesDtoData, ISpeciesOverviewDtoData } from "~/common/types/apiTypes";
import { API_URL } from "~/common/constants/constants";

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
