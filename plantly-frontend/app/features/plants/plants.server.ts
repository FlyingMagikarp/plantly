import type { IPlantDtoData } from "~/common/types/apiTypes";
import {API_URL} from "~/common/constants/constants";


export async function getPlants(token?: string):Promise<IPlantDtoData[]>{
  const response = await fetch(API_URL + `/sec/plant`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }) ;

  return await response.json() as IPlantDtoData[];
}

export async function getPlant(plantId: number, token?: string):Promise<IPlantDtoData>{
  const response = await fetch(API_URL + `/sec/plant/${plantId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }) ;

  return await response.json() as IPlantDtoData;
}

export async function updatePlant(plant: IPlantDtoData, token?: string):Promise<Response>{
  return await fetch(API_URL + `/sec/plant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({plantDto: plant})
  })
}

export async function deletePlant(plantId: number, token?: string):Promise<Response>{
  return await fetch(API_URL + `/sec/plant/${plantId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  })
}