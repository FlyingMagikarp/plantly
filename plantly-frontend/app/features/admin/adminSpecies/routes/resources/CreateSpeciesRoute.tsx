import type {
  Route
} from "../../../../../../.react-router/types/app/features/admin/adminSpecies/routes/resources/+types/CreateSpeciesRoute";
import AdminSpeciesNamesForm from "~/features/admin/adminSpecies/components/AdminSpeciesNamesForm";
import type { ISpeciesDtoData, ISpeciesOverviewDtoData } from "~/common/types/apiTypes";

export async function loader({ request }: Route.LoaderArgs) {
  //const token = getTokenFromRequest(request)
}

export async function action({ request }: Route.ActionArgs) {
}


export default function CreateSpeciesRoute({loaderData}: Route.ComponentProps) {
  const species = initEmptySpeciesObjects();

  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='text-2xl font-bold mb-4'>Add new</h1>
      <AdminSpeciesNamesForm species={species} speciesTranslations={[]} />
    </div>
  );
}

function initEmptySpeciesObjects() {
  const species: ISpeciesDtoData = {
    speciesId: -1,
    latinName: ''
  }

  return species;
}