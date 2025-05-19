import type { Route } from "../resources/+types/UpdatePlantRoute";
import {getTokenFromRequest} from "~/auth/utils";
import {parseWithZod} from "@conform-to/zod";
import {dataWithError, dataWithSuccess} from "remix-toast";
import {updatePlantSchema} from "~/features/plants/schemas/updatePlantSchema";

export async function action({params, request}: Route.ActionArgs) {
  const token = getTokenFromRequest(request);
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: updatePlantSchema,
  });

  if (submission.status !== 'success') {
    console.log(submission.reply());
    return submission.reply();
  }

  const data = submission.value;
  const plant: IPlantDtoData = {

  }
  try {
    // await server action
    return dataWithSuccess({ok:true}, 'Data saved!');
  } catch (error) {
    console.log(error);
    return dataWithError({ok:false}, 'Error occurred during saving!');
  }

}