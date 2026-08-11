import { useState } from 'react';
import {
  Link,
  useFetcher,
  useLoaderData,
  useRevalidator,
} from 'react-router-dom';
import type { LocationActionData, LocationItem } from './locations-data';

export function LocationsRoute() {
  const locations = useLoaderData<LocationItem[]>();
  const create = useFetcher<LocationActionData>();
  const createError = create.data?.intent === 'create' && !create.data.ok;

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 text-stone-900 sm:px-6">
      <section className="mx-auto max-w-2xl">
        <Link className="text-sm font-medium text-emerald-700 hover:underline" to="/">
          ← Plantly
        </Link>
        <header className="mt-5">
          <p className="text-sm font-semibold tracking-wide text-emerald-700 uppercase">
            Plant organization
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Locations</h1>
          <p className="mt-2 text-stone-600">
            Manage the physical places where your plants are kept.
          </p>
        </header>

        <create.Form
          className="mt-6 rounded-xl border border-stone-200 bg-white p-4"
          method="post"
        >
          <input name="intent" type="hidden" value="create" />
          <label className="grid gap-1 text-sm font-medium" htmlFor="new-location-name">
            New location name
          </label>
          <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              aria-describedby={createError ? 'create-location-error' : undefined}
              aria-invalid={createError || undefined}
              className="min-h-11 rounded-lg border border-stone-300 bg-white px-3"
              id="new-location-name"
              name="name"
              required
              type="text"
            />
            <button
              className="min-h-11 rounded-lg bg-emerald-700 px-4 font-medium text-white hover:bg-emerald-800 disabled:cursor-wait disabled:bg-emerald-500"
              disabled={create.state !== 'idle'}
              type="submit"
            >
              {create.state === 'idle' ? 'Add location' : 'Adding…'}
            </button>
          </div>
          {createError && (
            <p className="mt-2 text-sm text-red-700" id="create-location-error" role="alert">
              {create.data?.message}
            </p>
          )}
        </create.Form>

        {locations.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-stone-300 p-8 text-center">
            <h2 className="font-semibold">No locations yet</h2>
            <p className="mt-2 text-sm text-stone-600">
              Add the first place where you keep plants.
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-3">
            {locations.map((location) => (
              <li key={`${location.id}:${location.name}`}>
                <LocationRow location={location} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function LocationRow({ location }: { location: LocationItem }) {
  const update = useFetcher<LocationActionData>();
  const updateError =
    update.data?.intent === 'update' &&
    update.data.locationId === location.id &&
    !update.data.ok;

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold">{location.name}</h2>
          <p className="mt-1 text-xs text-stone-500">Location {location.id}</p>
        </div>
        <DeleteLocation location={location} />
      </div>

      <details className="mt-4 border-t border-stone-200 pt-3">
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-emerald-700">
          Rename location
        </summary>
        <update.Form className="grid gap-3 sm:grid-cols-[1fr_auto]" method="post">
          <input name="intent" type="hidden" value="update" />
          <input name="locationId" type="hidden" value={location.id} />
          <label className="grid gap-1 text-sm font-medium">
            Name
            <input
              aria-describedby={updateError ? `update-error-${location.id}` : undefined}
              aria-invalid={updateError || undefined}
              className="min-h-11 rounded-lg border border-stone-300 bg-white px-3"
              defaultValue={location.name}
              name="name"
              required
              type="text"
            />
          </label>
          <button
            className="min-h-11 self-end rounded-lg bg-emerald-700 px-4 font-medium text-white hover:bg-emerald-800 disabled:cursor-wait disabled:bg-emerald-500"
            disabled={update.state !== 'idle'}
            type="submit"
          >
            {update.state === 'idle' ? 'Save name' : 'Saving…'}
          </button>
        </update.Form>
        {updateError && (
          <p className="mt-2 text-sm text-red-700" id={`update-error-${location.id}`} role="alert">
            {update.data?.message}
          </p>
        )}
      </details>
    </article>
  );
}

function DeleteLocation({ location }: { location: LocationItem }) {
  const remove = useFetcher<LocationActionData>();
  const [confirming, setConfirming] = useState(false);
  const removeError =
    remove.data?.intent === 'delete' &&
    remove.data.locationId === location.id &&
    !remove.data.ok;

  if (!confirming) {
    return (
      <button
        className="min-h-11 rounded-lg px-3 text-sm font-medium text-red-700 hover:bg-red-50"
        onClick={() => setConfirming(true)}
        type="button"
      >
        Remove
      </button>
    );
  }

  return (
    <div
      aria-labelledby={`remove-title-${location.id}`}
      aria-modal="true"
      className="fixed inset-0 z-10 grid place-items-center bg-stone-950/40 p-4"
      role="dialog"
    >
      <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold" id={`remove-title-${location.id}`}>
          Remove {location.name}?
        </h2>
        <p className="mt-3 text-stone-600">
          This location will be permanently deleted. Any plants assigned to it will become
          unassigned; the plants and their history will remain unchanged.
        </p>
        {removeError && (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {remove.data?.message}
          </p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="min-h-11 rounded-lg border border-stone-300 px-4 font-medium hover:bg-stone-50"
            disabled={remove.state !== 'idle'}
            onClick={() => setConfirming(false)}
            type="button"
          >
            Cancel
          </button>
          <remove.Form method="post">
            <input name="intent" type="hidden" value="delete" />
            <input name="locationId" type="hidden" value={location.id} />
            <button
              className="min-h-11 w-full rounded-lg bg-red-700 px-4 font-medium text-white hover:bg-red-800 disabled:cursor-wait disabled:bg-red-400"
              disabled={remove.state !== 'idle'}
              type="submit"
            >
              {remove.state === 'idle' ? 'Permanently remove' : 'Removing…'}
            </button>
          </remove.Form>
        </div>
      </section>
    </div>
  );
}

export function LocationsError() {
  const revalidator = useRevalidator();

  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-6 text-stone-900">
      <section className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">Locations could not be loaded</h1>
        <p className="mt-3 text-stone-600">
          Location management is unavailable. Please try again.
        </p>
        <button
          className="mt-6 min-h-11 rounded-lg bg-emerald-700 px-4 font-medium text-white hover:bg-emerald-800"
          disabled={revalidator.state !== 'idle'}
          onClick={() => revalidator.revalidate()}
          type="button"
        >
          {revalidator.state === 'idle' ? 'Try again' : 'Trying again…'}
        </button>
      </section>
    </main>
  );
}
