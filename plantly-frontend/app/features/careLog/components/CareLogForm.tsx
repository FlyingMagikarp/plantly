import type {ICareLogDtoData} from "~/common/types/apiTypes";
import {DatePicker} from "~/common/components/DatePicker";
import {useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import { updateCareLogSchema } from "../schmas/updateCareLogSchema";
import { useFetcher } from "react-router";
import {useState} from "react";
import {cn} from "~/common/utils/styleUtil";


export default function CareLogForm({careLog, plantId}: {careLog: ICareLogDtoData, plantId: number}){
  const fetcher = useFetcher();
  const [eventDate, setEventDate] = useState(careLog.eventDate);

  const eventTypes: EventType[] = [
    'watering',
    'fertilizing',
    'pruning',
    'repotting',
    'wiring',
    'checking',
    'acquired',
    'removed',
    'other'
  ];

  const updateEventdate = (date: string) => {
    setEventDate(date);
  }

  const defaultValue = {
    id: careLog.id,
    eventType: careLog.eventType,
    eventDate: careLog.eventDate,
    notes: careLog.notes,
  }

  const [form, fields] = useForm({
    id: 'carelog-form',
    lastResult: fetcher.state === 'idle' ? fetcher?.data : null,
    defaultValue,
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({formData}) {
      return parseWithZod(formData, {schema: updateCareLogSchema});
    }
  })

  return (
      <div>
        <fetcher.Form method={'POST'} action={`/care/${plantId}/add`}>
          <div className={'flex flex-col gap-2'}>
            <div className={'flex flex-row gap-1 w-1/2'}>
              <input hidden readOnly={true} name={fields.eventDate.name} value={eventDate} />
              <span className={'font-semibold pt-1 w-1/4'}>Event Date</span>
              <DatePicker initDate={eventDate} onChange={updateEventdate} />
            </div>

            <div className={'flex flex-row gap-1 w-1/2'}>
              <span className={'font-semibold pt-1 w-1/4'}>Event Type</span>
              <select
                  name={fields.eventType.name}
                  defaultValue={fields.eventType.value ?? 'checking'}
                  className={'border rounded p-2 capitalize'}
              >
                {eventTypes.map((et) => {
                      return (
                          <option value={et} key={et} className={'capitalize'}>{et}</option>
                      );
                    }
                )}
              </select>
            </div>

            <FormInput
                label={'Notes'}
                name={fields.notes.name}
                defaultValue={fields.notes.value}
                key={fields.notes.key}
                errors={fields.notes.errors}
                isArea={true}
            />

            <div className={'flex flex-row gap-2'}>
              <button type={'submit'} className={'btn-primary'}>Save</button>
            </div>
          </div>
        </fetcher.Form>
      </div>
  );
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