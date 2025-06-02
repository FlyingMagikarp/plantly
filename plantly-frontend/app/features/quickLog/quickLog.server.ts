import {API_URL} from "~/common/constants/constants";
import type {IGroupedPlantsDtoData, ILocationDtoData} from "~/common/types/apiTypes";

export async function getLocations(token: string): Promise<ILocationDtoData[]> {
  const response = await fetch(API_URL + `/sec/quicklog/locations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json() as ILocationDtoData[];
}

export async function getAllPlantsGrouped(token: string): Promise<IGroupedPlantsDtoData[]> {
  const response = await fetch(API_URL + `/sec/quicklog/plants`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json() as IGroupedPlantsDtoData[];
}

export async function getPlantsGroupedForLocation(token: string, locId: number): Promise<IGroupedPlantsDtoData[]> {
  const response = await fetch(API_URL + `/sec/quicklog/plants/$(locId)`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json() as IGroupedPlantsDtoData[];
}