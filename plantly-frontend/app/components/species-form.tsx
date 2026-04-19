import { Form, Link } from "react-router";
import {
  PLACEMENT_TYPE_LABELS,
  LIGHT_LEVEL_LABELS,
  WATERING_STRATEGY_LABELS,
  HUMIDITY_PREFERENCE_LABELS,
  SEASON_TYPE_LABELS,
} from "../utils/enum-mappings";

interface SpeciesFormProps {
  species?: any;
  isSubmitting: boolean;
  errors?: any;
}

export function SpeciesForm({ species, isSubmitting, errors }: SpeciesFormProps) {
  const isEdit = !!species;

  return (
    <Form method="post" className="space-y-6 sm:space-y-8 divide-y divide-neutral-200">
      <div className="space-y-6 pt-4 sm:pt-8">
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
              {Object.entries(PLACEMENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
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
              {Object.entries(LIGHT_LEVEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
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
              {Object.entries(WATERING_STRATEGY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="humidityPreference" className="block text-sm font-medium text-neutral-700">
              Humidity Preference
            </label>
            <select
              id="humidityPreference"
              name="humidityPreference"
              defaultValue={species?.humidityPreference || ""}
              className="mt-1 block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm border"
            >
              <option value="">Select Humidity...</option>
              {Object.entries(HUMIDITY_PREFERENCE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="dormantSeasonStart" className="block text-sm font-medium text-neutral-700">
              Dormant Season Start
            </label>
            <select
              id="dormantSeasonStart"
              name="dormantSeasonStart"
              defaultValue={species?.dormantSeasonStart || ""}
              className="mt-1 block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm border"
            >
              <option value="">Select Season...</option>
              {Object.entries(SEASON_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="growthSeasonStart" className="block text-sm font-medium text-neutral-700">
              Growth Season Start
            </label>
            <select
              id="growthSeasonStart"
              name="growthSeasonStart"
              defaultValue={species?.growthSeasonStart || ""}
              className="mt-1 block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm border"
            >
              <option value="">Select Season...</option>
              {Object.entries(SEASON_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-8">
        <div>
          <h3 className="text-lg font-medium text-neutral-900">Care Intervals</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Define frequency ranges for various care tasks. Use numbers only (days or months).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <h4 className="text-sm font-semibold text-neutral-900 mb-4">Watering (Growing)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="wateringGrowingMinDays" className="block text-xs font-medium text-neutral-500 uppercase">Min Days</label>
                <input
                  type="number"
                  name="wateringGrowingMinDays"
                  id="wateringGrowingMinDays"
                  defaultValue={species?.wateringGrowingMinDays}
                  className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                />
              </div>
              <div>
                <label htmlFor="wateringGrowingMaxDays" className="block text-xs font-medium text-neutral-500 uppercase">Max Days</label>
                <input
                  type="number"
                  name="wateringGrowingMaxDays"
                  id="wateringGrowingMaxDays"
                  defaultValue={species?.wateringGrowingMaxDays}
                  className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-3">
            <h4 className="text-sm font-semibold text-neutral-900 mb-4">Watering (Dormant)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="wateringDormantMinDays" className="block text-xs font-medium text-neutral-500 uppercase">Min Days</label>
                <input
                  type="number"
                  name="wateringDormantMinDays"
                  id="wateringDormantMinDays"
                  defaultValue={species?.wateringDormantMinDays}
                  className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                />
              </div>
              <div>
                <label htmlFor="wateringDormantMaxDays" className="block text-xs font-medium text-neutral-500 uppercase">Max Days</label>
                <input
                  type="number"
                  name="wateringDormantMaxDays"
                  id="wateringDormantMaxDays"
                  defaultValue={species?.wateringDormantMaxDays}
                  className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-3">
            <h4 className="text-sm font-semibold text-neutral-900 mb-4">Fertilizing (Growing)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fertilizingGrowingMinDays" className="block text-xs font-medium text-neutral-500 uppercase">Min Days</label>
                <input
                  type="number"
                  name="fertilizingGrowingMinDays"
                  id="fertilizingGrowingMinDays"
                  defaultValue={species?.fertilizingGrowingMinDays}
                  className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                />
              </div>
              <div>
                <label htmlFor="fertilizingGrowingMaxDays" className="block text-xs font-medium text-neutral-500 uppercase">Max Days</label>
                <input
                  type="number"
                  name="fertilizingGrowingMaxDays"
                  id="fertilizingGrowingMaxDays"
                  defaultValue={species?.fertilizingGrowingMaxDays}
                  className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-3">
            <h4 className="text-sm font-semibold text-neutral-900 mb-4">Repotting</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="repottingFrequencyMinMonths" className="block text-xs font-medium text-neutral-500 uppercase">Min Months</label>
                <input
                  type="number"
                  name="repottingFrequencyMinMonths"
                  id="repottingFrequencyMinMonths"
                  defaultValue={species?.repottingFrequencyMinMonths}
                  className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                />
              </div>
              <div>
                <label htmlFor="repottingFrequencyMaxMonths" className="block text-xs font-medium text-neutral-500 uppercase">Max Months</label>
                <input
                  type="number"
                  name="repottingFrequencyMaxMonths"
                  id="repottingFrequencyMaxMonths"
                  defaultValue={species?.repottingFrequencyMaxMonths}
                  className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="repottingSeason" className="block text-sm font-medium text-neutral-700">
              Repotting Season
            </label>
            <select
              id="repottingSeason"
              name="repottingSeason"
              defaultValue={species?.repottingSeason || ""}
              className="mt-1 block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm border"
            >
              <option value="">Select Season...</option>
              {Object.entries(SEASON_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="pruningSeason" className="block text-sm font-medium text-neutral-700">
              Pruning Season
            </label>
            <select
              id="pruningSeason"
              name="pruningSeason"
              defaultValue={species?.pruningSeason || ""}
              className="mt-1 block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm border"
            >
              <option value="">Select Season...</option>
              {Object.entries(SEASON_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-8">
        <div>
          <h3 className="text-lg font-medium text-neutral-900">Temperature (°C)</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Define ideal and safe temperature ranges for this species.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label htmlFor="idealTempMinC" className="block text-sm font-medium text-neutral-700">
              Ideal Min
            </label>
            <input
              type="number"
              step="0.1"
              name="idealTempMinC"
              id="idealTempMinC"
              defaultValue={species?.idealTempMinC}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="idealTempMaxC" className="block text-sm font-medium text-neutral-700">
              Ideal Max
            </label>
            <input
              type="number"
              step="0.1"
              name="idealTempMaxC"
              id="idealTempMaxC"
              defaultValue={species?.idealTempMaxC}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="absoluteTempMinC" className="block text-sm font-medium text-neutral-700">
              Absolute Min
            </label>
            <input
              type="number"
              step="0.1"
              name="absoluteTempMinC"
              id="absoluteTempMinC"
              defaultValue={species?.absoluteTempMinC}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-8">
        <div>
          <h3 className="text-lg font-medium text-neutral-900">Detailed Care Notes</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Provide specific tips and instructions for each category.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="wateringNotes" className="block text-sm font-medium text-neutral-700">Watering Notes</label>
            <textarea
              id="wateringNotes"
              name="wateringNotes"
              rows={2}
              defaultValue={species?.wateringNotes}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="fertilizingNotes" className="block text-sm font-medium text-neutral-700">Fertilizing Notes</label>
            <textarea
              id="fertilizingNotes"
              name="fertilizingNotes"
              rows={2}
              defaultValue={species?.fertilizingNotes}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="repottingNotes" className="block text-sm font-medium text-neutral-700">Repotting Notes</label>
            <textarea
              id="repottingNotes"
              name="repottingNotes"
              rows={2}
              defaultValue={species?.repottingNotes}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="pruningNotes" className="block text-sm font-medium text-neutral-700">Pruning Notes</label>
            <textarea
              id="pruningNotes"
              name="pruningNotes"
              rows={2}
              defaultValue={species?.pruningNotes}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="placementNotes" className="block text-sm font-medium text-neutral-700">Placement Notes</label>
            <textarea
              id="placementNotes"
              name="placementNotes"
              rows={2}
              defaultValue={species?.placementNotes}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="seasonNotes" className="block text-sm font-medium text-neutral-700">Season Notes</label>
            <textarea
              id="seasonNotes"
              name="seasonNotes"
              rows={2}
              defaultValue={species?.seasonNotes}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="soilNotes" className="block text-sm font-medium text-neutral-700">Soil Notes</label>
            <textarea
              id="soilNotes"
              name="soilNotes"
              rows={2}
              defaultValue={species?.soilNotes}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="pestNotes" className="block text-sm font-medium text-neutral-700">Pest Notes</label>
            <textarea
              id="pestNotes"
              name="pestNotes"
              rows={2}
              defaultValue={species?.pestNotes}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>
        </div>
      </div>

      <div className="pt-5 pb-8 sm:pb-0">
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Link
            to={isEdit ? `/species/${species.id}` : "/species"}
            className="w-full sm:w-auto text-center rounded-md border border-neutral-300 bg-white py-2.5 px-4 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full sm:w-auto justify-center rounded-md border border-transparent bg-green-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEdit ? "Update Species" : "Create Species"}
          </button>
        </div>
      </div>
    </Form>
  );
}
