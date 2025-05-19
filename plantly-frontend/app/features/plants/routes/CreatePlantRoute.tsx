import type {Route} from "../../../../.react-router/types/app/features/plants/routes/+types/CreatePlantRoute";
import PlantForm from "~/features/plants/components/PlantForm";
import type {IPlantDtoData} from "~/common/types/apiTypes";
import {getTokenFromRequest} from "~/auth/utils";
import {getAllSpecies} from "~/features/admin/adminSpecies/adminSpecies.server";
import {getLocations} from "~/features/location/location.server";


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
    <div>
      NEW
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
    acquiredAt: new Date(),
    locationId: -1,
    locationName: '',
    notes: '',
    removed: false,
    died: false,
    inactiveReason: '',
    inactiveDate: new Date(),
    checkFreq: 7,
  }

  return plant;
}