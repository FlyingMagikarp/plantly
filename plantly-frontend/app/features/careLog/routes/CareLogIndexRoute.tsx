import type {Route} from "../../../../.react-router/types/app/features/careLog/routes/+types/CareLogIndexRoute";
import {getTokenFromRequest} from "~/auth/utils";
import {getPlant} from "~/features/plants/plants.server";
import {getCareLogs} from "~/features/careLog/careLog.server";


export async function loader({ params, request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const plant = await getPlant(parseInt(params.plantId), token);
  const careLogs = await getCareLogs(parseInt(params.plantId), token, 0, 5);

  return {
     plant: plant,
     careLogs: careLogs,
   };
}

export default function CareLogIndexRoute({loaderData}: Route.ComponentProps) {

  return (
      <div className='p-4 md:p-8 bg-background text-foreground'>
        <h1 className='heading-xl mb-4'>Care Logs - {loaderData.plant.nickname}</h1>
      </div>
  );
}