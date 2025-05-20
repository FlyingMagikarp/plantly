import type { Route } from "../../../../.react-router/types/app/features/location/routes/+types/LocationIndexRoute";
import LocationsForm from "~/features/location/components/LocationsForm";
import {getLocations} from "~/features/location/location.server";
import {getTokenFromRequest} from "~/auth/utils";

export async function loader({ request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const locations = await getLocations(token)

  return {locations: locations};
}


export default function LocationIndexRoute({loaderData} : Route.ComponentProps) {

  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='heading-xl mb-4'>Locations</h1>
      <LocationsForm locs={loaderData.locations ?? []}/>
    </div>
  );
}