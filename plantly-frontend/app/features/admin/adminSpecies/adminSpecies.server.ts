import { API_URL } from "~/common/constants/constants";
import type { SpeciesOverviewDtoData } from "~/common/types/apiTypes";


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