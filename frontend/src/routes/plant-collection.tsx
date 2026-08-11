import { useMemo, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import type { PlantCollectionData, PlantItem, PlantStatus } from './plants-data';
import { PlantPageHeader } from './plants-common';

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
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-wide text-emerald-700 uppercase">Plant collection</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">My plants</h1>
          <Link className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:underline" to="/plants/by-location">View by location</Link>
        </div>
        <Link className="grid min-h-11 place-items-center rounded-lg bg-emerald-700 px-4 font-medium text-white hover:bg-emerald-800" to="/plants/new">Add plant</Link>
      </header>

      {data.plants.length === 0 ? (
        <EmptyCollection />
      ) : (
        <>
          <section aria-label="Collection controls" className="mt-6 grid gap-3 rounded-xl border border-stone-200 bg-white p-4">
            <label className="grid gap-1 text-sm font-medium" htmlFor="plant-search">
              Search nickname or species
              <input className="min-h-11 rounded-lg border border-stone-300 px-3" id="plant-search" onChange={(event) => setSearch(event.target.value)} type="search" value={search} />
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
                <select className="min-h-11 rounded-lg border border-stone-300 bg-white px-3" onChange={(event) => setSortField(event.target.value as SortField)} value={sortField}>
                  <option value="nickname">Nickname</option><option value="species">Species name</option><option value="location">Location name</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium">Direction
                <select className="min-h-11 rounded-lg border border-stone-300 bg-white px-3" onChange={(event) => setSortDirection(event.target.value as SortDirection)} value={sortDirection}>
                  <option value="asc">Ascending</option><option value="desc">Descending</option>
                </select>
              </label>
            </div>
          </section>

          {displayed.length === 0 ? (
            <section className="mt-6 rounded-xl border border-dashed border-stone-300 p-8 text-center">
              <h2 className="font-semibold">No plants match these filters</h2>
              <p className="mt-2 text-sm text-stone-600">Change a status, species, location, or search selection to see plants.</p>
            </section>
          ) : (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {displayed.map((plant) => <PlantCard key={plant.id} plant={plant} />)}
            </ul>
          )}
        </>
      )}
    </PlantPageHeader>
  );
}

function PlantCard({ plant }: { plant: PlantItem }) {
  return <li><Link className="block min-h-28 rounded-xl border border-stone-200 bg-white p-4 hover:border-emerald-400 focus-visible:outline-2 focus-visible:outline-emerald-700" to={`/plants/${plant.id}`}><div className="flex items-start justify-between gap-3"><h2 className="font-semibold">{plant.nickname}</h2>{plant.status !== 'active' && <span className="rounded-full bg-stone-200 px-2 py-1 text-xs font-semibold">{capitalize(plant.status)}</span>}</div><p className="mt-2 text-sm text-stone-700">{plant.species.name}</p><p className="mt-1 text-sm text-stone-500">{plant.location?.name ?? 'No location'}</p></Link></li>;
}

function EmptyCollection() {
  return <section className="mt-6 rounded-xl border border-dashed border-stone-300 p-8 text-center"><h2 className="font-semibold">Your collection is empty</h2><p className="mt-2 text-sm text-stone-600">Add your first plant to start the collection.</p><Link className="mt-5 inline-grid min-h-11 place-items-center rounded-lg bg-emerald-700 px-4 font-medium text-white" to="/plants/new">Add first plant</Link></section>;
}

function CheckboxMenu({ children, label }: { children: React.ReactNode; label: string }) {
  return <details className="rounded-lg border border-stone-300"><summary className="min-h-11 cursor-pointer px-3 py-3 text-sm font-medium">{label}</summary><div className="grid gap-2 border-t border-stone-200 p-3">{children}</div></details>;
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
