import type { ActionFunctionArgs } from 'react-router-dom';
import type { CareEventType } from './plants-data';

export interface CareRoundOption { locationId: number | null; name: string; plantCount: number }
export interface CareRoundMember { position: number; plantId: number | null; nickname: string; speciesName: string; available: boolean }
export interface CareRound { id: number; status: 'active' | 'completed'; locationId: number | null; locationName: string; currentIndex: number; members: CareRoundMember[]; summary: CareRoundMember[] }
export interface CareRoundData { options: CareRoundOption[]; active: CareRound | null }
export interface CareRoundActionData { ok: boolean; message: string; completed?: CareRound }

export async function careRoundLoader(): Promise<CareRoundData> {
  const [options, active] = await Promise.all([json<CareRoundOption[]>('/api/care-rounds/options'), json<CareRound | null>('/api/care-rounds/active')]);
  return { options, active };
}

export async function careRoundAction({ request }: ActionFunctionArgs): Promise<CareRoundActionData> {
  const data = await request.formData(); const intent = value(data, 'intent'); const roundId = value(data, 'roundId');
  let url = '/api/care-rounds'; let method = 'POST'; let body: unknown;
  if (intent === 'start') body = { locationId: value(data, 'locationId') === 'none' ? null : Number(value(data, 'locationId')) };
  else if (intent === 'next' || intent === 'previous' || intent === 'skip') { url += `/${roundId}/progress`; method = 'PATCH'; body = { direction: intent === 'previous' ? 'previous' : 'next' }; }
  else if (intent === 'complete') { url += `/${roundId}/complete`; method = 'PATCH'; }
  else if (intent === 'record') { const plantId = value(data, 'plantId'); url += `/${roundId}/plants/${plantId}/care-events`; const timestamp = new Date(value(data, 'timestamp')); const type = value(data, 'type') as CareEventType; body = { type, timestamp: Number.isNaN(timestamp.valueOf()) ? value(data, 'timestamp') : timestamp.toISOString(), notes: value(data, 'notes'), ...(type === 'watering' ? { fertilizerIncluded: data.get('fertilizerIncluded') === 'on' } : {}) }; }
  else return { ok: false, message: 'Unsupported care-round action.' };
  try {
    const response = await fetch(url, { method, headers: body === undefined ? undefined : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
    if (!response.ok) return { ok: false, message: response.status === 404 ? 'The selected location, plant, or care round was not found.' : response.status === 409 ? 'That care-round action is no longer available.' : 'The care round could not be changed. You can try again.' };
    const round = await response.json() as CareRound;
    if (intent === 'complete') return { ok: true, message: 'Care round completed.', completed: round };
    return { ok: true, message: intent === 'record' ? 'Care recorded. This plant remains current.' : intent === 'start' ? 'Care round started.' : 'Care-round progress updated.' };
  } catch { return { ok: false, message: 'The care round could not be changed. You can try again.' }; }
}

async function json<T>(url: string): Promise<T> { const response = await fetch(url); if (!response.ok) throw new Response('Care round could not be loaded', { status: response.status }); return response.json() as Promise<T>; }
function value(data: FormData, name: string): string { const result = data.get(name); return typeof result === 'string' ? result : ''; }
