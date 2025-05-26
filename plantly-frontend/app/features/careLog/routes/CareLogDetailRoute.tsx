import type {Route} from "../../../../.react-router/types/app/features/careLog/routes/+types/CareLogDetailRoute";
import {getTokenFromRequest} from "~/auth/utils";
import {getPlant} from "~/features/plants/plants.server";
import {getCareLog} from "~/features/careLog/careLog.server";
import CareLogForm from "~/features/careLog/components/CareLogForm";


export async function loader({ params, request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const plant = await getPlant(parseInt(params.plantId), token);
  const careLog = await getCareLog(parseInt(params.careLogId), token);

  return {
     plant: plant,
     careLog: careLog,
   };
}

export default function CareLogDetailRoute({loaderData}: Route.ComponentProps) {

  return (
      <div className='p-4 md:p-8 bg-background text-foreground'>
        <h1 className='heading-xl mb-4'>Care Log - {loaderData.careLog.eventDate} - {loaderData.plant.nickname}</h1>
        <CareLogForm careLog={loaderData.careLog} />
      </div>
  );
}