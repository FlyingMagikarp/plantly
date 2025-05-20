import type { Route } from "../../../../.react-router/types/app/features/plants/routes/+types/PlantsIndexRoute";
import {Link} from "react-router";
import { getPlants } from "~/features/plants/plants.server";
import { getTokenFromRequest } from "~/auth/utils";
import PlantIndexList from "~/features/plants/components/PlantIndexList";

export async function loader({ request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const plants = await getPlants(token);

  return {plants: plants};
}


export default function PlantsIndexRoute({loaderData} : Route.ComponentProps) {

  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='heading-xl mb-4'>My Plants</h1>
      <Link to='/plants/create' className={'btn-primary'}>Add new</Link>
      <div>
        <PlantIndexList plants={loaderData.plants} />
      </div>
    </div>
  );
}