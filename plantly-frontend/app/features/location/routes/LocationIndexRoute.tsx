import type { Route } from "../../../../.react-router/types/app/features/location/routes/+types/LocationIndexRoute";
import LocationsForm from "~/features/location/components/LocationsForm";

export async function loader({ params }: Route.LoaderArgs) {
  return null;
}
export async function action({ request }: Route.ActionArgs) {
}


export default function LocationIndexRoute() {


  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='text-2xl font-bold mb-4'>Locations</h1>
      <LocationsForm locs={[]}/>
    </div>
  );
}