import type { Route } from "../../../../.react-router/types/app/features/plants/routes/+types/PlantDetailRoute";
import { getPlant } from "~/features/plants/plants.server";
import { getTokenFromRequest } from "~/auth/utils";

export async function loader({ params, request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const plant = await getPlant(parseInt(params.plantId), token);

  return {plant: plant};
}
export async function action({ request }: Route.ActionArgs) {
}


export default function PlantDetailRoute({loaderData}: Route.ComponentProps) {


  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='text-2xl font-bold mb-4'>My Plants</h1>
      {loaderData.plant.id}
      {loaderData.plant.speciesLatinName}
    </div>
  );
}