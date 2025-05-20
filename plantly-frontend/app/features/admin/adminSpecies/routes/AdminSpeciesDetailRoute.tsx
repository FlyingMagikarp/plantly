import type { Route } from "./+types/AdminSpeciesDetailRoute";
import { getTokenFromRequest } from "~/auth/utils";
import {
  getSpecies,
  getSpeciesCareTip,
  getSpeciesTranslations
} from "~/features/admin/adminSpecies/adminSpecies.server";
import type {ICareTipDtoData, ISpeciesDtoData, ISpeciesOverviewDtoData} from "~/common/types/apiTypes";
import AdminSpeciesNamesForm from "~/features/admin/adminSpecies/components/AdminSpeciesNamesForm";
import AdminSpeciesCareTipForm from "~/features/admin/adminSpecies/components/AdminSpeciesCareTipForm";
import {Separator} from "@radix-ui/themes";

export async function loader({ params, request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request)
  const species = await getSpecies(parseInt(params.speciesId), token)
  const speciesTranslations = await getSpeciesTranslations(parseInt(params.speciesId), token)
  const careTip = await getSpeciesCareTip(parseInt(params.speciesId), token)

  return {
    speciesOverview: species,
    speciesTranslations: speciesTranslations,
    careTip: careTip,
  };
}


export default function AdminSpeciesDetailRoute({loaderData}: Route.ComponentProps) {
  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='heading-xl mb-4'>{loaderData.speciesOverview.latinName}</h1>
      <AdminSpeciesDetailView species={loaderData.speciesOverview} speciesTranslations={loaderData.speciesTranslations} careTip={loaderData.careTip} />
    </div>
  );
}

function AdminSpeciesDetailView({
  species,
  speciesTranslations,
  careTip
} : {
  species: ISpeciesDtoData,
  speciesTranslations: ISpeciesOverviewDtoData[],
  careTip: ICareTipDtoData
}) {

  return (
    <div>
      <AdminSpeciesNamesForm species={species} speciesTranslations={speciesTranslations} />
      <Separator className={'mt-5 mb-5'} />
      <AdminSpeciesCareTipForm species={species} careTip={careTip} />
    </div>
  );
}