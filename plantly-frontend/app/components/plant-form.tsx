import { Form, Link } from "react-router";

interface PlantFormProps {
  plant?: any;
  species: any[];
  isSubmitting: boolean;
  errors?: any;
}

export function PlantForm({ plant, species, isSubmitting, errors }: PlantFormProps) {
  const isEdit = !!plant;

  return (
    <Form method="post" className="space-y-8 divide-y divide-neutral-200">
      <div className="space-y-6 pt-8">
        <div>
          <h3 className="text-lg font-medium text-neutral-900">
            {isEdit ? "Edit Plant" : "New Plant"}
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Tell us more about your plant instance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="nickname" className="block text-sm font-medium text-neutral-700">
              Nickname
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="nickname"
                id="nickname"
                defaultValue={plant?.nickname}
                required
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
              />
            </div>
            {errors?.nickname && <p className="mt-2 text-sm text-red-600">{errors.nickname}</p>}
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="speciesId" className="block text-sm font-medium text-neutral-700">
              Species
            </label>
            <div className="mt-1">
              <select
                id="speciesId"
                name="speciesId"
                defaultValue={plant?.speciesId}
                required
                className="mt-1 block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm border"
              >
                <option value="">Select a species</option>
                {species.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.commonName} ({s.scientificName})
                  </option>
                ))}
              </select>
            </div>
            {errors?.speciesId && <p className="mt-2 text-sm text-red-600">{errors.speciesId}</p>}
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="acquiredAt" className="block text-sm font-medium text-neutral-700">
              Acquired At
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="acquiredAt"
                id="acquiredAt"
                defaultValue={plant?.acquiredAt ? new Date(plant.acquiredAt).toISOString().split('T')[0] : ""}
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="status" className="block text-sm font-medium text-neutral-700">
              Status
            </label>
            <div className="mt-1">
              <select
                id="status"
                name="status"
                defaultValue={plant?.status || "active"}
                className="mt-1 block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm border"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="removed">Removed</option>
                <option value="dead">Dead</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="notes" className="block text-sm font-medium text-neutral-700">
              Notes
            </label>
            <div className="mt-1">
              <textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={plant?.notes}
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end gap-3">
          <Link
            to={isEdit ? `/plants/${plant.id}` : "/plants"}
            className="rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEdit ? "Update Plant" : "Create Plant"}
          </button>
        </div>
      </div>
    </Form>
  );
}
