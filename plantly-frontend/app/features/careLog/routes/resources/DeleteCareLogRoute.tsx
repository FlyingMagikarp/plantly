import type {
  Route
} from "../../../../../.react-router/types/app/features/careLog/routes/resources/+types/DeleteCareLogRoute";
import {getTokenFromRequest} from "~/auth/utils";
import {dataWithError, dataWithSuccess} from "remix-toast";
import {deleteCareLog} from "~/features/careLog/careLog.server";

export async function action({params, request}: Route.ActionArgs) {
  const token = getTokenFromRequest(request);

  try {
    await deleteCareLog(parseInt(params.careLogId), token);
    //return redirectWithSuccess(`/plants/${params.plantId}`, 'Care Log removed!');
    return dataWithSuccess({ok: true}, 'Care Log removed!');
  } catch (error) {
    console.log(error);
    return dataWithError({ok: false}, 'Error occurred during deleting!');
  }
}