import { Link, useLoaderData } from 'react-router-dom';
import type { PlantCollectionData } from './plants-data';
import { PlantPageHeader } from './plants-common';

export function PlantsByLocationRoute() {
  const { plants, locations } = useLoaderData<PlantCollectionData>();
  const active = plants.filter((plant) => plant.status === 'active');
  const groups = [
    { id: null, name: 'No location', plants: active.filter((plant) => plant.location === null) },
    ...locations.map((location) => ({ id: location.id, name: location.name, plants: active.filter((plant) => plant.location?.id === location.id) })).filter((group) => group.plants.length > 0),
  ];
  return <PlantPageHeader><Link className="text-sm font-medium text-emerald-700 hover:underline" to="/plants">← My plants</Link><header className="mt-5"><p className="text-sm font-semibold tracking-wide text-emerald-700 uppercase">Plant collection</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Plants by location</h1></header>{active.length === 0 ? <section className="mt-6 rounded-xl border border-dashed border-stone-300 p-8 text-center"><h2 className="font-semibold">No active plants</h2><p className="mt-2 text-sm text-stone-600">Add a plant to see it grouped by location.</p><Link className="mt-5 inline-grid min-h-11 place-items-center rounded-lg bg-emerald-700 px-4 font-medium text-white" to="/plants/new">Add plant</Link></section> : <div className="mt-6 grid gap-8">{groups.map((group) => <section key={group.id ?? 'none'}><h2 className="text-xl font-semibold">{group.name}</h2>{group.plants.length === 0 ? <p className="mt-3 rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-600">No active plants are unassigned.</p> : <ul className="mt-3 grid gap-3 sm:grid-cols-2">{group.plants.map((plant) => <li key={plant.id}><Link className="block min-h-24 rounded-xl border border-stone-200 bg-white p-4 hover:border-emerald-400" to={`/plants/${plant.id}`}><h3 className="font-semibold">{plant.nickname}</h3><p className="mt-2 text-sm text-stone-600">{plant.species.name}</p></Link></li>)}</ul>}</section>)}</div>}</PlantPageHeader>;
}
