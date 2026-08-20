import { useState } from 'react';
import { Link, useFetcher, useLoaderData } from 'react-router-dom';
import type {
  CareEventItem,
  CareEventType,
  PlantDetailActionData,
  PlantDetailData,
  PlantStatus,
} from './plants-data';
import { PlantPageHeader } from './plants-common';
import { BackLink } from '../components/ui';

export function PlantDetailRoute() {
  const { plant, locations, history } = useLoaderData<PlantDetailData>();
  const [confirmation, setConfirmation] = useState<'dead' | 'archived' | 'delete' | null>(null);
  const restore = useFetcher<PlantDetailActionData>();

  return (
    <PlantPageHeader>
      <div className="flex items-start justify-between gap-4">
        <BackLink to="/plants">My Plants</BackLink>
        <details className="relative">
          <summary aria-label="Additional plant actions" className="grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-lg border border-stone-300 bg-white text-xl">⋯</summary>
          <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-stone-200 bg-white p-2 shadow-lg">
            <button className="min-h-11 w-full rounded-md px-3 text-left text-sm font-medium text-red-700 hover:bg-red-50" onClick={() => setConfirmation('delete')} type="button">Permanently delete</button>
          </div>
        </details>
      </div>

      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-3"><h1 className="page-title">{plant.nickname}</h1><StatusBadge status={plant.status} /></div>
        <p className="mt-2 text-sm text-stone-500">Plant {plant.id}</p>
      </header>

      <section className="mt-6"><h2 className="text-xl font-semibold">Plant details</h2><dl className="mt-3 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white px-4"><DetailRow label="Species" value={<Link className="font-medium text-emerald-700 hover:underline" to={`/species/${plant.species.id}`}>{plant.species.name}{plant.species.archived ? ' (archived)' : ''}</Link>} /><DetailRow label="Acquired" value={plant.acquisitionDate} /><DetailRow label="Status" value={capitalize(plant.status)} /><DetailRow label="Location" value={plant.location?.name ?? 'No location assigned'} /></dl></section>

      <section className="mt-8"><h2 className="text-xl font-semibold">Notes</h2><p className="mt-3 whitespace-pre-wrap text-stone-700">{plant.notes ?? 'No notes recorded.'}</p></section>

      <section className="mt-8"><h2 className="text-xl font-semibold">Images</h2><p className="mt-2 text-stone-600">Review this plant’s retained images{plant.status === 'active' ? ' or add a new one' : ''}.</p><Link className="btn-secondary mt-4 inline-flex" to={`/plants/${plant.id}/images`}>View plant images</Link></section>

      {plant.status === 'active' ? (
        <>
        <CareEventForm plantId={plant.id} />
        <section className="mt-8 border-t border-stone-200 pt-8">
          <h2 className="text-xl font-semibold">Manage plant</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link className="grid min-h-11 place-items-center rounded-lg bg-emerald-700 px-4 font-medium text-white hover:bg-emerald-800" to={`/plants/${plant.id}/edit`}>Edit plant</Link>
            <LocationAssignment currentId={plant.location?.id ?? null} locations={locations} />
            <button className="min-h-11 rounded-lg border border-stone-300 px-4 font-medium hover:bg-stone-100" onClick={() => setConfirmation('dead')} type="button">Mark dead</button>
            <button className="min-h-11 rounded-lg border border-stone-300 px-4 font-medium hover:bg-stone-100" onClick={() => setConfirmation('archived')} type="button">Archive plant</button>
          </div>
        </section>
        </>
      ) : (
        <section className="mt-8 border-t border-stone-200 pt-8">
          <h2 className="text-xl font-semibold">Restore plant</h2>
          <p className="mt-2 text-stone-600">Restore this plant to active before editing it or changing its location.</p>
          <restore.Form className="mt-4" method="post"><input name="intent" type="hidden" value="active" /><button className="min-h-11 rounded-lg bg-emerald-700 px-4 font-medium text-white hover:bg-emerald-800 disabled:bg-emerald-500" disabled={restore.state !== 'idle'} type="submit">{restore.state === 'idle' ? 'Restore to active' : 'Restoring…'}</button></restore.Form>
          {restore.data && !restore.data.ok && <p className="mt-3 text-sm text-red-700" role="alert">{restore.data.message}</p>}
        </section>
      )}

      <CareHistory history={history} plantActive={plant.status === 'active'} plantId={plant.id} />

      {confirmation && <PlantConfirmation action={confirmation} nickname={plant.nickname} onCancel={() => setConfirmation(null)} />}
    </PlantPageHeader>
  );
}

function CareEventForm({ plantId }: { plantId: number }) {
  const mutation = useFetcher<PlantDetailActionData>();
  const failure = mutation.data && !mutation.data.ok && mutation.data.intent === 'care-event'
    ? mutation.data
    : null;
  const [type, setType] = useState<CareEventType>((failure?.fields?.type as CareEventType) ?? 'observation');
  const defaultTimestamp = failure?.fields?.timestamp ?? localDateTimeValue(new Date());
  const defaultNotes = failure?.fields?.notes ?? '';

  return (
    <section className="mt-8 border-t border-stone-200 pt-8">
      <h2 className="text-xl font-semibold">Record {type === 'pest-treatment' ? 'pest treatment' : type}</h2>
      <p className="mt-2 text-sm text-stone-600">Record what happened now, or add an earlier time and optional notes.</p>
      <mutation.Form className="mt-4 grid gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:p-5" key={`${plantId}-${failure?.fields?.timestamp ?? 'new'}`} method="post">
        <input name="intent" type="hidden" value="care-event" />
        <label className="grid gap-1 text-sm font-medium">Care type
          <select className="min-h-11 rounded-lg border border-stone-300 bg-white px-3" name="type" onChange={(event) => setType(event.target.value as CareEventType)} value={type}>
            <option value="watering">Watering</option><option value="pruning">Pruning</option><option value="repotting">Repotting</option><option value="pest-treatment">Pest treatment</option><option value="observation">Observation</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Happened at
          <input className="min-h-11 rounded-lg border border-stone-300 px-3 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200" defaultValue={defaultTimestamp} max={localDateTimeValue(new Date())} name="timestamp" required type="datetime-local" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Notes <span className="font-normal text-stone-500">(optional)</span>
          <textarea className="min-h-24 rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200" defaultValue={defaultNotes} name="notes" />
        </label>
        {type === 'watering' && <label className="flex min-h-11 items-center gap-3 text-sm font-medium"><input defaultChecked={failure?.fields?.fertilizerIncluded} name="fertilizerIncluded" type="checkbox" /> Fertilizer was included</label>}
        <button className="min-h-11 rounded-lg bg-emerald-700 px-4 font-medium text-white hover:bg-emerald-800 disabled:bg-emerald-500 sm:justify-self-start" disabled={mutation.state !== 'idle'} type="submit">
          {mutation.state === 'idle' ? `Record ${type === 'pest-treatment' ? 'pest treatment' : type}` : 'Recording…'}
        </button>
        {mutation.data && (
          <p className={`text-sm ${mutation.data.ok ? 'text-emerald-700' : 'text-red-700'}`} role={mutation.data.ok ? 'status' : 'alert'}>
            {mutation.data.message}
          </p>
        )}
      </mutation.Form>
    </section>
  );
}

function CareHistory({ history, plantActive, plantId }: { history: PlantDetailData['history']; plantActive: boolean; plantId: number }) {
  const removal = useFetcher<PlantDetailActionData>();
  const [removing, setRemoving] = useState<CareEventItem | null>(null);
  return <section className="mt-8 border-t border-stone-200 pt-8">
    <h2 className="text-xl font-semibold">Care history</h2>
    {removal.data && <p className={`mt-3 text-sm ${removal.data.ok ? 'text-emerald-700' : 'text-red-700'}`} role={removal.data.ok ? 'status' : 'alert'}>{removal.data.message}</p>}
    {history.items.length === 0 ? <p className="mt-3 text-stone-600">No care events recorded.</p> : <ol className="mt-4 grid gap-3">
      {history.items.map((event) => <CareHistoryItem event={event} key={event.id} onRemove={() => setRemoving(event)} plantActive={plantActive} />)}
    </ol>}
    {history.totalPages > 1 && <nav aria-label="Care history pages" className="mt-5 flex items-center justify-between gap-3">
      {history.page > 1 ? <Link className="min-h-11 rounded-lg border border-stone-300 px-4 py-2.5 font-medium" to={`?historyPage=${history.page - 1}`}>Newer</Link> : <span />}
      <span className="text-sm text-stone-600">Page {history.page} of {history.totalPages}</span>
      {history.page < history.totalPages ? <Link className="min-h-11 rounded-lg border border-stone-300 px-4 py-2.5 font-medium" to={`?historyPage=${history.page + 1}`}>Older</Link> : <span />}
    </nav>}
    {!plantActive && history.items.length > 0 && <p className="mt-4 text-sm text-stone-600">Restore this plant to active before correcting or removing its history.</p>}
    <span className="sr-only">History for plant {plantId}</span>
    {removing && <CareEventRemoval event={removing} mutation={removal} onCancel={() => setRemoving(null)} onConfirm={() => setRemoving(null)} />}
  </section>;
}

function CareHistoryItem({ event, onRemove, plantActive }: { event: CareEventItem; onRemove: () => void; plantActive: boolean }) {
  return <li className="rounded-xl border border-stone-200 bg-white p-4">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{careEventLabel(event.type)}</h3><time className="text-sm text-stone-600" dateTime={event.timestamp}>{new Date(event.timestamp).toLocaleString()}</time></div>{plantActive && <div className="flex flex-wrap gap-2"><CorrectionForm event={event} /><button className="min-h-11 rounded-lg border border-red-300 px-3 text-sm font-medium text-red-700 hover:bg-red-50" onClick={onRemove} type="button">Remove</button></div>}</div>
    {event.notes && <p className="mt-3 whitespace-pre-wrap text-stone-700">{event.notes}</p>}
    {event.type === 'watering' && event.fertilizerIncluded && <p className="mt-2 text-sm text-stone-600">Fertilizer included</p>}
  </li>;
}

function CareEventRemoval({ event, mutation, onCancel, onConfirm }: { event: CareEventItem; mutation: ReturnType<typeof useFetcher<PlantDetailActionData>>; onCancel: () => void; onConfirm: () => void }) {
  return <div aria-labelledby="care-event-removal-title" aria-modal="true" className="fixed inset-0 z-20 grid place-items-center bg-stone-950/40 p-4" role="dialog"><section className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
    <h2 className="text-xl font-semibold" id="care-event-removal-title">Permanently remove this {careEventLabel(event.type).toLowerCase()} event?</h2>
    <p className="mt-3 text-stone-600">The event from {new Date(event.timestamp).toLocaleString()} and any images attached to it will be permanently removed. This cannot be undone.</p>
    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button className="min-h-11 rounded-lg border border-stone-300 px-4 font-medium" disabled={mutation.state !== 'idle'} onClick={onCancel} type="button">Cancel</button><mutation.Form method="post" onSubmit={onConfirm}><input name="intent" type="hidden" value="remove-care-event" /><input name="eventId" type="hidden" value={event.id} /><button className="min-h-11 w-full rounded-lg bg-red-700 px-4 font-medium text-white hover:bg-red-800 disabled:opacity-60" disabled={mutation.state !== 'idle'} type="submit">Permanently remove event</button></mutation.Form></div>
  </section></div>;
}

function CorrectionForm({ event }: { event: CareEventItem }) {
  const mutation = useFetcher<PlantDetailActionData>();
  const failed = mutation.data && !mutation.data.ok && mutation.data.intent === 'correct-care-event' && mutation.data.fields?.eventId === String(event.id) ? mutation.data : null;
  return <details className="min-w-32"><summary className="cursor-pointer rounded-lg border border-stone-300 px-3 py-2 text-center text-sm font-medium">Correct</summary><mutation.Form className="mt-3 grid gap-3 border-t border-stone-200 pt-3" method="post">
    <input name="intent" type="hidden" value="correct-care-event" /><input name="eventId" type="hidden" value={event.id} />
    <p className="text-xs text-stone-500">{careEventLabel(event.type)} · event {event.id}</p>
    <label className="grid gap-1 text-sm font-medium">Happened at<input className="min-h-11 rounded-lg border border-stone-300 px-3" defaultValue={failed?.fields?.timestamp ?? localDateTimeValue(new Date(event.timestamp))} max={localDateTimeValue(new Date())} name="timestamp" required type="datetime-local" /></label>
    <label className="grid gap-1 text-sm font-medium">Notes <span className="font-normal text-stone-500">(optional)</span><textarea className="min-h-20 rounded-lg border border-stone-300 px-3 py-2" defaultValue={failed?.fields?.notes ?? event.notes ?? ''} name="notes" /></label>
    <button className="min-h-11 rounded-lg bg-emerald-700 px-4 font-medium text-white disabled:bg-emerald-500" disabled={mutation.state !== 'idle'} type="submit">{mutation.state === 'idle' ? 'Save correction' : 'Saving…'}</button>
    {mutation.data && <p className={`text-sm ${mutation.data.ok ? 'text-emerald-700' : 'text-red-700'}`} role={mutation.data.ok ? 'status' : 'alert'}>{mutation.data.message}</p>}
  </mutation.Form></details>;
}

function careEventLabel(type: CareEventType): string {
  return type === 'pest-treatment' ? 'Pest treatment' : capitalize(type);
}

function localDateTimeValue(date: Date): string {
  const local = new Date(date.valueOf() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function LocationAssignment({ currentId, locations }: { currentId: number | null; locations: PlantDetailData['locations'] }) {
  const assignment = useFetcher<PlantDetailActionData>();
  return <details className="rounded-lg border border-stone-300"><summary className="min-h-11 cursor-pointer px-4 py-3 text-center font-medium">Change location</summary><assignment.Form className="grid gap-3 border-t border-stone-200 p-3" method="post"><input name="intent" type="hidden" value="location" /><label className="grid gap-1 text-sm font-medium">Location<select className="min-h-11 rounded-lg border border-stone-300 bg-white px-3" defaultValue={currentId?.toString() ?? ''} name="locationId"><option value="">No location</option>{locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select></label><button className="min-h-11 rounded-lg bg-emerald-700 px-4 font-medium text-white hover:bg-emerald-800 disabled:bg-emerald-500" disabled={assignment.state !== 'idle'} type="submit">{assignment.state === 'idle' ? 'Apply location' : 'Applying…'}</button>{assignment.data && !assignment.data.ok && <p className="text-sm text-red-700" role="alert">{assignment.data.message}</p>}</assignment.Form></details>;
}

function PlantConfirmation({ action, nickname, onCancel }: { action: 'dead' | 'archived' | 'delete'; nickname: string; onCancel: () => void }) {
  const mutation = useFetcher<PlantDetailActionData>();
  const wording = action === 'dead' ? 'mark dead' : action === 'archived' ? 'archive' : 'permanently delete';
  return <div aria-labelledby="plant-confirmation-title" aria-modal="true" className="fixed inset-0 z-20 grid place-items-center bg-stone-950/40 p-4" role="dialog"><section className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><h2 className="text-xl font-semibold" id="plant-confirmation-title">{capitalize(wording)} {nickname}?</h2><p className="mt-3 text-stone-600">{action === 'delete' ? 'This permanently removes the plant and all of its care events and images. This cannot be undone.' : `This changes ${nickname} to ${action}. Its plant data, care events, and images will be preserved.`}</p>{mutation.data && !mutation.data.ok && <p className="mt-3 text-sm text-red-700" role="alert">{mutation.data.message}</p>}<div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button className="min-h-11 rounded-lg border border-stone-300 px-4 font-medium hover:bg-stone-50" disabled={mutation.state !== 'idle'} onClick={onCancel} type="button">Cancel</button><mutation.Form method="post"><input name="intent" type="hidden" value={action} /><button className={`min-h-11 w-full rounded-lg px-4 font-medium text-white disabled:opacity-60 ${action === 'delete' ? 'bg-red-700 hover:bg-red-800' : 'bg-stone-800 hover:bg-stone-900'}`} disabled={mutation.state !== 'idle'} type="submit">{mutation.state === 'idle' ? `Confirm ${wording}` : 'Applying…'}</button></mutation.Form></div></section></div>;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) { return <div className="grid grid-cols-2 gap-4 py-3"><dt className="text-sm text-stone-600">{label}</dt><dd className="text-right font-medium">{value}</dd></div>; }
function StatusBadge({ status }: { status: PlantStatus }) { const color = status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'; return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{capitalize(status)}</span>; }
function capitalize(value: string): string { return value.charAt(0).toUpperCase() + value.slice(1); }
