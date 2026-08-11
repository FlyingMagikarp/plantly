import { useLoaderData } from 'react-router-dom';
import type { HealthStatus } from './home-loader';

export function HomePage({ status }: HealthStatus) {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-24 text-stone-900">
      <section className="mx-auto max-w-2xl">
        <p className="mb-3 text-sm font-semibold tracking-wide text-emerald-700 uppercase">
          Plant care, simply
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Plantly</h1>
        <p className="mt-4 text-lg text-stone-600">
          The application foundation is ready.
        </p>
        <p
          className="mt-8 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800"
          role="status"
        >
          Backend: {status}
        </p>
        <nav className="mt-8 flex flex-wrap gap-3" aria-label="Application areas">
          <a
            className="block w-fit rounded-lg bg-emerald-700 px-4 py-3 font-medium text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            href="/species"
          >
            Browse species
          </a>
          <a
            className="block w-fit rounded-lg border border-stone-300 bg-white px-4 py-3 font-medium hover:border-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            href="/locations"
          >
            Manage locations
          </a>
        </nav>
      </section>
    </main>
  );
}

export function HomeRoute() {
  return <HomePage {...useLoaderData<HealthStatus>()} />;
}
