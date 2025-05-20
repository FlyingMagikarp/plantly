import {getTokenFromRequest} from "~/auth/utils";
import {parseWithZod} from "@conform-to/zod";
import type {
  Route
} from "../../../../../.react-router/types/app/features/location/routes/resources/+types/UpdateLocationsRoute";
import type {ILocationDtoData} from "~/common/types/apiTypes";
import {dataWithError, dataWithSuccess} from "remix-toast";
import {updateLocationSchema} from "~/features/location/schemas/updateLocationSchema";
import {updateLocations} from "~/features/location/location.server";


export async function action({ request }: Route.ActionArgs) {
  const token = getTokenFromRequest(request);
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: updateLocationSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const {locations} = submission.value;
  const locs =  locations
      ?.filter(
          (entry) =>
              entry &&
              entry.name?.trim() &&
              entry.description?.trim()
      )
      .map((entry) => ({
        id: entry.id,
        name: entry.name.trim(),
        description: entry.description.trim(),
      } as ILocationDtoData));

  try {
    await updateLocations(locs, token)
    return dataWithSuccess({ok:false}, 'Data saved!');
  } catch (error) {
    console.log(error);
    return dataWithError({ok:false}, 'Error occurred during saving!');
  }
}