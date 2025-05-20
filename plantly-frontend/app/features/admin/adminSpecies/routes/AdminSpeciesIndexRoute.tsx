import type { Route } from "./+types/AdminSpeciesIndexRoute";
import { getTokenFromRequest } from "~/auth/utils";
import { getAllSpecies } from "~/features/admin/adminSpecies/adminSpecies.server";
import AdminSpeciesList from "~/features/admin/adminSpecies/components/AdminSpeciesList";
import { Link } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request)
  const species = await getAllSpecies(token);

  return {species: species};
}


export default function AdminSpeciesIndexRoute({loaderData}: Route.ComponentProps) {

  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='heading-xl mb-4'>Admin Species</h1>
      <Link to='/admin/species/create' className={'btn-primary'}>Add new</Link>
      <div className={'mt-2'}>
        <AdminSpeciesList species={loaderData.species} />
      </div>
    </div>
  );
}