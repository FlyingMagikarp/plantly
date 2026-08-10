export interface HealthStatus {
  status: string;
}

export async function homeLoader(): Promise<HealthStatus> {
  const response = await fetch('/api/health');

  if (!response.ok) {
    throw new Response('Backend health check failed', { status: response.status });
  }

  return response.json() as Promise<HealthStatus>;
}
