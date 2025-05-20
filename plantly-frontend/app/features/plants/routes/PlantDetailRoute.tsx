import type { Route } from "../../../../.react-router/types/app/features/plants/routes/+types/PlantDetailRoute";
import { getPlant } from "~/features/plants/plants.server";
import { getTokenFromRequest } from "~/auth/utils";
import { getAllSpecies } from "~/features/admin/adminSpecies/adminSpecies.server";
import { getLocations } from "~/features/location/location.server";
import PlantForm from "~/features/plants/components/PlantForm";

export async function loader({ params, request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const plant = await getPlant(parseInt(params.plantId), token);
  const species = await getAllSpecies(token);
  const locations = await getLocations(token);

  return {
    plant: plant,
    species: species,
    locations: locations,
  };
}


export default function PlantDetailRoute({loaderData}: Route.ComponentProps) {


  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='heading-xl mb-4'>{loaderData.plant.nickname}</h1>
      {loaderData.plant.id}
      {loaderData.plant.speciesLatinName}
      <PlantForm plant={loaderData.plant} species={loaderData.species} locations={loaderData.locations} />
    </div>
  );
}