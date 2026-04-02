import type { Route } from "./+types/detail";
import { Link, useLoaderData, Form, redirect } from "react-router";

const API_URL = "http://localhost:3001";

export async function action({ params }: Route.ActionArgs) {
  const response = await fetch(`${API_URL}/species/${params.id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete species");
  }
  return redirect("/species");
}

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(`${API_URL}/species/${params.id}`);
  if (!response.ok) {
    throw new Error("Species not found");
  }
  return await response.json();
}

export default function SpeciesDetail() {
  const s = useLoaderData() as any;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
            {s.commonName}
          </h2>
          <p className="text-lg italic text-neutral-500">{s.scientificName}</p>
        </div>
        <div className="flex gap-4">
          <Link
            to={`/species/${s.id}/edit`}
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
          >
            Edit
          </Link>
          <Form
            method="post"
            onSubmit={(e) => {
              if (!confirm("Are you sure you want to delete this species?")) {
                e.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
            >
              Delete
            </button>
          </Form>
          <Link
            to="/species"
            className="inline-flex items-center rounded-md bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
          >
            Back to Library
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Basic Stats Column */}
        <div className="space-y-6 md:col-span-1">
          <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-500">
              Overview
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-neutral-400">Placement</dt>
                <dd className="text-sm font-semibold text-neutral-900">
                  {s.placementType}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-neutral-400">Light Level</dt>
                <dd className="text-sm font-semibold text-neutral-900">
                  {s.lightLevel}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-neutral-400">Watering</dt>
                <dd className="text-sm font-semibold text-neutral-900">
                  {s.wateringStrategy}
                </dd>
              </div>
              {s.humidityPreference && (
                <div>
                  <dt className="text-xs font-medium text-neutral-400">Humidity</dt>
                  <dd className="text-sm font-semibold text-neutral-900">
                    {s.humidityPreference}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-500">
              Ideal Conditions
            </h3>
            <div className="text-sm">
              <p>
                Temperature: {s.idealTempMinC ?? "?"}°C to{" "}
                {s.idealTempMaxC ?? "?"}°C
              </p>
              {s.absoluteTempMinC && (
                <p className="mt-2 text-xs text-red-600">
                  Warning: Minimum safe temp is {s.absoluteTempMinC}°C
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Detailed Notes Column */}
        <div className="space-y-6 md:col-span-2">
          <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-500">
              Description
            </h3>
            <p className="text-sm leading-relaxed text-neutral-700">
              {s.description || "No description provided."}
            </p>
          </section>

          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h4 className="mb-2 text-sm font-bold text-neutral-900">Watering</h4>
              <p className="text-sm text-neutral-600">
                {s.wateringNotes || "Standard watering based on strategy."}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h4 className="mb-2 text-sm font-bold text-neutral-900">Soil</h4>
              <p className="text-sm text-neutral-600">
                {s.soilNotes || "No specific soil notes."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
