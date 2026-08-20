import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { EmptyState, Page, PageHeader } from '../components/ui';
import type { HomeData } from './home-loader';

export function HomePage({ plants = [], locations = [], status }: Partial<HomeData> & { status?: string }) {
  if (status !== undefined && plants.length === 0 && locations.length === 0) {
    return <p className="badge badge-active" role="status">Backend: {status}</p>;
  }
  const active = plants.filter((plant) => plant.status === 'active');
  const groups = [
    { id: null, name: 'No location', plants: active.filter((plant) => plant.location === null) },
    ...locations.map((location) => ({ id: location.id, name: location.name, plants: active.filter((plant) => plant.location?.id === location.id) })).filter((group) => group.plants.length > 0),
  ];
  return (
    <Page><PageHeader action={<Link className="btn-secondary" to="/care-round">Start care round</Link>} eyebrow="Today’s collection" title="Home" description="Active plants grouped by where they live." />
      {status && <p className="mt-6 badge badge-active" role="status">Backend: {status}</p>}
      {active.length === 0 ? <EmptyState title="No active plants" description="Add a plant to start your location overview." action={<Link className="btn-primary" to="/plants/new">Add plant</Link>} /> : (
        <div className="mt-8 grid gap-8">{groups.map((group) => <section key={group.id ?? 'none'}><div className="flex items-baseline justify-between gap-3"><h2 className="text-xl font-bold text-neutral-900">{group.name}</h2><span className="text-sm text-neutral-500">{group.plants.length} {group.plants.length === 1 ? 'plant' : 'plants'}</span></div>{group.plants.length === 0 ? <p className="mt-3 rounded-xl border border-dashed border-neutral-300 bg-white/60 p-4 text-sm text-neutral-600">No active plants are unassigned.</p> : <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{group.plants.map((plant) => <li key={plant.id}><Link className="interactive-card min-h-28 overflow-hidden" to={`/plants/${plant.id}`}><LatestPlantImage nickname={plant.nickname} url={plant.latestImageUrl} /><div className="p-4 sm:p-5"><h3 className="text-lg font-bold text-neutral-900">{plant.nickname}</h3><p className="mt-2 text-sm text-neutral-600">{plant.species.name}</p><p className="mt-3 text-sm text-neutral-600">{plant.latestCareTimestamp ? <>Last care <time dateTime={plant.latestCareTimestamp}>{new Date(plant.latestCareTimestamp).toLocaleDateString()}</time></> : 'No CareLog yet'}</p><span className="mt-5 inline-flex text-sm font-semibold text-green-700">View plant <span aria-hidden="true" className="ml-1">→</span></span></div></Link></li>)}</ul>}</section>)}</div>
      )}
    </Page>
  );
}

function LatestPlantImage({ nickname, url }: { nickname: string; url?: string | null }) {
  const [unavailable, setUnavailable] = useState(false);
  return url && !unavailable
    ? <img alt={`Latest image of ${nickname}`} className="aspect-[4/3] w-full object-cover" onError={() => setUnavailable(true)} src={url} />
    : null;
}

export function HomeRoute() {
  return <HomePage {...useLoaderData<HomeData>()} />;
}
