import {
  Form,
  Link,
  useLoaderData,
  useRevalidator,
  useSearchParams,
} from 'react-router-dom';
import type { SpeciesOverviewItem } from './species-list-loader';
import { EmptyState, ErrorState, Page, PageHeader } from '../components/ui';

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
    <Page>
      <section className="mx-auto max-w-5xl">
        <PageHeader eyebrow="Species knowledge" title="Species" description="Concise care reference for the species in your collection." />

        <Form
          className="panel mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
          method="get"
        >
          <label className="grid gap-1 text-sm font-medium">
            Sort by
            <select
              className="form-control"
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
              className="form-control"
              defaultValue={direction}
              name="direction"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
          <button
            className="btn-primary"
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
          <EmptyState title={
              excludeArchived ? 'No active species' : 'No species yet'
            } description={
              excludeArchived
                ? 'Disable the archived-species filter to see archived entries.'
                : 'Synchronize species definitions to populate this overview.'
            } />
        ) : (
          <ul className="mt-6 grid gap-3">
            {visibleSpecies.map((item) => (
              <li key={item.id}>
                <Link
                  className="interactive-card flex min-h-24 items-center justify-between gap-4 p-4 sm:p-5"
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
    </Page>
  );
}

export function SpeciesListError() {
  const revalidator = useRevalidator();

  return (
    <ErrorState title="Species could not be loaded" description="The species overview is unavailable. Please try again." action={<button
          className="btn-primary"
          disabled={revalidator.state !== 'idle'}
          onClick={() => revalidator.revalidate()}
          type="button"
        >
          {revalidator.state === 'idle' ? 'Try again' : 'Trying again…'}
        </button>} />
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
