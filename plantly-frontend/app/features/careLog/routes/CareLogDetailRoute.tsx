import type {Route} from "../../../../.react-router/types/app/features/careLog/routes/+types/CareLogDetailRoute";
import {getTokenFromRequest} from "~/auth/utils";
import {getPlant} from "~/features/plants/plants.server";
import {getCareLog} from "~/features/careLog/careLog.server";
import {Separator} from "@radix-ui/themes";


export async function loader({params, request}: Route.LoaderArgs) {
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

        <div className={'flex flex-col gap-0 mb-4'}>
          <span className="subheading">{loaderData.careLog.plantNickname} - {loaderData.careLog.plantSpecies}</span>
          <span className="caption-large">{loaderData.careLog.plantLocation}</span>
        </div>

        <Separator className={'mt-5 mb-5'}/>

        <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 items-start">
          <span className="subheading">{'Event Date'}:</span>
          <span className="info-text pt-1">{loaderData.careLog.eventDate}</span>

          <span className="subheading">{'Event Type'}:</span>
          <span className="info-text pt-1">{loaderData.careLog.eventType}</span>

          <span className="subheading">{'Notes'}:</span>
          <span className="info-text pt-1">{loaderData.careLog.notes}</span>
        </div>
      </div>
  );
}