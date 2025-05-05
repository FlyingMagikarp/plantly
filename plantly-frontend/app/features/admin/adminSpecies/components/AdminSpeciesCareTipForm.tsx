import type {ICareTipDtoData, ISpeciesDtoData} from "~/common/types/apiTypes";
import {cn} from "~/common/utils/styleUtil";
import {useFetcher} from "react-router";
import {useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {updateSpeciesCareTipSchema} from "~/features/admin/adminSpecies/schemas/updateSpeciesCareTipSchema";
import {Checkbox} from "radix-ui";


export default function AdminSpeciesCareTipForm({species, careTip}:{species: ISpeciesDtoData, careTip: ICareTipDtoData}) {
  const fetcher = useFetcher();

  const defaultValue = {
    id: careTip.id,
    speciesId: species.speciesId,
    placement: careTip.placement,
    winterHardy: careTip.winterHardy,
    optimalTempMinC: careTip.optimalTempMinC,
    optimalTempMaxC: careTip.optimalTempMaxC,
    wateringFrequencyDays: careTip.wateringFrequencyDays,
    wateringNotes: careTip.wateringNotes,
    fertilizingFrequencyDays: careTip.fertilizingFrequencyDays,
    fertilizingType: careTip.fertilizingType,
    fertilizingNotes: careTip.fertilizingNotes,
    repottingCycleMonths: careTip.repottingCycleMonths,
    growingSeasonStart: careTip.growingSeasonStart,
    growingSeasonEnd: careTip.growingSeasonEnd,
    dormantSeasonStart: careTip.dormantSeasonStart,
    dormantSeasonEnd: careTip.dormantSeasonEnd,
    pruningNotes: careTip.pruningNotes,
    pruningMonths: careTip.pruningMonths.toString(),
    wiringNotes: careTip.wiringNotes,
    wiringMonths: careTip.wiringMonths.toString(),
    propagationNotes: careTip.propagationNotes,
    propagationMonths: careTip.propagationMonths.toString(),
    pests: careTip.pests,
    soil: careTip.soil,
    notes: careTip.notes,
  };

  const [form, fields] = useForm({
    id: 'species-caretip-form',
    lastResult: fetcher.state === 'idle' ? fetcher?.data : null,
    defaultValue,
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({formData}) {
      return parseWithZod(formData, {schema: updateSpeciesCareTipSchema});
    }
  });

  return (
      <div className={'flex flex-col gap-2'}>
        <fetcher.Form method={'POST'} action={`/admin/species/${species.speciesId}/updateCareTips`}>
          <input hidden name={fields.id.name} defaultValue={fields.id.value} />
          <div>
            <div>
              <span className={'font-semibold pt-1'}>
                Placement
              </span>
              <select
                  name={fields.placement.name}
                  defaultValue={fields.placement.value}
                  className="border rounded p-2 ml-3"
              >
                <option value="">Select location</option>
                <option value="sunny">Sunny</option>
                <option value="semi_shade">Semi-shade</option>
                <option value="shade">Shade</option>
              </select>
            </div>

            <div>
              <span className={'font-semibold pt-1'}>
                Winter Hardy
              </span>
              <Checkbox.Root
                  checked={fields.winterHardy.value === 'on'}
                  className="h-5 w-5 border rounded ml-3"
              />
            </div>
            <FormInput
                label={'Optimal Temp Min C°'}
                name={fields.optimalTempMinC.name}
                defaultValue={fields.optimalTempMinC.value}
                key={fields.optimalTempMinC.key}
                errors={fields.optimalTempMinC.errors}
            />
            <FormInput
                label={'Optimal Temp Max C°'}
                name={fields.optimalTempMaxC.name}
                defaultValue={fields.optimalTempMaxC.value}
                key={fields.optimalTempMaxC.key}
                errors={fields.optimalTempMaxC.errors}
            />
            <FormInput
                label={'Watering frequency (days)'}
                name={fields.wateringFrequencyDays.name}
                defaultValue={fields.wateringFrequencyDays.value}
                key={fields.wateringFrequencyDays.key}
                errors={fields.wateringFrequencyDays.errors}
            />
            <FormInput
                label={'Watering notes'}
                name={fields.wateringNotes.name}
                defaultValue={fields.wateringNotes.value}
                key={fields.wateringNotes.key}
                errors={fields.wateringNotes.errors}
                isArea={true}
            />
            <FormInput
                label={'Fertilizing frequency (days)'}
                name={fields.fertilizingFrequencyDays.name}
                defaultValue={fields.fertilizingFrequencyDays.value}
                key={fields.fertilizingFrequencyDays.key}
                errors={fields.fertilizingFrequencyDays.errors}
            />
            <FormInput
                label={'Fertilizing type'}
                name={fields.fertilizingType.name}
                defaultValue={fields.fertilizingType.value}
                key={fields.fertilizingType.key}
                errors={fields.fertilizingType.errors}
            />
            <FormInput
                label={'Fertilizing notes'}
                name={fields.fertilizingNotes.name}
                defaultValue={fields.fertilizingNotes.value}
                key={fields.fertilizingNotes.key}
                errors={fields.fertilizingNotes.errors}
            />
            <FormInput
                label={'Repotting cycle (months)'}
                name={fields.repottingCycleMonths.name}
                defaultValue={fields.repottingCycleMonths.value}
                key={fields.repottingCycleMonths.key}
                errors={fields.repottingCycleMonths.errors}
            />
            <FormInput
                label={'Growing Season start'}
                name={fields.growingSeasonStart.name}
                defaultValue={fields.growingSeasonStart.value}
                key={fields.growingSeasonStart.key}
                errors={fields.growingSeasonStart.errors}
            />
            <FormInput
                label={'Growing Season end'}
                name={fields.growingSeasonEnd.name}
                defaultValue={fields.growingSeasonEnd.value}
                key={fields.growingSeasonEnd.key}
                errors={fields.growingSeasonEnd.errors}
            />
            <FormInput
                label={'Dormant Season start'}
                name={fields.dormantSeasonStart.name}
                defaultValue={fields.dormantSeasonStart.value}
                key={fields.dormantSeasonStart.key}
                errors={fields.dormantSeasonStart.errors}
            />
            <FormInput
                label={'Dormant Season end'}
                name={fields.dormantSeasonEnd.name}
                defaultValue={fields.dormantSeasonEnd.value}
                key={fields.dormantSeasonEnd.key}
                errors={fields.dormantSeasonEnd.errors}
            />
            <FormInput
                label={'Pruning Notes'}
                name={fields.pruningNotes.name}
                defaultValue={fields.pruningNotes.value}
                key={fields.pruningNotes.key}
                errors={fields.pruningNotes.errors}
            />
            <FormInput
                label={'Pruning Months'}
                name={fields.pruningMonths.name}
                defaultValue={fields.pruningMonths.value}
                key={fields.pruningMonths.key}
                errors={fields.pruningMonths.errors}
            />
            <FormInput
                label={'Wiring Notes'}
                name={fields.wiringNotes.name}
                defaultValue={fields.wiringNotes.value}
                key={fields.wiringNotes.key}
                errors={fields.wiringNotes.errors}
            />
            <FormInput
                label={'Wiring Months'}
                name={fields.wiringMonths.name}
                defaultValue={fields.wiringMonths.value}
                key={fields.wiringMonths.key}
                errors={fields.wiringMonths.errors}
            />
            <FormInput
                label={'Propagation Notes'}
                name={fields.propagationNotes.name}
                defaultValue={fields.propagationNotes.value}
                key={fields.propagationNotes.key}
                errors={fields.propagationNotes.errors}
            />
            <FormInput
                label={'Propagation Months'}
                name={fields.propagationMonths.name}
                defaultValue={fields.propagationMonths.value}
                key={fields.propagationMonths.key}
                errors={fields.propagationMonths.errors}
            />
            <FormInput
                label={'Pests'}
                name={fields.pests.name}
                defaultValue={fields.pests.value}
                key={fields.pests.key}
                errors={fields.pests.errors}
            />
            <FormInput
                label={'Soil'}
                name={fields.soil.name}
                defaultValue={fields.soil.value}
                key={fields.soil.key}
                errors={fields.soil.errors}
            />
            <FormInput
                label={'Notes'}
                name={fields.notes.name}
                defaultValue={fields.notes.value}
                key={fields.notes.key}
                errors={fields.notes.errors}
            />

          </div>

          <button type={'submit'} className={'btn-primary'}>Save</button>
        </fetcher.Form>
      </div>
  );
}


interface IFormInput {
  label: string,
  name: string,
  defaultValue: string | undefined,
  className?: string;
  errors?: string[];
  key?: string;
  isArea?: boolean;
}

function FormInput({
    label,
    name,
    defaultValue = '',
    className = '',
    errors,
    isArea = false,
                   }: IFormInput) {
  return (
    <div className={'flex flex-row gap-1 w-1/2'}>
      <span className={'font-semibold pt-1 w-1/4'}>
        {label}
      </span>
      {isArea ? (
          <textarea
              className={cn(
                  `p-2 px-2 input-field w-3/4 ${className}`,
                  errors ? 'border-red-400' : ''
              )}
              name={name}
              defaultValue={defaultValue ?? ''}
          />
      ) : (
          <input
              type="text"
              className={cn(
                  `p-2 px-2 input-field w-3/4 ${className}`,
                  errors ? 'border-red-400' : ''
              )}
              name={name}
              defaultValue={defaultValue ?? ''}
          />
      )}

      <div className={'mt-1 min-h-6 text-sm text-primary'}>{errors}</div>
    </div>
  );

}