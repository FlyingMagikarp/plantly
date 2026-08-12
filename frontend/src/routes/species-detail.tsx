import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRevalidator,
  useRouteError,
} from 'react-router-dom';
import type { SpeciesDetail } from './species-detail-loader';
import { BackLink, ErrorState, Page } from '../components/ui';

export function SpeciesDetailRoute() {
  const species = useLoaderData<SpeciesDetail>();

  return (
    <Page width="reading">
      <article>
        <BackLink to="/species">Species</BackLink>
        <header className="mt-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="page-title">{species.name}</h1>
            {species.archived && (
              <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold text-stone-700">
                Archived
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-stone-600">
            Permanent identifier SP-{species.id.toString().padStart(3, '0')}
          </p>
        </header>

        <DetailSection title="Care">
          <DetailRow label="Moisture" value={labelValue(species.moisture)} />
          <DetailRow label="Light" value={labelValue(species.light)} />
          <DetailRow
            label="Preferred temperature"
            value={`${species.preferredTemperatureMin}–${species.preferredTemperatureMax} °C`}
          />
          <DetailRow label="Minimum temperature" value={`${species.minimumTemperature} °C`} />
        </DetailSection>

        <DetailSection title="Seasonal periods">
          <DetailRow label="Growth" value={labelValue(species.growthPeriod)} />
          <DetailRow label="Bloom" value={labelValue(species.bloomPeriod)} />
          <DetailRow label="Dormancy" value={labelValue(species.dormancyPeriod)} />
        </DetailSection>

        <DetailSection title="Fertilizer guidance">
          <DetailRow label="Growth" value={labelValue(species.growthFertilizer)} />
          <DetailRow label="Bloom" value={labelValue(species.bloomFertilizer)} />
          <DetailRow label="Dormancy" value={labelValue(species.dormancyFertilizer)} />
        </DetailSection>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Notes</h2>
          {species.notes.length === 0 ? (
            <p className="mt-3 text-stone-600">No notes are defined for this species.</p>
          ) : (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-700">
              {species.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </section>

        {species.plants.length > 0 && (
          <section className="mt-8 border-t border-stone-200 pt-8">
            <h2 className="text-xl font-semibold">Plants</h2>
            <ul className="mt-3 grid gap-2">
              {species.plants.map((plant) => (
                <li key={plant.id}>
                  <Link
                    className="block min-h-11 rounded-lg border border-stone-200 bg-white px-4 py-3 font-medium hover:border-emerald-400"
                    to={`/plants/${plant.id}`}
                  >
                    {plant.nickname}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </Page>
  );
}

export function SpeciesDetailError() {
  const error = useRouteError();
  const revalidator = useRevalidator();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <ErrorState title={notFound ? 'Species not found' : 'Species could not be loaded'} description={notFound
            ? 'This species is no longer available.'
            : 'The species detail is unavailable. Please try again.'} action={notFound ? (
          <Link className="text-link" to="/species">
            Return to species
          </Link>
        ) : (
          <button
            className="btn-primary"
            disabled={revalidator.state !== 'idle'}
            onClick={() => revalidator.revalidate()}
            type="button"
          >
            {revalidator.state === 'idle' ? 'Try again' : 'Trying again…'}
          </button>
        )} />
  );
}

function DetailSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">{title}</h2>
      <dl className="card mt-3 divide-y divide-neutral-200 px-4 sm:px-5">
        {children}
      </dl>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 py-3">
      <dt className="text-sm text-stone-600">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function labelValue(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
