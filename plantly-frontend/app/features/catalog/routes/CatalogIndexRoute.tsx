import type { Route } from "../../../../.react-router/types/app/features/catalog/routes/+types/CatalogIndexRoute";
import { getTokenFromRequest } from "~/auth/utils";
import { getAllSpecies } from "~/features/catalog/catalog.server";
import CatalogList from "~/features/catalog/components/CatalogList";

export async function loader({ params, request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const species = await getAllSpecies(token);

  return {
    species: species,
  };
}


export default function CatalogIndexRoute({loaderData}: Route.ComponentProps) {


  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='heading-xl mb-4'>Catalog</h1>
      <CatalogList species={loaderData.species} />
    </div>
  );
}