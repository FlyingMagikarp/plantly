import {
  Link,
  isRouteErrorResponse,
  useRevalidator,
  useRouteError,
} from 'react-router-dom';

export function PlantsError({ area = 'collection' }: { area?: 'collection' | 'detail' | 'form' | 'locations' }) {
  const error = useRouteError();
  const revalidator = useRevalidator();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const unavailable = area === 'detail' ? 'plant detail' : area === 'locations' ? 'plants' : area;

  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-6 text-stone-900">
      <section className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">
          {notFound ? 'Plant not found' : `${capitalize(unavailable)} could not be loaded`}
        </h1>
        <p className="mt-3 text-stone-600">
          {notFound
            ? 'This plant is no longer available.'
            : `The ${unavailable} is unavailable. Please try again.`}
        </p>
        {notFound ? (
          <Link className="mt-6 inline-block font-medium text-emerald-700 hover:underline" to="/plants">
            Return to collection
          </Link>
        ) : (
          <button
            className="mt-6 min-h-11 rounded-lg bg-emerald-700 px-4 font-medium text-white hover:bg-emerald-800"
            disabled={revalidator.state !== 'idle'}
            onClick={() => revalidator.revalidate()}
            type="button"
          >
            {revalidator.state === 'idle' ? 'Try again' : 'Trying again…'}
          </button>
        )}
      </section>
    </main>
  );
}

export function PlantPageHeader({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 text-stone-900 sm:px-6">
      <section className="mx-auto max-w-4xl">{children}</section>
    </main>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
