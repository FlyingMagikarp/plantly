import { useState } from 'react';
import { Link, useFetcher, useLoaderData } from 'react-router-dom';
import type {
  PlantDetailActionData,
  PlantDetailData,
  PlantStatus,
} from './plants-data';
import { PlantPageHeader } from './plants-common';

export function PlantDetailRoute() {
  const { plant, locations } = useLoaderData<PlantDetailData>();
  const [confirmation, setConfirmation] = useState<'dead' | 'archived' | 'delete' | null>(null);
  const restore = useFetcher<PlantDetailActionData>();

  return (
    <PlantPageHeader>
      <div className="flex items-start justify-between gap-4">
        <Link className="text-sm font-medium text-emerald-700 hover:underline" to="/plants">← My plants</Link>
        <details className="relative">
          <summary aria-label="Additional plant actions" className="grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-lg border border-stone-300 bg-white text-xl">⋯</summary>
          <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-stone-200 bg-white p-2 shadow-lg">
            <button className="min-h-11 w-full rounded-md px-3 text-left text-sm font-medium text-red-700 hover:bg-red-50" onClick={() => setConfirmation('delete')} type="button">Permanently delete</button>
          </div>
        </details>
      </div>

      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-3"><h1 className="text-3xl font-semibold tracking-tight">{plant.nickname}</h1><StatusBadge status={plant.status} /></div>
        <p className="mt-2 text-sm text-stone-500">Plant {plant.id}</p>
      </header>

      <section className="mt-6"><h2 className="text-xl font-semibold">Plant details</h2><dl className="mt-3 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white px-4"><DetailRow label="Species" value={<Link className="font-medium text-emerald-700 hover:underline" to={`/species/${plant.species.id}`}>{plant.species.name}{plant.species.archived ? ' (archived)' : ''}</Link>} /><DetailRow label="Acquired" value={plant.acquisitionDate} /><DetailRow label="Status" value={capitalize(plant.status)} /><DetailRow label="Location" value={plant.location?.name ?? 'No location assigned'} /></dl></section>

      <section className="mt-8"><h2 className="text-xl font-semibold">Notes</h2><p className="mt-3 whitespace-pre-wrap text-stone-700">{plant.notes ?? 'No notes recorded.'}</p></section>

      {plant.status === 'active' ? (
        <section className="mt-8 border-t border-stone-200 pt-8">
          <h2 className="text-xl font-semibold">Manage plant</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link className="grid min-h-11 place-items-center rounded-lg bg-emerald-700 px-4 font-medium text-white hover:bg-emerald-800" to={`/plants/${plant.id}/edit`}>Edit plant</Link>
            <LocationAssignment currentId={plant.location?.id ?? null} locations={locations} />
            <button className="min-h-11 rounded-lg border border-stone-300 px-4 font-medium hover:bg-stone-100" onClick={() => setConfirmation('dead')} type="button">Mark dead</button>
            <button className="min-h-11 rounded-lg border border-stone-300 px-4 font-medium hover:bg-stone-100" onClick={() => setConfirmation('archived')} type="button">Archive plant</button>
          </div>
        </section>
      ) : (
        <section className="mt-8 border-t border-stone-200 pt-8">
          <h2 className="text-xl font-semibold">Restore plant</h2>
          <p className="mt-2 text-stone-600">Restore this plant to active before editing it or changing its location.</p>
          <restore.Form className="mt-4" method="post"><input name="intent" type="hidden" value="active" /><button className="min-h-11 rounded-lg bg-emerald-700 px-4 font-medium text-white hover:bg-emerald-800 disabled:bg-emerald-500" disabled={restore.state !== 'idle'} type="submit">{restore.state === 'idle' ? 'Restore to active' : 'Restoring…'}</button></restore.Form>
          {restore.data && !restore.data.ok && <p className="mt-3 text-sm text-red-700" role="alert">{restore.data.message}</p>}
        </section>
      )}

      {confirmation && <PlantConfirmation action={confirmation} nickname={plant.nickname} onCancel={() => setConfirmation(null)} />}
    </PlantPageHeader>
  );
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
