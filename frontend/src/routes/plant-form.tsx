import { Form, Link, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import type { PlantFormActionData, PlantFormData } from './plants-data';
import { PlantPageHeader } from './plants-common';
import { BackLink, PageHeader } from '../components/ui';

export function PlantFormRoute() {
  const { plant, species } = useLoaderData<PlantFormData>();
  const action = useActionData<PlantFormActionData>();
  const navigation = useNavigation();
  const editing = plant !== null;
  const values = action?.fields ?? {
    nickname: plant?.nickname ?? '',
    speciesId: plant?.species.id.toString() ?? '',
    acquisitionDate: plant?.acquisitionDate ?? localDate(),
    notes: plant?.notes ?? '',
  };
  const availableSpecies = species.filter(
    (item) => !item.archived || item.id === plant?.species.id,
  );
  const hasActiveSpecies = species.some((item) => !item.archived);

  return (
    <PlantPageHeader>
      <BackLink to={editing ? `/plants/${plant.id}` : '/plants'}>{editing ? plant.nickname : 'My Plants'}</BackLink>
      <div className="mt-3"><PageHeader eyebrow="Plant collection" title={editing ? 'Edit plant' : 'Add a plant'} /></div>

      {!hasActiveSpecies && !editing ? (
        <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold">An active species is required</h2>
          <p className="mt-2 text-stone-700">Synchronize an active species before adding a plant. Archived species cannot be selected.</p>
          <Link className="mt-4 inline-block font-medium text-emerald-700 hover:underline" to="/species">Browse species</Link>
        </section>
      ) : (
        <Form className="panel mt-6 grid gap-5" method="post">
          <Field label="Nickname" name="nickname" required value={values.nickname} />
          <label className="grid gap-2 text-sm font-medium" htmlFor="plant-species">
            Species
            <select className="form-control" defaultValue={values.speciesId} id="plant-species" name="speciesId" required>
              <option disabled value="">Select a species</option>
              {availableSpecies.map((item) => (
                <option disabled={item.archived && item.id !== plant?.species.id} key={item.id} value={item.id}>
                  {item.name}{item.archived ? ' (archived — current species)' : ''}
                </option>
              ))}
            </select>
          </label>
          <Field label="Acquisition date" max={localDate()} name="acquisitionDate" required type="date" value={values.acquisitionDate} />
          <label className="grid gap-2 text-sm font-medium" htmlFor="plant-notes">
            Notes <span className="font-normal text-stone-500">Optional</span>
            <textarea className="form-textarea" defaultValue={values.notes} id="plant-notes" name="notes" />
          </label>
          {action && <p className="error-message" role="alert">{action.message}</p>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Link className="btn-secondary" to={editing ? `/plants/${plant.id}` : '/plants'}>Cancel</Link>
            <button className="btn-primary" disabled={navigation.state !== 'idle'} type="submit">
              {navigation.state === 'idle' ? (editing ? 'Save changes' : 'Add plant') : 'Saving…'}
            </button>
          </div>
        </Form>
      )}
    </PlantPageHeader>
  );
}

function Field({ label, name, value, type = 'text', ...inputProps }: { label: string; name: string; value: string; type?: string; max?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-medium" htmlFor={`plant-${name}`}>
      {label}
      <input {...inputProps} className="form-control" defaultValue={value} id={`plant-${name}`} name={name} type={type} />
    </label>
  );
}

function localDate(): string {
  const now = new Date();
  return new Date(now.valueOf() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}
