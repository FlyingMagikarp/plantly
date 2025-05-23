import type { Route } from "../../../../.react-router/types/app/features/catalog/routes/+types/CatalogDetailRoute";
import { getTokenFromRequest } from "~/auth/utils";
import {
  getSpecies,
  getSpeciesCareTip,
  getSpeciesTranslations
} from "~/features/admin/adminSpecies/adminSpecies.server";
import type { ICareTipDtoData, ISpeciesDtoData, ISpeciesOverviewDtoData } from "~/common/types/apiTypes";
import { CollapsibleCard } from "~/common/components/CollapsibleCard";
import { mapMonthArrayToString, mapMonthToString, mapPlacementEnumToString } from "~/common/utils/enumUtil";

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
      <CollapsibleCard header="☀️ Light & Temperature" defaultOpen={true}>
        <InfoDisplay label={'Placement'} data={mapPlacementEnumToString(careTip.placement)}/>
        <InfoDisplay label={'Winter Hardy'} data={careTip.winterHardy}/>
        <InfoDisplay label={'Temperatures'} data={careTip.optimalTempMinC+'° <--> '+careTip.optimalTempMaxC+'°'}/>
      </CollapsibleCard>
      <CollapsibleCard header="💧 Watering" defaultOpen={true}>
        <InfoDisplay label={'Watering Frequency'} data={careTip.wateringFrequencyDays}/>
        <InfoDisplay label={'Watering Notes'} data={careTip.wateringNotes}/>
      </CollapsibleCard>
      <CollapsibleCard header="🌿 Fertilizing" defaultOpen={true}>
        <InfoDisplay label={'Fertilizing Frequency'} data={careTip.fertilizingFrequencyDays}/>
        <InfoDisplay label={'Fertilizer Type'} data={careTip.fertilizingType}/>
        <InfoDisplay label={'Fertilizing Notes'} data={careTip.fertilizingNotes}/>
      </CollapsibleCard>
      <CollapsibleCard header="✂️ Maintenance & Soil" defaultOpen={true}>
        <InfoDisplay label={'Soil'} data={careTip.soil}/>
        <InfoDisplay label={'Repotting Cycle'} data={careTip.repottingCycleMonths}/>
        <InfoDisplay label={'Pests'} data={careTip.pests}/>
        <InfoDisplay label={'Pruning Months'} data={mapMonthArrayToString(careTip.pruningMonths)}/>
        <InfoDisplay label={'Pruning Notes'} data={careTip.pruningNotes}/>
        <InfoDisplay label={'Propagation Months'} data={mapMonthArrayToString(careTip.propagationMonths)}/>
        <InfoDisplay label={'Propagation Notes'} data={careTip.propagationNotes}/>
        <InfoDisplay label={'Wiring Months'} data={mapMonthArrayToString(careTip.wiringMonths)}/>
        <InfoDisplay label={'Wiring Notes'} data={careTip.wiringNotes}/>
      </CollapsibleCard>
      <CollapsibleCard header="☀️ Seasonal Cycles" defaultOpen={true}>
        <InfoDisplay label={'Growing Season'} data={mapMonthToString(careTip.growingSeasonStart) + ' - ' + mapMonthToString(careTip.growingSeasonEnd)}/>
        <InfoDisplay label={'Dormant Season'} data={mapMonthToString(careTip.dormantSeasonStart) + ' - ' + mapMonthToString(careTip.dormantSeasonEnd)}/>
      </CollapsibleCard>
      <CollapsibleCard header="📝 Notes" defaultOpen={true}>
        <InfoDisplay label={''} data={careTip.notes}/>
      </CollapsibleCard>
    </div>
  );
}

function InfoDisplay({label, data}: {label: string, data: string | number | boolean}) {

  return (
    <div className={'flex flex-row justify-start'}>
      <span className={'subheading'}>{label}:</span>
      {(typeof data === 'string' || typeof data === 'number') &&
          <span className={'info-text pt-1 pl-5'}>{data}</span>
      }
      {typeof data === 'boolean' &&
          <span className={'info-text pt-1 pl-5'}>
            <input
                type={'checkbox'}
                checked={true}
                readOnly={true}
                disabled={true}
                className="h-5 w-5 border rounded ml-3"
            />
          </span>
      }
    </div>
  );
}