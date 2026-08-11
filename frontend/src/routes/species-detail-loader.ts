interface SpeciesPlantSummary {
  id: number;
  nickname: string;
}

export interface SpeciesDetail {
  id: number;
  name: string;
  archived: boolean;
  moisture: string;
  light: string;
  preferredTemperatureMin: number;
  preferredTemperatureMax: number;
  minimumTemperature: number;
  growthPeriod: string;
  bloomPeriod: string;
  dormancyPeriod: string;
  growthFertilizer: string;
  bloomFertilizer: string;
  dormancyFertilizer: string;
  notes: string[];
  plants: SpeciesPlantSummary[];
}

export async function speciesDetailLoader({
  params,
}: {
  params: { speciesId?: string };
}): Promise<SpeciesDetail> {
  const response = await fetch(`/api/species/${encodeURIComponent(params.speciesId ?? '')}`);

  if (!response.ok) {
    throw new Response(
      response.status === 404 ? 'Species not found' : 'Species detail unavailable',
      { status: response.status },
    );
  }

  return response.json() as Promise<SpeciesDetail>;
}
