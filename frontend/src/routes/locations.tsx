import { useState } from 'react';
import {
  useFetcher,
  useLoaderData,
  useRevalidator,
} from 'react-router-dom';
import type { LocationActionData, LocationItem } from './locations-data';
import { EmptyState, ErrorState, Page, PageHeader } from '../components/ui';

export function LocationsRoute() {
  const locations = useLoaderData<LocationItem[]>();
  const create = useFetcher<LocationActionData>();
  const createError = create.data?.intent === 'create' && !create.data.ok;

  return (
    <Page width="reading">
      <section>
        <PageHeader eyebrow="Plant organisation" title="Locations" description="Manage the physical places where your plants are kept." />

        <create.Form
          className="panel mt-6"
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
              className="form-control"
              id="new-location-name"
              name="name"
              required
              type="text"
            />
            <button
              className="btn-primary w-full sm:w-auto"
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
          <EmptyState title="No locations yet" description="Add the first place where you keep plants." />
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
    </Page>
  );
}

function LocationRow({ location }: { location: LocationItem }) {
  const update = useFetcher<LocationActionData>();
  const updateError =
    update.data?.intent === 'update' &&
    update.data.locationId === location.id &&
    !update.data.ok;

  return (
    <article className="panel">
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
        className="dialog-backdrop"
      role="dialog"
    >
      <section className="dialog">
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
    <ErrorState title="Locations could not be loaded" description="Location management is unavailable. Please try again." action={<button
          className="btn-primary"
          disabled={revalidator.state !== 'idle'}
          onClick={() => revalidator.revalidate()}
          type="button"
        >
          {revalidator.state === 'idle' ? 'Try again' : 'Trying again…'}
        </button>} />
  );
}
