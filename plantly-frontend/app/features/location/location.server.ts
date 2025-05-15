import type {ILocationDtoData} from "~/common/types/apiTypes";
import {API_URL} from "~/common/constants/constants";


export async function getLocations(token?: string):Promise<ILocationDtoData[]>{
  const response = await fetch(API_URL + `/sec/location`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }) ;

  return await response.json() as ILocationDtoData[];
}

export async function getLocation(locId: number, token?: string):Promise<ILocationDtoData>{
  const response = await fetch(API_URL + `/sec/location/${locId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }) ;

  return await response.json() as ILocationDtoData;
}

export async function updateLocations(loc: ILocationDtoData[], token?: string):Promise<Response>{
  return await fetch(API_URL + `/sec/location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({locations: loc})
  })
}

export async function deleteLocation(locId: number, token?: string):Promise<Response>{
  return await fetch(API_URL + `/sec/location/${locId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  })
}