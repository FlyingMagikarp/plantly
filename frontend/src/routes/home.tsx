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
      </section>
    </main>
  );
}

export function HomeRoute() {
  return <HomePage {...useLoaderData<HealthStatus>()} />;
}
