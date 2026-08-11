import type { ActionFunctionArgs } from 'react-router-dom';

export interface LocationItem {
  id: number;
  name: string;
}

export interface LocationActionData {
  intent: 'create' | 'update' | 'delete';
  locationId?: number;
  message?: string;
  ok: boolean;
}

export async function locationsLoader(): Promise<LocationItem[]> {
  const response = await fetch('/api/locations');
  if (!response.ok) {
    throw new Response('Locations unavailable', { status: response.status });
  }

  return response.json() as Promise<LocationItem[]>;
}

export async function locationsAction({
  request,
}: ActionFunctionArgs): Promise<LocationActionData> {
  const formData = await request.formData();
  const intent = parseIntent(formData.get('intent'));
  const locationId = parseLocationId(formData.get('locationId'));
  const name = formData.get('name');
  let response: Response;
  try {
    response = await fetch(locationEndpoint(intent, locationId), {
      method: intent === 'create' ? 'POST' : intent === 'update' ? 'PATCH' : 'DELETE',
      headers: intent === 'delete' ? undefined : { 'Content-Type': 'application/json' },
      body:
        intent === 'delete'
          ? undefined
          : JSON.stringify({ name: typeof name === 'string' ? name : '' }),
    });
  } catch {
    return {
      intent,
      locationId,
      message: actionErrorMessage(intent),
      ok: false,
    };
  }

  if (!response.ok) {
    return {
      intent,
      locationId,
      message: actionErrorMessage(intent, response.status),
      ok: false,
    };
  }

  return { intent, locationId, ok: true };
}

function parseIntent(value: FormDataEntryValue | null): LocationActionData['intent'] {
  if (value === 'create' || value === 'update' || value === 'delete') {
    return value;
  }
  throw new Response('Unsupported location action', { status: 400 });
}

function parseLocationId(value: FormDataEntryValue | null): number | undefined {
  if (value === null) {
    return undefined;
  }
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw new Response('Invalid location identifier', { status: 400 });
  }
  return Number(value);
}

function locationEndpoint(
  intent: LocationActionData['intent'],
  locationId: number | undefined,
): string {
  if (intent === 'create') {
    return '/api/locations';
  }
  if (locationId === undefined) {
    throw new Response('Location identifier is required', { status: 400 });
  }
  return `/api/locations/${locationId}`;
}

function actionErrorMessage(
  intent: LocationActionData['intent'],
  status?: number,
): string {
  if (status === 400) {
    return 'Enter a location name.';
  }
  if (status === 409) {
    return 'That location name is already used.';
  }
  if (status === 404) {
    return 'This location could not be found. Refresh and try again.';
  }
  if (intent === 'create') {
    return 'The location could not be created. Your name is still here so you can try again.';
  }
  if (intent === 'update') {
    return 'The location could not be renamed. Your name is still here so you can try again.';
  }
  return 'The location could not be removed. Nothing was changed.';
}
