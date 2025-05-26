import type { Route } from "../resources/+types/DeletePlantRoute";
import {getTokenFromRequest} from "~/auth/utils";
import { dataWithError, redirectWithSuccess } from "remix-toast";
import { deletePlant } from "~/features/plants/plants.server";

export async function action({params, request}: Route.ActionArgs) {
  const token = getTokenFromRequest(request);

  try {
    await deletePlant(parseInt(params.plantId), token);
    return redirectWithSuccess('/plants', 'Plant deleted!');
  } catch (error) {
    console.log(error);
    return dataWithError({ok:false}, 'Error occurred during deleting!');
  }

}