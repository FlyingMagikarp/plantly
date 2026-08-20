import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom';
import type { PlantItem } from './plants-data';

export interface PlantImageItem { id: number; plantId: number; mediaType: string; byteSize: number; addedAt: string; contentUrl: string }
export interface PlantImagesData { plant: PlantItem; images: PlantImageItem[] }
export interface ImageActionData { ok: boolean; message: string; intent: 'add-image' | 'remove-image' }

export async function plantImagesLoader({ params }: LoaderFunctionArgs): Promise<PlantImagesData> {
  const plantId = encodeURIComponent(params.plantId ?? '');
  const [plant, images] = await Promise.all([
    getJson<PlantItem>(`/api/plants/${plantId}`, 'Plant not found'),
    getJson<PlantImageItem[]>(`/api/plants/${plantId}/images`, 'Plant images could not be loaded'),
  ]);
  return { plant, images };
}

export async function plantImagesAction({ request, params }: ActionFunctionArgs): Promise<ImageActionData> {
  const data = await request.formData();
  const intent = data.get('intent') === 'remove-image' ? 'remove-image' : 'add-image';
  const plantId = encodeURIComponent(params.plantId ?? '');
  let response: Response;
  try {
    if (intent === 'remove-image') {
      response = await fetch(`/api/plants/${plantId}/images/${encodeURIComponent(text(data.get('imageId')))}`, { method: 'DELETE' });
    } else {
      response = await fetch(`/api/plants/${plantId}/images`, { method: 'POST', body: data });
    }
  } catch {
    return { ok: false, intent, message: intent === 'add-image' ? 'The image could not be added. You can try again.' : 'The image could not be removed. It remains available; you can try again.' };
  }
  if (!response.ok) {
    const message = response.status === 404 ? 'The plant or selected image was not found.' : response.status === 409 ? 'Images can only be changed while the plant is active.' : intent === 'add-image' ? 'Select a JPEG or PNG image no larger than 10 MB.' : 'The image could not be removed. It remains available; you can try again.';
    return { ok: false, intent, message };
  }
  return { ok: true, intent, message: intent === 'add-image' ? 'Image added.' : 'Image permanently removed.' };
}

async function getJson<T>(url: string, message: string): Promise<T> { const response = await fetch(url); if (!response.ok) throw new Response(message, { status: response.status }); return response.json() as Promise<T>; }
function text(value: FormDataEntryValue | null): string { return typeof value === 'string' ? value : ''; }
