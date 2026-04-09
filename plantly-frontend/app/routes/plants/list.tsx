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
  const response = await fetch(`${API_URL}/plants?showInactive=${showInactive}`);
  if (!response.ok) {
    throw new Error("Could not fetch plants");
  }
  return await response.json();
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Plant Library | Plantly" }];
}

export default function PlantList() {
  const plants = useLoaderData() as any[];
  const [searchParams, setSearchParams] = useSearchParams();
  const { success } = useToast();
  const notifiedRef = useRef(false);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Plant Library
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              id="show-inactive-switch"
              role="switch"
              aria-checked={searchParams.get("showInactive") === "true"}
              onClick={() => {
                const current = searchParams.get("showInactive") === "true";
                const newParams = new URLSearchParams(searchParams);
                if (!current) {
                  newParams.set("showInactive", "true");
                } else {
                  newParams.delete("showInactive");
                }
                setSearchParams(newParams);
              }}
              className={`${
                searchParams.get("showInactive") === "true" ? "bg-green-600" : "bg-neutral-200"
              } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-green-600 focus:ring-offset-2 outline-none shadow-sm`}
            >
              <span
                aria-hidden="true"
                className={`${
                  searchParams.get("showInactive") === "true" ? "translate-x-5" : "translate-x-0"
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out`}
              />
            </button>
            <label
              htmlFor="show-inactive-switch"
              className="text-sm font-medium text-neutral-700 cursor-pointer"
              onClick={() => {
                const current = searchParams.get("showInactive") === "true";
                const newParams = new URLSearchParams(searchParams);
                if (!current) {
                  newParams.set("showInactive", "true");
                } else {
                  newParams.delete("showInactive");
                }
                setSearchParams(newParams);
              }}
            >
              Show inactive
            </label>
          </div>
          <Link
            to="/plants/new"
            className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
          >
            Add New Plant
          </Link>
        </div>
      </div>

      {plants.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-white">
          <p className="text-neutral-500">Your library is currently empty. Add your first plant!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plants.map((p) => (
            <Link
              key={p.id}
              to={`/plants/${p.id}`}
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:border-green-300 hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-green-700">
                    {p.nickname}
                  </h3>
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    p.status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                    p.status === 'dead' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                    'bg-gray-50 text-gray-700 ring-gray-600/20'
                  }`}>
                    {formatEnum(p.status, PLANT_STATUS_LABELS)}
                  </span>
                </div>
                <p className="text-sm font-medium italic text-neutral-500">
                  {p.species?.commonName} ({p.species?.scientificName})
                </p>
                {p.acquiredAt && (
                  <p className="mt-2 text-xs text-neutral-400">
                    Acquired: {new Date(p.acquiredAt).toLocaleDateString()}
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
