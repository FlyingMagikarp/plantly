import type {
  Route
} from "../../../../../../.react-router/types/app/features/admin/adminSpecies/routes/resources/+types/UpdateSpeciesCareTipsRoute";
import {parseWithZod} from "@conform-to/zod";
import type {ICareTipDtoData} from "~/common/types/apiTypes";
import {updateSpeciesCareTip} from "~/features/admin/adminSpecies/adminSpecies.server";
import {getTokenFromRequest} from "~/auth/utils";
import {dataWithError, dataWithSuccess} from "remix-toast";
import {updateSpeciesCareTipSchema} from "~/features/admin/adminSpecies/schemas/updateSpeciesCareTipSchema";

export async function action({ params, request }: Route.ActionArgs) {
  const token = getTokenFromRequest(request);
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: updateSpeciesCareTipSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const data = submission.value;
  const careTip: ICareTipDtoData = {
    id: parseInt(data.id),
    species: {speciesId: parseInt(params.speciesId), latinName: ''},
    placement: data.placement as ICareTipDtoData['placement'],
    winterHardy: data.winterHardy ?? false,
    optimalTempMinC: data.optimalTempMinC,
    optimalTempMaxC: data.optimalTempMaxC,
    wateringFrequencyDays: data.wateringFrequencyDays,
    wateringNotes: data.wateringNotes,
    fertilizingFrequencyDays: data.fertilizingFrequencyDays,
    fertilizingType: data.fertilizingType,
    fertilizingNotes: data.fertilizingNotes,
    repottingCycleMonths: data.repottingCycleMonths,
    growingSeasonStart: data.growingSeasonStart,
    growingSeasonEnd: data.growingSeasonEnd,
    dormantSeasonStart: data.dormantSeasonStart,
    dormantSeasonEnd: data.dormantSeasonEnd,
    pruningNotes: data.pruningNotes ?? '',
    pruningMonths: (data.pruningMonths ?? []).map(Number),
    wiringNotes: data.wiringNotes ?? '',
    wiringMonths: (data.wiringMonths ?? []).map(Number),
    propagationNotes: data.propagationNotes,
    propagationMonths: (data.propagationMonths ?? []).map(Number),
    pests: data.pests ?? '',
    notes: data.notes ?? '',
    soil: data.soil,
  }

  try {
    await updateSpeciesCareTip(params.speciesId, careTip, token)
    return dataWithSuccess({ok:true}, 'Data saved!');
  } catch (error) {
    console.log(error);
    return dataWithError({ok:false}, 'Error occurred during saving!');
  }

}