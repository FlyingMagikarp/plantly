import type { Route } from "../resources/+types/UpdatePlantRoute";
import {getTokenFromRequest} from "~/auth/utils";
import {parseWithZod} from "@conform-to/zod";
import {dataWithError, dataWithSuccess} from "remix-toast";
import {updatePlantSchema} from "~/features/plants/schemas/updatePlantSchema";
import type { IPlantDtoData } from "~/common/types/apiTypes";
import { updatePlant } from "~/features/plants/myPlants.server";

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
    id: parseInt(data.id),
    speciesId: data.speciesId,
    speciesLatinName: '',
    nickname: data.nickname ?? '',
    acquiredAt: data.acquiredAt ?? new Date(),
    locationId: data.locationId,
    locationName: '',
    notes: data.notes ?? '',
    removed: !!data.removed,
    died: !!data.died,
    inactiveReason: data.inactiveReason ?? '',
    inactiveDate: data.inactiveDate ?? new Date(),
    checkFreq: data.checkFreq
  }

  console.log(plant.acquiredAt);

  try {
    await updatePlant(plant, token);
    return dataWithSuccess({ok:true}, 'Data saved!');
  } catch (error) {
    console.log(error);
    return dataWithError({ok:false}, 'Error occurred during saving!');
  }

}