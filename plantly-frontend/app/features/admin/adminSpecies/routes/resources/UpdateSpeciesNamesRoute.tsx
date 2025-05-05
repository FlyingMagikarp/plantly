import type {
  Route
} from "../../../../../../.react-router/types/app/features/admin/adminSpecies/routes/resources/+types/UpdateSpeciesNamesRoute";
import {parseWithZod} from "@conform-to/zod";
import {updateSpeciesNamesSchema} from "~/features/admin/adminSpecies/schemas/updateSpeciesNamesSchema";
import type {INameLcPair} from "~/common/types/apiTypes";
import {updateSpeciesNames} from "~/features/admin/adminSpecies/adminSpecies.server";
import {getTokenFromRequest} from "~/auth/utils";
import {dataWithError, dataWithSuccess} from "remix-toast";

export async function action({ params, request }: Route.ActionArgs) {
  const token = getTokenFromRequest(request);
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: updateSpeciesNamesSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const {latinName, commonNames} = submission.value;
  const names =  commonNames
      ?.filter(
          (entry) =>
              entry &&
              entry.name?.trim() &&
              entry.lang?.trim()
      )
      .map((entry) => ({
        commonName: entry.name.trim(),
        lc: entry.lang.trim(),
      } as INameLcPair));

  try {
    await updateSpeciesNames(params.speciesId, latinName, names, token)
    return dataWithSuccess({ok:true}, 'Data saved!');
  } catch (error) {
    console.log(error);
    return dataWithError({ok:false}, 'Error occurred during saving!');
  }

}