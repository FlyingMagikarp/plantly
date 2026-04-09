import { API_BASE_URL } from "../../config";
import type { Route } from "./+types/list";
import { Link, useLoaderData, useSearchParams } from "react-router";
import {
  PLACEMENT_TYPE_LABELS,
  WATERING_STRATEGY_LABELS,
  formatEnum,
} from "../../utils/enum-mappings";
import { useToast } from "../../components/toast";
import { useEffect, useRef } from "react";

const API_URL = API_BASE_URL;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const showInactive = url.searchParams.get("showInactive") === "true";
  const search = url.searchParams.get("search") || "";
  const response = await fetch(
    `${API_URL}/species?showInactive=${showInactive}&search=${encodeURIComponent(
      search
    )}`
  );
  if (!response.ok) {
    throw new Error("Could not fetch species");
  }
  return await response.json();
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Species Library | Plantly" }];
}

export default function SpeciesList() {
  const species = useLoaderData() as any[];
  const [searchParams, setSearchParams] = useSearchParams();
  const { success } = useToast();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (notifiedRef.current) return;

    const successType = searchParams.get("success");
    if (successType === "species-deleted") {
      success("Species deleted");
      notifiedRef.current = true;
    } else if (successType === "species-inactivated") {
      success("Species marked as inactive");
      notifiedRef.current = true;
    }
  }, [searchParams, success]);

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Species Library
        </h2>
        <Link
          to="/species/new"
          className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
        >
          Add New Species
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3 lg:items-end">
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
          <label
            htmlFor="search"
            className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
          >
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Search by name or scientific name..."
              defaultValue={searchParams.get("search") || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateFilters({ search: e.currentTarget.value });
                }
              }}
              className="block w-full rounded-md border-neutral-300 py-1.5 pl-3 pr-10 text-sm focus:border-green-500 focus:ring-green-500"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex h-[38px] items-center space-x-3 sm:justify-end">
          <button
            type="button"
            id="show-inactive-switch"
            role="switch"
            aria-checked={searchParams.get("showInactive") === "true"}
            onClick={() => {
              const current = searchParams.get("showInactive") === "true";
              updateFilters({ showInactive: !current ? "true" : undefined });
            }}
            className={`${
              searchParams.get("showInactive") === "true"
                ? "bg-green-600"
                : "bg-neutral-200"
            } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-green-600 focus:ring-offset-2 outline-none shadow-sm`}
          >
            <span
              aria-hidden="true"
              className={`${
                searchParams.get("showInactive") === "true"
                  ? "translate-x-5"
                  : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out`}
            />
          </button>
          <label
            htmlFor="show-inactive-switch"
            className="text-sm font-medium text-neutral-700 cursor-pointer select-none"
            onClick={() => {
              const current = searchParams.get("showInactive") === "true";
              updateFilters({ showInactive: !current ? "true" : undefined });
            }}
          >
            Show inactive
          </label>
        </div>
      </div>

      {species.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-white">
          <p className="text-neutral-500">
            {searchParams.get("search") || searchParams.get("showInactive") === "true"
              ? "No species found matching your filters."
              : "Your library is currently empty. Add your first species!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {species.map((s) => (
            <Link
              key={s.id}
              to={`/species/${s.id}`}
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:border-green-300 hover:shadow-md"
            >
              <div className="p-6">
                <h3 className="flex items-center justify-between text-lg font-bold text-neutral-900 group-hover:text-green-700">
                  {s.commonName}
                  {!s.isActive && (
                    <span className="ml-2 inline-flex items-center rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600 ring-1 ring-inset ring-neutral-500/10">
                      Inactive
                    </span>
                  )}
                </h3>
                <p className="text-sm font-medium italic text-neutral-500">
                  {s.scientificName}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {formatEnum(s.placementType, PLACEMENT_TYPE_LABELS)}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {formatEnum(s.wateringStrategy, WATERING_STRATEGY_LABELS)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
