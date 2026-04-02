import { Form, Link } from "react-router";

interface SpeciesFormProps {
  species?: any;
  isSubmitting: boolean;
  errors?: any;
}

export function SpeciesForm({ species, isSubmitting, errors }: SpeciesFormProps) {
  const isEdit = !!species;

  return (
    <Form method="post" className="space-y-8 divide-y divide-neutral-200">
      <div className="space-y-6 pt-8">
        <div>
          <h3 className="text-lg font-medium text-neutral-900">
            {isEdit ? "Edit Species" : "New Species"}
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Provide the reference care information for this plant species.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="commonName" className="block text-sm font-medium text-neutral-700">
              Common Name (English)
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="commonName"
                id="commonName"
                defaultValue={species?.commonName}
                required
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="commonNameDe" className="block text-sm font-medium text-neutral-700">
              Common Name (German)
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="commonNameDe"
                id="commonNameDe"
                defaultValue={species?.commonNameDe}
                required
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="scientificName" className="block text-sm font-medium text-neutral-700">
              Scientific Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="scientificName"
                id="scientificName"
                defaultValue={species?.scientificName}
                required
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={species?.description}
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="placementType" className="block text-sm font-medium text-neutral-700">
              Placement
            </label>
            <select
              id="placementType"
              name="placementType"
              defaultValue={species?.placementType || "INDOOR"}
              className="mt-1 block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm border"
            >
              <option value="INDOOR">Indoor</option>
              <option value="OUTDOOR">Outdoor</option>
              <option value="BOTH">Both</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="lightLevel" className="block text-sm font-medium text-neutral-700">
              Light Level
            </label>
            <select
              id="lightLevel"
              name="lightLevel"
              defaultValue={species?.lightLevel || "MEDIUM"}
              className="mt-1 block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm border"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="BRIGHT_INDIRECT">Bright Indirect</option>
              <option value="DIRECT_SUN">Direct Sun</option>
              <option value="FULL_SUN">Full Sun</option>
              <option value="PARTIAL_SHADE">Partial Shade</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="wateringStrategy" className="block text-sm font-medium text-neutral-700">
              Watering Strategy
            </label>
            <select
              id="wateringStrategy"
              name="wateringStrategy"
              defaultValue={species?.wateringStrategy || "WATER_WHEN_TOP_SOIL_DRY"}
              className="mt-1 block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm border"
            >
              <option value="KEEP_EVENLY_MOIST">Keep Evenly Moist</option>
              <option value="WATER_WHEN_TOP_SOIL_DRY">Water when top soil is dry</option>
              <option value="LET_MOSTLY_DRY_OUT">Let mostly dry out</option>
              <option value="LET_FULLY_DRY_OUT">Let fully dry out</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end gap-3">
          <Link
            to={isEdit ? `/species/${species.id}` : "/species"}
            className="rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEdit ? "Update Species" : "Create Species"}
          </button>
        </div>
      </div>
    </Form>
  );
}
