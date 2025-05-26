import type { Route } from "../../../../.react-router/types/app/features/plants/routes/+types/PlantDetailRoute";
import { getPlant } from "~/features/plants/plants.server";
import { getTokenFromRequest } from "~/auth/utils";
import { getSpeciesCareTip } from "~/features/admin/adminSpecies/adminSpecies.server";
import { Link } from "react-router";
import { CatalogDetailView } from "~/features/catalog/routes/CatalogDetailRoute";
import type { IPlantDtoData } from "~/common/types/apiTypes";
import { Fragment } from "react";
import {getCareLogs, getDaysSinceLastCare} from "~/features/careLog/careLog.server";
import CareLogTable from "~/features/careLog/components/CareLogTable";

export async function loader({ params, request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const plant = await getPlant(parseInt(params.plantId), token);
  const careTip = await getSpeciesCareTip(plant.speciesId, token)
  const careLogs = await getCareLogs(parseInt(params.plantId), token, 0, 5);
  const daysSinceCare = await getDaysSinceLastCare(parseInt(params.plantId), token);

  return {
    plant: plant,
    careTip: careTip,
    careLogs: careLogs,
    daysSinceCare: daysSinceCare,
  };
}


export default function PlantDetailRoute({loaderData}: Route.ComponentProps) {

  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='heading-xl mb-4'>{loaderData.plant.nickname}</h1>
      <div className={'flex flex-row gap-2'}>
        <Link to={`edit`} className={'btn-primary'}>
          Edit Plant
        </Link>
        <Link to={`/care/${loaderData.plant.id}/add`} className={'btn-primary'}>
          Add Care Log
        </Link>
      </div>

      <div className={'pt-4'}>
        <div>
          <h2 className={'heading-lg'}>Plant Details</h2>
          <PlantDetailView plant={loaderData.plant} daysSinceCare={loaderData.daysSinceCare}/>
        </div>
        <div className={'pt-4'}>
          <h2 className={'heading-lg'}>Care Log</h2>
          <CareLogTable careLogs={loaderData.careLogs} />
        </div>
        <div className={'pt-4'}>
          <h2 className={'heading-lg'}>Care Tips</h2>
          <CatalogDetailView careTip={loaderData.careTip} />
        </div>
      </div>
    </div>
  );
}

function PlantDetailView({plant, daysSinceCare}: {plant: IPlantDtoData, daysSinceCare: number}){
  const items = [
    { label: 'Nickname', data: plant.nickname},
    { label: 'Species', data: plant.speciesLatinName},
    { label: 'Days since last Care', data: daysSinceCare},
    { label: 'Acquired', data: plant.acquiredAt},
    { label: 'Location', data: plant.locationName},
    { label: 'Check Frequency', data: plant.checkFreq},
    { label: 'Notes', data: plant.notes},
    { label: 'Removed', data: plant.removed},
    ...(plant.removed ? [
      { label: 'Removed Date', data: plant.inactiveDate },
      { label: 'Removed Reason', data: plant.inactiveReason },
      { label: 'Died', data: plant.died },
    ] : [])
  ];

  return (
    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 items-start">
      {items.map(({ label, data }) => (
        <Fragment key={label}>
          <span className="subheading">{label}:</span>
          {typeof data === 'string' || typeof data === 'number' ? (
            <span className="info-text pt-1">{data}</span>
          ) : (
            <span className="info-text pt-1">
              <input
                type="checkbox"
                checked={data}
                readOnly
                disabled
                className="h-5 w-5 border rounded"
              />
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
