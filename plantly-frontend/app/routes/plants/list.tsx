import type { Route } from "./+types/list";
import { Link, useLoaderData, useSearchParams } from "react-router";
import { PLANT_STATUS_LABELS, formatEnum } from "../../utils/enum-mappings";
import { useToast } from "../../components/toast";
import { useEffect, useRef } from "react";

const API_URL = "http://localhost:8081";

export async function loader({}: Route.LoaderArgs) {
  const response = await fetch(`${API_URL}/plants`);
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
  const [searchParams] = useSearchParams();
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Plant Library
        </h2>
        <Link
          to="/plants/new"
          className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
        >
          Add New Plant
        </Link>
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
