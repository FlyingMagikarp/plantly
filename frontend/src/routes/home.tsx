import { useLoaderData } from 'react-router-dom';
import type { HealthStatus } from './home-loader';

export function HomePage({ status }: HealthStatus) {
  return (
    <main>
      <h1>Plantly</h1>
      <p>The application foundation is ready.</p>
      <p role="status">Backend: {status}</p>
    </main>
  );
}

export function HomeRoute() {
  return <HomePage {...useLoaderData<HealthStatus>()} />;
}
