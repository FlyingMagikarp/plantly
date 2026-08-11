import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from 'react-router-dom';

export type PlantStatus = 'active' | 'dead' | 'archived';

export interface SpeciesOption {
  id: number;
  name: string;
  archived: boolean;
}

export interface LocationOption {
  id: number;
  name: string;
}

export interface PlantItem {
  id: number;
  nickname: string;
  acquisitionDate: string;
  notes: string | null;
  status: PlantStatus;
  species: SpeciesOption;
  location: LocationOption | null;
}

export interface PlantCollectionData {
  plants: PlantItem[];
  species: SpeciesOption[];
  locations: LocationOption[];
}

export interface PlantFormData {
  plant: PlantItem | null;
  species: SpeciesOption[];
}

export interface PlantDetailData {
  plant: PlantItem;
  locations: LocationOption[];
}

export interface PlantFormActionData {
  fields: {
    nickname: string;
    speciesId: string;
    acquisitionDate: string;
    notes: string;
  };
  message: string;
  ok: false;
}

export interface PlantDetailActionData {
  intent: string;
  message: string;
  ok: false;
}

export async function plantCollectionLoader(): Promise<PlantCollectionData> {
  const [plants, species, locations] = await Promise.all([
    getJson<PlantItem[]>('/api/plants', 'Plant collection unavailable'),
    getJson<SpeciesOption[]>('/api/species', 'Species unavailable'),
    getJson<LocationOption[]>('/api/locations', 'Locations unavailable'),
  ]);
  return { plants, species, locations };
}

export async function plantFormLoader({
  params,
}: LoaderFunctionArgs): Promise<PlantFormData> {
  const speciesPromise = getJson<SpeciesOption[]>('/api/species', 'Species unavailable');
  if (!params.plantId) {
    return { plant: null, species: await speciesPromise };
  }
  const [plant, species] = await Promise.all([
    getPlant(params.plantId),
    speciesPromise,
  ]);
  if (plant.status !== 'active') {
    throw new Response('Only active plants can be edited', { status: 409 });
  }
  return { plant, species };
}

export async function plantDetailLoader({
  params,
}: LoaderFunctionArgs): Promise<PlantDetailData> {
  const [plant, locations] = await Promise.all([
    getPlant(params.plantId ?? ''),
    getJson<LocationOption[]>('/api/locations', 'Locations unavailable'),
  ]);
  return { plant, locations };
}

export async function plantFormAction({
  request,
  params,
}: ActionFunctionArgs): Promise<PlantFormActionData | Response> {
  const data = await request.formData();
  const fields = {
    nickname: stringField(data, 'nickname'),
    speciesId: stringField(data, 'speciesId'),
    acquisitionDate: stringField(data, 'acquisitionDate'),
    notes: stringField(data, 'notes'),
  };
  const editing = Boolean(params.plantId);
  let response: Response;
  try {
    response = await fetch(editing ? `/api/plants/${params.plantId}` : '/api/plants', {
      method: editing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...fields,
        speciesId: Number(fields.speciesId),
      }),
    });
  } catch {
    return {
      fields,
      message: editing
        ? 'The plant could not be updated. Your information is still here so you can try again.'
        : 'The plant could not be added. Your information is still here so you can try again.',
      ok: false,
    };
  }
  if (!response.ok) {
    return {
      fields,
      message: formErrorMessage(response.status, editing),
      ok: false,
    };
  }
  const plant = (await response.json()) as PlantItem;
  return redirect(`/plants/${plant.id}`);
}

export async function plantDetailAction({
  request,
  params,
}: ActionFunctionArgs): Promise<PlantDetailActionData | Response> {
  const data = await request.formData();
  const intent = stringField(data, 'intent');
  const plantId = params.plantId ?? '';
  let endpoint = `/api/plants/${plantId}`;
  let method = 'PATCH';
  let body: unknown;

  if (intent === 'delete') {
    method = 'DELETE';
  } else if (intent === 'location') {
    endpoint += '/location';
    const locationId = stringField(data, 'locationId');
    body = { locationId: locationId === '' ? null : Number(locationId) };
  } else if (intent === 'dead' || intent === 'archived' || intent === 'active') {
    endpoint += '/status';
    body = { status: intent };
  } else {
    throw new Response('Unsupported plant action', { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    return { intent, message: mutationErrorMessage(intent), ok: false };
  }
  if (!response.ok) {
    return {
      intent,
      message: mutationErrorMessage(intent, response.status),
      ok: false,
    };
  }
  return redirect(intent === 'delete' ? '/plants' : `/plants/${plantId}`);
}

async function getPlant(id: string): Promise<PlantItem> {
  return getJson<PlantItem>(
    `/api/plants/${encodeURIComponent(id)}`,
    'Plant detail unavailable',
    'Plant not found',
  );
}

async function getJson<T>(
  url: string,
  unavailableMessage: string,
  notFoundMessage = unavailableMessage,
): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Response(response.status === 404 ? notFoundMessage : unavailableMessage, {
      status: response.status,
    });
  }
  return response.json() as Promise<T>;
}

function stringField(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === 'string' ? value : '';
}

function formErrorMessage(status: number, editing: boolean): string {
  if (status === 400) {
    return 'Enter a nickname, active species, and acquisition date that is not in the future.';
  }
  if (status === 404) {
    return editing
      ? 'This plant could not be found. Return to the collection and try again.'
      : 'The selected species is no longer available.';
  }
  if (status === 409) {
    return editing
      ? 'The plant or selected species is no longer available for this update.'
      : 'Select an active species before adding the plant.';
  }
  return editing
    ? 'The plant could not be updated. Nothing was changed; you can try again.'
    : 'The plant could not be added. Nothing was created; you can try again.';
}

function mutationErrorMessage(intent: string, status?: number): string {
  if (status === 404) {
    return intent === 'location'
      ? 'The plant or selected location could not be found. The previous location was kept.'
      : 'This plant could not be found. No other plant was changed.';
  }
  if (status === 409) {
    return 'This action is no longer available for the plant in its current state.';
  }
  if (intent === 'delete') {
    return 'The plant could not be permanently deleted. Nothing was partially deleted.';
  }
  if (intent === 'location') {
    return 'The location could not be changed. The previous location was kept.';
  }
  return 'The plant status could not be changed. Nothing was changed.';
}
