import {
  Form,
  Link,
  useLoaderData,
  useRevalidator,
  useSearchParams,
} from 'react-router-dom';
import type { SpeciesOverviewItem } from './species-list-loader';

type SortField = 'id' | 'name' | 'plantCount';
type SortDirection = 'asc' | 'desc';

export function SpeciesListRoute() {
  const species = useLoaderData<SpeciesOverviewItem[]>();
  const [searchParams] = useSearchParams();
  const excludeArchived = searchParams.get('excludeArchived') === 'true';
  const sort = parseSortField(searchParams.get('sort'));
  const direction = parseSortDirection(searchParams.get('direction'));
  const visibleSpecies = species
    .filter((item) => !excludeArchived || !item.archived)
    .sort((left, right) => compareSpecies(left, right, sort, direction));

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 text-stone-900 sm:px-6">
      <section className="mx-auto max-w-3xl">
        <a className="text-sm font-medium text-emerald-700 hover:underline" href="/">
          Plantly
        </a>
        <div className="mt-4 sm:flex sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-emerald-700 uppercase">
              Species knowledge
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Species</h1>
          </div>
        </div>

        <Form
          className="mt-6 grid gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
          method="get"
        >
          <label className="grid gap-1 text-sm font-medium">
            Sort by
            <select
              className="min-h-11 rounded-lg border border-stone-300 bg-white px-3"
              defaultValue={sort}
              name="sort"
            >
              <option value="id">Identifier</option>
              <option value="name">Species name</option>
              <option value="plantCount">Plant count</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Direction
            <select
              className="min-h-11 rounded-lg border border-stone-300 bg-white px-3"
              defaultValue={direction}
              name="direction"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
          <button
            className="min-h-11 rounded-lg bg-emerald-700 px-4 font-medium text-white hover:bg-emerald-800"
            type="submit"
          >
            Apply
          </button>
          <label className="flex min-h-11 items-center gap-3 text-sm font-medium sm:col-span-3">
            <input
              className="size-5 accent-emerald-700"
              defaultChecked={excludeArchived}
              name="excludeArchived"
              type="checkbox"
              value="true"
            />
            Exclude archived species
          </label>
        </Form>

        {visibleSpecies.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-stone-300 p-8 text-center">
            <h2 className="font-semibold">
              {excludeArchived ? 'No active species' : 'No species yet'}
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              {excludeArchived
                ? 'Disable the archived-species filter to see archived entries.'
                : 'Synchronize species definitions to populate this overview.'}
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-3">
            {visibleSpecies.map((item) => (
              <li key={item.id}>
                <Link
                  className="flex min-h-20 items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4 hover:border-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                  to={`/species/${item.id}`}
                >
                  <span>
                    <span className="block font-semibold">{item.name}</span>
                    <span className="mt-1 block text-sm text-stone-600">
                      SP-{item.id.toString().padStart(3, '0')} ·{' '}
                      {item.archived ? 'Archived' : 'Active'}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-sm text-stone-600">
                    <span className="block text-lg font-semibold text-stone-900">
                      {item.plantCount}
                    </span>
                    {item.plantCount === 1 ? 'plant' : 'plants'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export function SpeciesListError() {
  const revalidator = useRevalidator();

  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-6 text-stone-900">
      <section className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">Species could not be loaded</h1>
        <p className="mt-3 text-stone-600">
          The species overview is unavailable. Please try again.
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

function parseSortField(value: string | null): SortField {
  return value === 'name' || value === 'plantCount' ? value : 'id';
}

function parseSortDirection(value: string | null): SortDirection {
  return value === 'desc' ? 'desc' : 'asc';
}

function compareSpecies(
  left: SpeciesOverviewItem,
  right: SpeciesOverviewItem,
  field: SortField,
  direction: SortDirection,
): number {
  const comparison =
    field === 'name'
      ? left.name.localeCompare(right.name)
      : left[field] - right[field];
  return direction === 'asc' ? comparison : -comparison;
}
