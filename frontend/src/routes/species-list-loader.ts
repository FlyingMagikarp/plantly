export interface SpeciesOverviewItem {
  id: number;
  name: string;
  archived: boolean;
  plantCount: number;
}

export async function speciesListLoader(): Promise<SpeciesOverviewItem[]> {
  const response = await fetch('/api/species');

  if (!response.ok) {
    throw new Response('Species overview unavailable', {
      status: response.status,
    });
  }

  return response.json() as Promise<SpeciesOverviewItem[]>;
}
