import type { Route } from "../../../../.react-router/types/app/features/myplants/routes/+types/MyplantsIndexRoute";
import {Link} from "react-router";
import { getPlants } from "~/features/myplants/myPlants.server";
import { getTokenFromRequest } from "~/auth/utils";

export async function loader({ request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const plants = await getPlants(token);

  return {plants: plants};
}
export async function action({ request }: Route.ActionArgs) {
}


export default function MyplantsIndexRoute() {


  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='text-2xl font-bold mb-4'>My Plants</h1>
      <Link to='/myplants/create' className={'btn-primary'}>Add new</Link>

    </div>
  );
}