import { API_BASE_URL } from "../../config";
import type { Route } from "./+types/list";
import { Link, useLoaderData, useSearchParams } from "react-router";
import { PLANT_STATUS_LABELS, formatEnum } from "../../utils/enum-mappings";
import { useToast } from "../../components/toast";
import { useEffect, useRef } from "react";

const API_URL = API_BASE_URL;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const showInactive = url.searchParams.get("showInactive") === "true";
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const speciesId = url.searchParams.get("speciesId") || "";

  const [plantsRes, speciesRes] = await Promise.all([
    fetch(
      `${API_URL}/plants?showInactive=${showInactive}&search=${encodeURIComponent(
        search
      )}&status=${status}&speciesId=${speciesId}`
    ),
    fetch(`${API_URL}/species?showInactive=true`),
  ]);

  if (!plantsRes.ok || !speciesRes.ok) {
    throw new Error("Could not fetch data");
  }

  return {
    plants: (await plantsRes.json()) as any[],
    species: (await speciesRes.json()) as any[],
  };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Plant Library | Plantly" }];
}

export default function PlantList() {
  const { plants, species } = useLoaderData() as {
    plants: any[];
    species: any[];
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const { success } = useToast();
  const notifiedRef = useRef(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (notifiedRef.current) return;

    const successType = searchParams.get("success");
    if (successType === "plant-created") {
      success("Plant created");
      notifiedRef.current = true;
    } else if (successType === "plant-deleted") {
      success("Plant deleted");
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
          Plant Library
        </h2>
        <Link
          to="/plants/new"
          className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
        >
          Add New Plant
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div className="space-y-1.5">
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
              placeholder="Search plants..."
              defaultValue={searchParams.get("search") || ""}
              onChange={(e) => {
                // Debounce search? For now just handle it simply.
                // Or maybe use a button to search.
              }}
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

        <div className="space-y-1.5">
          <label
            htmlFor="status"
            className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
          >
            Status
          </label>
          <select
            id="status"
            value={searchParams.get("status") || ""}
            onChange={(e) => updateFilters({ status: e.target.value || undefined })}
            className="block w-full rounded-md border-neutral-300 py-1.5 text-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">All Statuses</option>
            {Object.entries(PLANT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="species"
            className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
          >
            Species
          </label>
          <select
            id="species"
            value={searchParams.get("speciesId") || ""}
            onChange={(e) => updateFilters({ speciesId: e.target.value || undefined })}
            className="block w-full rounded-md border-neutral-300 py-1.5 text-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">All Species</option>
            {species.map((s) => (
              <option key={s.id} value={s.id}>
                {s.commonName}
              </option>
            ))}
          </select>
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

      {plants.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-white">
          <p className="text-neutral-500">
            {searchParams.get("search") ||
            searchParams.get("status") ||
            searchParams.get("speciesId") ||
            searchParams.get("showInactive") === "true"
              ? "No plants found matching your filters."
              : "Your library is currently empty. Add your first plant!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plants.map((p) => (
            <Link
              key={p.id}
              to={`/plants/${p.id}`}
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:border-green-300 hover:shadow-md"
            >
                <div className="flex flex-col items-center justify-center p-6 border-b border-neutral-100 bg-neutral-50/30">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-inner mb-3">
                    {p.images?.find((img: any) => img.isPrimary) ? (
                      <img 
                        src={`${API_URL}/plants/images/${p.images.find((img: any) => img.isPrimary).id}`} 
                        alt={p.nickname} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-neutral-300">
                        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-green-700 transition-colors">
                    {p.nickname}
                  </h3>
                </div>
                <div className="p-6 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium italic text-neutral-500 truncate mr-2">
                      {p.species?.commonName}
                    </p>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${
                      p.status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                      p.status === 'dead' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                      'bg-gray-50 text-gray-700 ring-gray-600/20'
                    }`}>
                      {formatEnum(p.status, PLANT_STATUS_LABELS)}
                    </span>
                  </div>
                  {p.acquiredAt && (
                    <p className="mt-2 text-xs text-neutral-400 flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(p.acquiredAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
