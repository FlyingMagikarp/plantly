import type { Route } from "./+types/AdminSpeciesDetailRoute";
import { getTokenFromRequest } from "~/auth/utils";
import {
  getSpecies,
  getSpeciesCareTip,
  getSpeciesTranslations
} from "~/features/admin/adminSpecies/adminSpecies.server";

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
export async function action({ request }: Route.ActionArgs) {
}


export default function AdminSpeciesDetailRoute({loaderData}: Route.ComponentProps) {
  const species = loaderData.speciesOverview;
  const speciesTranslations = loaderData.speciesTranslations;
  const careTip = loaderData.careTip;

  console.log(species)
  console.log(speciesTranslations)
  console.log(careTip)

  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='text-2xl font-bold mb-4'>{species.latinName}</h1>
      <ul>
        <li>{species.speciesId}</li>
        <li>{species.latinName}</li>
      </ul>
    </div>
  );
}