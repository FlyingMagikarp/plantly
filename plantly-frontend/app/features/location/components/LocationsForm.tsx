import type {ILocationDtoData} from "~/common/types/apiTypes";
import {cn} from "~/common/utils/styleUtil";
import {useFetcher} from "react-router";
import {useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {useState} from "react";
import {updateLocationSchema} from "~/features/location/schemas/updateLocationSchema";


export default function LocationsForm({locs}:{locs: ILocationDtoData[]}) {
  const fetcher = useFetcher();

  const [locations, setLocations] = useState(
      locs.length > 0
          ? locs.map((l) => ({ id: l.id, name: l.name, description: l.description }))
          : [{ id: -1, name: "", description: "" }]
  );

  const defaultValue = {
    locations: locations,
  }

  const [form, fields] = useForm({
    id: 'locations-form',
    defaultValue,
    lastResult: fetcher.state === 'idle' ? fetcher?.data : null,
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({formData}) {
      return parseWithZod(formData, {schema: updateLocationSchema});
    }
  });

  return (
      <div className={'flex flex-col gap-2'}>
        <fetcher.Form method={'POST'} action={`/locations/updateLocations`}>
          <div>
            <fieldset>
              <div>
                {locations.map((loc, index) => {
                  const field = fields.locations.getFieldList()[index]?.getFieldset();

                  return (
                      <div key={index} className={'flex gap-2'}>
                        <input name={`locations[${index}].id`} defaultValue={loc.id} hidden/>
                        <FormInput
                            label={'Name'}
                            name={`locations[${index}].name`}
                            defaultValue={loc.name}
                            errors={field?.name.errors}
                        />

                        <FormInput
                            label={'Description'}
                            name={`locations[${index}].description`}
                            defaultValue={loc.description}
                            errors={field?.description.errors}
                        />

                        <button
                            type={'button'}
                            className={'btn-negative h-10 px-2 text-sm'}
                            onClick={() => {
                              setLocations((prev) => prev.filter((_, i) => i !== index));
                            }}
                        >
                          X
                        </button>
                      </div>
                  );
                })}
              </div>
              <button
                  type={'button'}
                  className={'btn-secondary'}
                  onClick={() => setLocations((prev) => [...prev, {id: -1, name: '', description: ''}])}
              >
                Add Location
              </button>
            </fieldset>
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
}

function FormInput({
                     label,
                     name,
                     defaultValue = '',
                     className = '',
                     errors,
                   }: IFormInput) {
  return (
    <div className={'flex flex-row gap-1'}>
      <span className={'font-semibold pt-1'}>
        {label}
      </span>
      <input
          type="text"
          className={cn(
              `p-2 px-2 input-field ${className}`,
              errors ? 'border-red-400' : ''
          )}
          name={name}
          defaultValue={defaultValue ?? ''}
      />
      <div className={'mt-1 min-h-6 text-sm text-primary'}>{errors}</div>
    </div>
  );

}