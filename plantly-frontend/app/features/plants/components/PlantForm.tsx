import type {ILocationDtoData, IPlantDtoData, ISpeciesOverviewDtoData} from "~/common/types/apiTypes";
import {useFetcher} from "react-router";
import {useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {updatePlantSchema} from "~/features/plants/schemas/updatePlantSchema";
import {cn} from "~/common/utils/styleUtil";
import {DatePicker} from "~/common/components/DatePicker";
import {useState} from "react";

export default function PlantForm({plant, species, locations}:{plant: IPlantDtoData, species: ISpeciesOverviewDtoData[], locations: ILocationDtoData[]}){
  const fetcher = useFetcher();
  const [acquiredDate, setAcquiredDate] = useState(plant.acquiredAt);
  const [inactiveDate, setInactiveDate] = useState(plant.inactiveDate);
  const [isRemoved, setIsRemoved] = useState(plant.removed);

  const updateAcquiredDate = (date: Date) => {
    setAcquiredDate(date);
  }

  const updateInactiveDate = (date: Date) => {
    setInactiveDate(date);
  }

  const handleRemovedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRemoved(e.target.checked);
  }

  const defaultValue = {
    id: plant.id,
    speciesId: plant.speciesId,
    nickname: plant.nickname,
    acquiredAt: plant.acquiredAt,
    locationId: plant.locationId,
    notes: plant.notes,
    removed: plant.removed,
    died: plant.died,
    inactiveReason: plant.inactiveReason,
    inactiveDate: plant.inactiveDate,
    checkFreq: plant.checkFreq,
  }

  const [form, fields] = useForm({
    id: 'plant-form',
    lastResult: fetcher.state === 'idle' ? fetcher?.data : null,
    defaultValue,
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({formData}) {
      return parseWithZod(formData, {schema: updatePlantSchema});
    }
  })

  return (
    <div>
      <fetcher.Form method={'POST'} action={`/plants/${plant.id}/updatePlant`}>
        <input hidden name={fields.id.name} defaultValue={fields.id.value} />

        <div>
          <FormInput
            label={'Nickname'}
            name={fields.nickname.name}
            defaultValue={fields.nickname.value}
            key={fields.nickname.key}
            errors={fields.nickname.errors}
          />

          <div>
            <span>Species</span>
            <select
                name={fields.speciesId.name}
                defaultValue={fields.speciesId.value}
                className="border rounded p-2 ml-3"
            >
              <option value={-1}>Select species</option>
              {species.map((s) => {
                  return (
                      <option value={s.speciesId}>{s.latinName} - {s.commonName}</option>
                  );
              }
              )}
            </select>
          </div>

          <div>
            <input hidden name={fields.acquiredAt.name} defaultValue={acquiredDate.toISOString().slice(0,19)} />
            <DatePicker initDate={acquiredDate} onChange={updateAcquiredDate} />
          </div>

          <div>
            <span>Location</span>
            <select
                name={fields.locationId.name}
                defaultValue={fields.locationId.value}
                className="border rounded p-2 ml-3"
            >
              <option value={-1}>Select location</option>
              {locations.map((l) => {
                    return (
                        <option value={l.id}>{l.name}</option>
                    );
                  }
              )}
            </select>
          </div>

          <FormInput
              label={'Check Frequency'}
              name={fields.checkFreq.name}
              defaultValue={fields.checkFreq.value}
              key={fields.checkFreq.key}
              errors={fields.checkFreq.errors}
          />

          <FormInput
            label={'Notes'}
            name={fields.notes.name}
            defaultValue={fields.notes.value}
            key={fields.notes.key}
            errors={fields.notes.errors}
            isArea={true}
          />


          <div>
            <span>Removed</span>
            <input
              type={'checkbox'}
              name={fields.removed.name}
              defaultChecked={isRemoved}
              onChange={handleRemovedChange}
              className="h-5 w-5 border rounded ml-3"
            />
          </div>

          {isRemoved && (
              <div>
                <div>
                  <input hidden name={fields.inactiveDate.name} defaultValue={inactiveDate.toISOString().slice(0,19)} />
                  <DatePicker initDate={inactiveDate} onChange={updateInactiveDate} />
                </div>
                <div>
                  <span>Died</span>
                  <input
                      type={'checkbox'}
                      name={fields.died.name}
                      defaultChecked={fields.died.value === 'on'}
                      className="h-5 w-5 border rounded ml-3"
                  />
                </div>
                <FormInput
                    label={'Reason'}
                    name={fields.inactiveReason.name}
                    defaultValue={fields.inactiveReason.value}
                    key={fields.inactiveReason.key}
                    errors={fields.inactiveReason.errors}
                    isArea={true}
                />
              </div>
          )}

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