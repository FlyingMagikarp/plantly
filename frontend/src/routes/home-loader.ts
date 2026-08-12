import { plantCollectionLoader, type PlantCollectionData } from './plants-data';

export type HomeData = PlantCollectionData;

export async function homeLoader(): Promise<HomeData> {
  return plantCollectionLoader();
}
