import { useMemo, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import type { PlantCollectionData, PlantItem, PlantStatus } from './plants-data';
import { PlantPageHeader } from './plants-common';
import { EmptyState, PageHeader } from '../components/ui';

type SortField = 'nickname' | 'species' | 'location';
type SortDirection = 'asc' | 'desc';

export function PlantCollectionRoute() {
  const data = useLoaderData<PlantCollectionData>();
  const [statuses, setStatuses] = useState<PlantStatus[]>(['active']);
  const [speciesIds, setSpeciesIds] = useState(() => data.species.map(({ id }) => id));
  const [locationIds, setLocationIds] = useState(() => data.locations.map(({ id }) => id));
  const [includeNoLocation, setIncludeNoLocation] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('nickname');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const displayed = useMemo(() => {
    const needle = search.toLocaleLowerCase();
    return [...data.plants]
      .filter((plant) => statuses.includes(plant.status))
      .filter((plant) => speciesIds.includes(plant.species.id))
      .filter((plant) => plant.location ? locationIds.includes(plant.location.id) : includeNoLocation)
      .filter((plant) => plant.nickname.toLocaleLowerCase().includes(needle) || plant.species.name.toLocaleLowerCase().includes(needle))
      .sort((left, right) => comparePlants(left, right, sortField, sortDirection));
  }, [data.plants, includeNoLocation, locationIds, search, sortDirection, sortField, speciesIds, statuses]);

  return (
    <PlantPageHeader>
      <PageHeader eyebrow="Plant collection" title="My Plants" description="Search, filter, and maintain every plant in your collection." action={<Link className="btn-primary w-full sm:w-auto" to="/plants/new">Add plant</Link>} />

      {data.plants.length === 0 ? (
        <EmptyCollection />
      ) : (
        <>
          <section aria-label="Collection controls" className="panel mt-6 grid gap-4">
            <label className="grid gap-1 text-sm font-medium" htmlFor="plant-search">
              Search nickname or species
              <input className="form-control" id="plant-search" onChange={(event) => setSearch(event.target.value)} type="search" value={search} />
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              <CheckboxMenu label="Status">
                {(['active', 'dead', 'archived'] as PlantStatus[]).map((status) => <Checkbox key={status} label={capitalize(status)} checked={statuses.includes(status)} onChange={() => setStatuses(toggle(statuses, status))} />)}
              </CheckboxMenu>
              <CheckboxMenu label="Species">
                {data.species.map((species) => <Checkbox key={species.id} label={`${species.name}${species.archived ? ' (archived)' : ''}`} checked={speciesIds.includes(species.id)} onChange={() => setSpeciesIds(toggle(speciesIds, species.id))} />)}
              </CheckboxMenu>
              <CheckboxMenu label="Location">
                <Checkbox label="No location" checked={includeNoLocation} onChange={() => setIncludeNoLocation((value) => !value)} />
                {data.locations.map((location) => <Checkbox key={location.id} label={location.name} checked={locationIds.includes(location.id)} onChange={() => setLocationIds(toggle(locationIds, location.id))} />)}
              </CheckboxMenu>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">Sort by
                <select className="form-control" onChange={(event) => setSortField(event.target.value as SortField)} value={sortField}>
                  <option value="nickname">Nickname</option><option value="species">Species name</option><option value="location">Location name</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium">Direction
                <select className="form-control" onChange={(event) => setSortDirection(event.target.value as SortDirection)} value={sortDirection}>
                  <option value="asc">Ascending</option><option value="desc">Descending</option>
                </select>
              </label>
            </div>
          </section>

          {displayed.length === 0 ? (
            <EmptyState title="No plants match these filters" description="Change a status, species, location, or search selection to see plants." />
          ) : (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {displayed.map((plant) => <PlantCard key={plant.id} plant={plant} />)}
            </ul>
          )}
        </>
      )}
    </PlantPageHeader>
  );
}

function PlantCard({ plant }: { plant: PlantItem }) {
  return <li><Link className="interactive-card min-h-32 p-4 sm:p-5" to={`/plants/${plant.id}`}><div className="flex items-start justify-between gap-3"><h2 className="text-lg font-bold text-neutral-900">{plant.nickname}</h2>{plant.status !== 'active' && <span className="badge badge-neutral">{capitalize(plant.status)}</span>}</div><p className="mt-2 text-sm text-neutral-700">{plant.species.name}</p><p className="mt-4 text-sm text-neutral-500">{plant.location?.name ?? 'No location'}</p></Link></li>;
}

function EmptyCollection() {
  return <EmptyState title="Your collection is empty" description="Add your first plant to start the collection." action={<Link className="btn-primary" to="/plants/new">Add first plant</Link>} />;
}

function CheckboxMenu({ children, label }: { children: React.ReactNode; label: string }) {
  return <details className="rounded-lg border border-neutral-300"><summary className="min-h-11 cursor-pointer px-3 py-3 text-sm font-semibold text-neutral-800">{label}</summary><div className="grid gap-2 border-t border-neutral-200 p-3">{children}</div></details>;
}

function Checkbox({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return <label className="flex min-h-9 items-center gap-2 text-sm"><input checked={checked} onChange={onChange} type="checkbox" />{label}</label>;
}

function toggle<T>(values: T[], value: T): T[] { return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]; }
function capitalize(value: string): string { return value.charAt(0).toUpperCase() + value.slice(1); }
function comparePlants(left: PlantItem, right: PlantItem, field: SortField, direction: SortDirection): number {
  const value = (plant: PlantItem) => field === 'nickname' ? plant.nickname : field === 'species' ? plant.species.name : plant.location?.name ?? 'No location';
  const result = value(left).localeCompare(value(right), undefined, { sensitivity: 'base' });
  return direction === 'asc' ? result : -result;
}
