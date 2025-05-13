import type {
  Route
} from "../../../../../../.react-router/types/app/features/admin/adminSpecies/routes/resources/+types/DeleteSpeciesRoute";
import {getTokenFromRequest} from "~/auth/utils";
import {deleteSpecies} from "~/features/admin/adminSpecies/adminSpecies.server";
import {dataWithError, redirectWithSuccess} from "remix-toast";

export async function action({ request, params }: Route.ActionArgs) {
  const token = getTokenFromRequest(request);
  const speciesId = params.speciesId;

  try {
    await deleteSpecies(parseInt(speciesId ?? '0'), token)
    return redirectWithSuccess('/admin/species', 'Species removed!');
  } catch (e) {
    console.error(e);
    return dataWithError({ok: false}, 'Failed to delete Species!')
  }
}
