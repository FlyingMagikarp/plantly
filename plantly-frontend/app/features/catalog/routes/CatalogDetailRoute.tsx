import type { Route } from "../../../../.react-router/types/app/features/catalog/routes/+types/CatalogDetailRoute";
import { getTokenFromRequest } from "~/auth/utils";
import {
  getSpecies,
  getSpeciesCareTip,
  getSpeciesTranslations
} from "~/features/admin/adminSpecies/adminSpecies.server";
import type { ICareTipDtoData, ISpeciesDtoData, ISpeciesOverviewDtoData } from "~/common/types/apiTypes";
import { CollapsibleCard } from "~/common/components/CollapsibleCard";

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


export default function CatalogDetailRoute({loaderData}: Route.ComponentProps) {
  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='heading-xl mb-4'>{loaderData.speciesOverview.latinName}</h1>
      <CatalogDetailView species={loaderData.speciesOverview} speciesTranslations={loaderData.speciesTranslations} careTip={loaderData.careTip}/>
    </div>
  );
}

function CatalogDetailView({
  species,
  speciesTranslations,
  careTip
} : {
  species: ISpeciesDtoData,
  speciesTranslations: ISpeciesOverviewDtoData[],
  careTip: ICareTipDtoData
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 pt-5">
      <CollapsibleCard header="💧 Watering" defaultOpen={true}>
        <p>Water when the top 2–3 cm of soil is dry. Avoid overwatering during winter.</p>
      </CollapsibleCard>
      <CollapsibleCard header="💧 Watering" defaultOpen={true}>
        <p>Water when the top 2–3 cm of soil is dry. Avoid overwatering during winter.</p>
      </CollapsibleCard>
      <CollapsibleCard header="💧 Watering" defaultOpen={true}>
        <p>Water when the top 2–3 cm of soil is dry. Avoid overwatering during winter.</p>
      </CollapsibleCard>
      <CollapsibleCard header="💧 Watering" defaultOpen={true}>
        <p>Water when the top 2–3 cm of soil is dry. Avoid overwatering during winter.</p>
      </CollapsibleCard>
      <CollapsibleCard header="💧 Watering" defaultOpen={true}>
        <p>Water when the top 2–3 cm of soil is dry. Avoid overwatering during winter.</p>
      </CollapsibleCard>
    </div>
  );
}