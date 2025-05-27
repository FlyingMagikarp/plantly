import {API_URL} from "~/common/constants/constants";
import type {ICareLogDtoData} from "~/common/types/apiTypes";


export async function getCareLogs(plantId: number, token: string, page?: number, rows?: number): Promise<ICareLogDtoData[]> {
  const params = new URLSearchParams();

  if (page !== undefined) params.append('page', page.toString());
  if (rows !== undefined) params.append('rows', rows.toString());

  const response = await fetch(API_URL + `/sec/carelog/plant/${plantId}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json() as ICareLogDtoData[];
}

export async function getCareLog(logId: number, token: string): Promise<ICareLogDtoData> {
  const response = await fetch(API_URL + `/sec/carelog/${logId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json() as ICareLogDtoData;
}

export async function getCareLogsForUser(token: string, page?: number, rows?: number): Promise<ICareLogDtoData[]> {
  const params = new URLSearchParams();

  if (page !== undefined) params.append('page', page.toString());
  if (rows !== undefined) params.append('rows', rows.toString());

  const response = await fetch(`${API_URL}/sec/carelog?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return await response.json() as ICareLogDtoData[];
}

export async function getDaysSinceLastCare(plantId: number, token: string): Promise<number> {
  const response = await fetch(API_URL + `/sec/carelog/plant/${plantId}/lastAgo`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json() as number;
}

export async function addCareLog(careLog: ICareLogDtoData, token: string): Promise<Response> {
  return await fetch(API_URL + `/sec/carelog/plant/${careLog.plantId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({careLogDto: careLog})
  })
}

export async function deleteCareLog(logId: number, token: string): Promise<Response> {
  return await fetch(API_URL + `/sec/carelog/${logId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  })
}