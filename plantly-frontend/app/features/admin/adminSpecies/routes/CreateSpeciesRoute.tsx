import AdminSpeciesNamesForm from "~/features/admin/adminSpecies/components/AdminSpeciesNamesForm";
import type { ISpeciesDtoData } from "~/common/types/apiTypes";


export default function CreateSpeciesRoute() {
  const species = initEmptySpeciesObjects();

  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='heading-xl mb-4'>Add new</h1>
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