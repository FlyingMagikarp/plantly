import type {Route} from "../../../../.react-router/types/app/features/location/routes/+types/LocationIndexRoute";
import {getTokenFromRequest} from "~/auth/utils";
import {getLocations} from "~/features/quickLog/quickLog.server";


export async function loader({request}: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const locations = await getLocations(token);

  return {locations: locations};
}


export default function LocationIndexRoute({loaderData}: Route.ComponentProps) {

  return (
      <div className='p-4 md:p-8 bg-background text-foreground'>
        <h1 className='heading-xl mb-4'>Quick Log</h1>
        {loaderData.locations.length > 0 &&
            <div>
                <button className={'btn-primary'}>Start full Log</button>
                <div>
                    <span className={'font-semibold pt-1 w-1/4'}>Location</span>
                    <select
                        name={'location'}
                        defaultValue={loaderData.locations[0].id}
                        className="border rounded p-2"
                    >
                      {loaderData.locations.map((l) => {
                            return (
                                <option value={l.id} key={l.id}>{l.name}</option>
                            );
                          }
                      )}
                    </select>
                    <button className={'btn-primary'}>Start partial Log</button>
                </div>
            </div>
        }
      </div>
  );
}