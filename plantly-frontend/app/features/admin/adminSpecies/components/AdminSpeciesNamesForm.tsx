import type {ISpeciesDtoData, ISpeciesOverviewDtoData} from "~/common/types/apiTypes";
import {cn} from "~/common/utils/styleUtil";
import {useFetcher} from "react-router";
import {useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {updateSpeciesNamesSchema} from "~/features/admin/adminSpecies/schemas/updateSpeciesNamesSchema";
import {useState} from "react";


export default function AdminSpeciesNamesForm({species, speciesTranslations}:{species: ISpeciesDtoData, speciesTranslations: ISpeciesOverviewDtoData[]}) {
  const fetcher = useFetcher();

  const [commonNames, setCommonNames] = useState(
      speciesTranslations.length > 0
          ? speciesTranslations.map((c) => ({ name: c.commonName, lang: c.lc }))
          : [{ name: "", lang: "EN" }]
  );

  const defaultValue = {
    latinName: species.latinName,
    commonNames: commonNames,
  }

  const [form, fields] = useForm({
    id: 'species-names-form',
    defaultValue,
    lastResult: fetcher.state === 'idle' ? fetcher?.data : null,
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({formData}) {
      return parseWithZod(formData, {schema: updateSpeciesNamesSchema});
    }
  });

  return (
      <div className={'flex flex-col gap-2'}>
        <fetcher.Form method={'POST'} action={`/admin/species/${species.speciesId}/updateNames`}>
          <div>
            <FormInput
              label={'Latin Name'}
              name={fields.latinName.name}
              defaultValue={fields.latinName.value}
              key={fields.latinName.key}
              errors={fields.latinName.errors}
            />
          </div>

          <div>
            <fieldset>
              <p className={'subheading'}>Common Names</p>
              <div className={'w-1/2'}>
                {commonNames.map((name, index) => {
                  const field = fields.commonNames.getFieldList()[index]?.getFieldset();

                  return (
                      <div key={index} className={'flex gap-2'}>
                        <FormInput
                            label={'Language Code'}
                            name={`commonNames[${index}].lang`}
                            defaultValue={name.lang}
                            errors={field?.name.errors}
                        />

                        <FormInput
                            label={'Common Name'}
                            name={`commonNames[${index}].name`}
                            defaultValue={name.name}
                            errors={field?.name.errors}
                        />
                      </div>
                  );
                })}
              </div>
              <div className={'mt-2'}>
                <button
                  type={'button'}
                  className={'btn-secondary'}
                  onClick={() => setCommonNames((prev) => [...prev, {name: '', lang: ''}])}
                >
                  Add common name
                </button>
              </div>

            </fieldset>
          </div>
          <div className={'mt-4'}>
            <button type={'submit'} className={'btn-primary'}>Save</button>
          </div>
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
    <div className={'flex flex-row gap-1 w-1/2'}>
      <span className={'font-semibold pt-1 w-1/4'}>
        {label}
      </span>
      <input
          type="text"
          className={cn(
              `p-2 px-2 input-field w-3/4 ${className}`,
              errors ? 'border-red-400' : ''
          )}
          name={name}
          defaultValue={defaultValue ?? ''}
      />
      <div className={'mt-1 min-h-6 text-sm text-primary'}>{errors}</div>
    </div>
  );

}