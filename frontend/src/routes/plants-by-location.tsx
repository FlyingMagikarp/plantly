import { Link, useLoaderData } from 'react-router-dom';
import type { PlantCollectionData } from './plants-data';
import { PlantPageHeader } from './plants-common';

/** Retained for the historical UC-013 test boundary. This route is no longer served. */
export function PlantsByLocationRoute() {
  const { plants, locations } = useLoaderData<PlantCollectionData>();
  const active = plants.filter((plant) => plant.status === 'active');
  const groups = [
    { id: null, name: 'No location', plants: active.filter((plant) => plant.location === null) },
    ...locations.map((location) => ({ id: location.id, name: location.name, plants: active.filter((plant) => plant.location?.id === location.id) })).filter((group) => group.plants.length > 0),
  ];
  return <PlantPageHeader><Link className="back-link" to="/plants">← My plants</Link><header className="mt-5"><p className="eyebrow">Plant collection</p><h1 className="page-title">Plants by location</h1></header>{active.length === 0 ? <section className="empty-state"><h2 className="font-semibold">No active plants</h2><p className="mt-2 text-sm text-neutral-600">Add a plant to see it grouped by location.</p><Link className="btn-primary mt-5" to="/plants/new">Add plant</Link></section> : <div className="mt-6 grid gap-8">{groups.map((group) => <section key={group.id ?? 'none'}><h2 className="text-xl font-semibold">{group.name}</h2>{group.plants.length === 0 ? <p className="mt-3 rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No active plants are unassigned.</p> : <ul className="mt-3 grid gap-3 sm:grid-cols-2">{group.plants.map((plant) => <li key={plant.id}><Link className="interactive-card min-h-24 p-4" to={`/plants/${plant.id}`}><h3 className="font-semibold">{plant.nickname}</h3><p className="mt-2 text-sm text-neutral-600">{plant.species.name}</p></Link></li>)}</ul>}</section>)}</div>}</PlantPageHeader>;
}
