import type {Route} from "../../../../.react-router/types/app/features/careLog/routes/+types/AddCareLogRoute";
import {getTokenFromRequest} from "~/auth/utils";
import {getPlant} from "~/features/plants/plants.server";
import CareLogForm from "~/features/careLog/components/CareLogForm";
import type { ICareLogDtoData, IPlantDtoData } from "~/common/types/apiTypes";
import {formatDateToISO} from "~/common/utils/dateUtil";


export async function loader({ params, request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const plant = await getPlant(parseInt(params.plantId), token);

  return {
     plant: plant,
   };
}

export default function AddCareLogRoute({loaderData}: Route.ComponentProps) {
  const careLog = initEmptyCareLogObject(loaderData.plant);
  return (
      <div className='p-4 md:p-8 bg-background text-foreground'>
        <h1 className='heading-xl mb-4'>Add Care Log - {loaderData.plant.nickname}</h1>
        <CareLogForm careLog={careLog} />
      </div>
  );
}

function initEmptyCareLogObject(plant: IPlantDtoData) {
  const careLog: ICareLogDtoData = {
    id: -1,
    plantId: plant.id,
    eventDate: formatDateToISO(new Date()),
    notes: '',
    eventType: 'checking',
    plantLocation: plant.locationName,
    plantNickname: plant.nickname,
    plantSpecies: plant.speciesLatinName,
  }

  return careLog;
}