import type { Route } from "./+types/list";
import { Link, useLoaderData } from "react-router";

// Should ideally be in a shared config
const API_URL = "http://localhost:3001";

export async function loader({}: Route.LoaderArgs) {
  const response = await fetch(`${API_URL}/species`);
  if (!response.ok) {
    throw new Error("Failed to fetch species");
  }
  return await response.json();
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Species Library | Plantly" }];
}

export default function SpeciesList() {
  const species = useLoaderData() as any[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Plant Library
        </h2>
        <Link
          to="/species/new"
          className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
        >
          Add New Species
        </Link>
      </div>

      {species.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-white">
          <p className="text-neutral-500">Your library is currently empty. Add your first species!</p>
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
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-green-700">
                  {s.commonName}
                </h3>
                <p className="text-sm font-medium italic text-neutral-500">
                  {s.scientificName}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {s.placementType}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {s.wateringStrategy}
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
