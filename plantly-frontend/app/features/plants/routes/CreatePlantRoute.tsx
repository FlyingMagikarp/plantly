import type {Route} from "../../../../.react-router/types/app/features/plants/routes/+types/CreatePlantRoute";
import PlantForm from "~/features/plants/components/PlantForm";
import type {IPlantDtoData} from "~/common/types/apiTypes";
import {getTokenFromRequest} from "~/auth/utils";
import {getAllSpecies} from "~/features/admin/adminSpecies/adminSpecies.server";
import {getLocations} from "~/features/location/location.server";
import { formatDateToISO } from "~/common/utils/dateUtil";


export async function loader({ request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const species = await getAllSpecies(token);
  const locations = await getLocations(token);

  return {
    species: species,
    locations: locations,
  }
}

export default function CreatePlantRoute({loaderData}: Route.ComponentProps) {
  const plant = initEmptyPlantObject();
  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='heading-xl mb-4'>Add New Plant</h1>
      <PlantForm plant={plant} species={loaderData.species} locations={loaderData.locations}/>
    </div>
  );
}

function initEmptyPlantObject() {
  const plant: IPlantDtoData = {
    id: -1,
    speciesId: -1,
    speciesLatinName: '',
    nickname: '',
    acquiredAt: formatDateToISO(new Date()),
    locationId: -1,
    locationName: '',
    notes: '',
    removed: false,
    died: false,
    inactiveReason: '',
    inactiveDate: formatDateToISO(new Date()),
    checkFreq: 7,
  }

  return plant;
}