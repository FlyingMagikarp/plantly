import type { Route } from "./+types/detail";
import { Link, useLoaderData, Form, redirect, useSubmit, useActionData } from "react-router";
import * as React from "react";
import { ConfirmationDialog } from "../../components/confirmation-dialog";
import {
  PLACEMENT_TYPE_LABELS,
  LIGHT_LEVEL_LABELS,
  WATERING_STRATEGY_LABELS,
  HUMIDITY_PREFERENCE_LABELS,
  SEASON_TYPE_LABELS,
  PLANT_TASK_TYPE_LABELS,
  formatEnum,
} from "../../utils/enum-mappings";

const API_URL = "http://localhost:8081";

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "inactivate") {
    const response = await fetch(`${API_URL}/species/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: false }),
    });

    if (!response.ok) {
      throw new Error("Failed to inactivate species");
    }
    return redirect("/species");
  }

  if (intent === "activate") {
    const response = await fetch(`${API_URL}/species/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: true }),
    });

    if (!response.ok) {
      throw new Error("Failed to activate species");
    }
    return redirect(`/species/${params.id}`);
  }

  const response = await fetch(`${API_URL}/species/${params.id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    if (response.status === 409) {
      return await response.json();
    }
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
  const actionData = useActionData() as any;
  const submit = useSubmit();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isInUseDialogOpen, setIsInUseDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (actionData?.error === "SpeciesInUse") {
      setIsInUseDialogOpen(true);
    }
  }, [actionData]);

  return (
    <div className="space-y-8">
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          submit(null, { method: "post" });
        }}
        title="Delete Species"
        message={`Are you sure you want to delete "${s.commonName}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      <ConfirmationDialog
        isOpen={isInUseDialogOpen}
        onClose={() => setIsInUseDialogOpen(false)}
        onConfirm={() => {
          const formData = new FormData();
          formData.append("intent", "inactivate");
          submit(formData, { method: "post" });
        }}
        title="Species In Use"
        message={`"${
          s.commonName
        }" is currently used by ${actionData?.plantCount} plant(s): ${actionData?.plants
          ?.map((p: any) => p.nickname)
          .join(", ")}. It cannot be deleted. Would you like to mark it as inactive instead? Inactive species won't appear in new plant selections.`}
        confirmText="Mark Inactive"
        type="warning"
      />
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
            {s.commonName}
            {!s.isActive && (
              <span className="ml-3 inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-500/10">
                Inactive
              </span>
            )}
          </h2>
          <p className="text-lg italic text-neutral-500">{s.scientificName}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/species/${s.id}/edit`}
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
          >
            Edit
          </Link>
          {s.isActive ? (
            <button
              type="button"
              onClick={() => {
                const formData = new FormData();
                formData.append("intent", "inactivate");
                submit(formData, { method: "post" });
              }}
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-600 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
            >
              Mark Inactive
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const formData = new FormData();
                formData.append("intent", "activate");
                submit(formData, { method: "post" });
              }}
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-green-600 shadow-sm ring-1 ring-inset ring-green-300 hover:bg-green-50"
            >
              Mark Active
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
          >
            Delete
          </button>
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
                  {formatEnum(s.placementType, PLACEMENT_TYPE_LABELS)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-neutral-400">Light Level</dt>
                <dd className="text-sm font-semibold text-neutral-900">
                  {formatEnum(s.lightLevel, LIGHT_LEVEL_LABELS)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-neutral-400">Watering</dt>
                <dd className="text-sm font-semibold text-neutral-900">
                  {formatEnum(s.wateringStrategy, WATERING_STRATEGY_LABELS)}
                </dd>
              </div>
              {s.humidityPreference && (
                <div>
                  <dt className="text-xs font-medium text-neutral-400">Humidity</dt>
                  <dd className="text-sm font-semibold text-neutral-900">
                    {formatEnum(s.humidityPreference, HUMIDITY_PREFERENCE_LABELS)}
                  </dd>
                </div>
              )}
              {s.growthSeasonStart && (
                <div>
                  <dt className="text-xs font-medium text-neutral-400">Growth Season Start</dt>
                  <dd className="text-sm font-semibold text-neutral-900">
                    {formatEnum(s.growthSeasonStart, SEASON_TYPE_LABELS)}
                  </dd>
                </div>
              )}
              {s.dormantSeasonStart && (
                <div>
                  <dt className="text-xs font-medium text-neutral-400">Dormant Season Start</dt>
                  <dd className="text-sm font-semibold text-neutral-900">
                    {formatEnum(s.dormantSeasonStart, SEASON_TYPE_LABELS)}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-500">
              Care Intervals
            </h3>
            <dl className="space-y-4 text-sm">
              {(s.wateringGrowingMinDays || s.wateringGrowingMaxDays) && (
                <div>
                  <dt className="text-xs font-medium text-neutral-400">Watering (Growing)</dt>
                  <dd className="font-semibold">
                    {s.wateringGrowingMinDays ?? "?"} to {s.wateringGrowingMaxDays ?? "?"} days
                  </dd>
                </div>
              )}
              {(s.wateringDormantMinDays || s.wateringDormantMaxDays) && (
                <div>
                  <dt className="text-xs font-medium text-neutral-400">Watering (Dormant)</dt>
                  <dd className="font-semibold">
                    {s.wateringDormantMinDays ?? "?"} to {s.wateringDormantMaxDays ?? "?"} days
                  </dd>
                </div>
              )}
              {(s.fertilizingGrowingMinDays || s.fertilizingGrowingMaxDays) && (
                <div>
                  <dt className="text-xs font-medium text-neutral-400">Fertilizing (Growing)</dt>
                  <dd className="font-semibold">
                    {s.fertilizingGrowingMinDays ?? "?"} to {s.fertilizingGrowingMaxDays ?? "?"} days
                  </dd>
                </div>
              )}
              {(s.repottingFrequencyMinMonths || s.repottingFrequencyMaxMonths) && (
                <div>
                  <dt className="text-xs font-medium text-neutral-400">Repotting Frequency</dt>
                  <dd className="font-semibold">
                    {s.repottingFrequencyMinMonths ?? "?"} to {s.repottingFrequencyMaxMonths ?? "?"} months
                  </dd>
                </div>
              )}
              {s.repottingSeason && (
                <div>
                  <dt className="text-xs font-medium text-neutral-400">Repotting Season</dt>
                  <dd className="font-semibold">{formatEnum(s.repottingSeason, SEASON_TYPE_LABELS)}</dd>
                </div>
              )}
              {s.pruningSeason && (
                <div>
                  <dt className="text-xs font-medium text-neutral-400">Pruning Season</dt>
                  <dd className="font-semibold">{formatEnum(s.pruningSeason, SEASON_TYPE_LABELS)}</dd>
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
                <p className="mt-2 text-xs text-red-600 font-bold">
                  DANGER: Absolute Min Temp is {s.absoluteTempMinC}°C
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
            <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-wrap">
              {s.description || "No description provided."}
            </p>
          </section>

          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h4 className="mb-2 text-sm font-bold text-neutral-900">Watering Notes</h4>
              <p className="text-sm text-neutral-600 whitespace-pre-wrap">
                {s.wateringNotes || "Standard watering based on strategy."}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h4 className="mb-2 text-sm font-bold text-neutral-900">Fertilizing Notes</h4>
              <p className="text-sm text-neutral-600 whitespace-pre-wrap">
                {s.fertilizingNotes || "No specific fertilizing notes."}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h4 className="mb-2 text-sm font-bold text-neutral-900">Repotting & Soil</h4>
              <div className="space-y-4">
                {s.repottingNotes && (
                  <div>
                    <h5 className="text-xs font-bold text-neutral-400 uppercase">Repotting</h5>
                    <p className="text-sm text-neutral-600 whitespace-pre-wrap">{s.repottingNotes}</p>
                  </div>
                )}
                {s.soilNotes && (
                  <div>
                    <h5 className="text-xs font-bold text-neutral-400 uppercase">Soil</h5>
                    <p className="text-sm text-neutral-600 whitespace-pre-wrap">{s.soilNotes}</p>
                  </div>
                )}
                {!s.repottingNotes && !s.soilNotes && (
                  <p className="text-sm text-neutral-600 italic">No specific notes.</p>
                )}
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h4 className="mb-2 text-sm font-bold text-neutral-900">Placement & Seasons</h4>
              <div className="space-y-4">
                {s.placementNotes && (
                  <div>
                    <h5 className="text-xs font-bold text-neutral-400 uppercase">Placement</h5>
                    <p className="text-sm text-neutral-600 whitespace-pre-wrap">{s.placementNotes}</p>
                  </div>
                )}
                {s.seasonNotes && (
                  <div>
                    <h5 className="text-xs font-bold text-neutral-400 uppercase">Seasons</h5>
                    <p className="text-sm text-neutral-600 whitespace-pre-wrap">{s.seasonNotes}</p>
                  </div>
                )}
                {!s.placementNotes && !s.seasonNotes && (
                  <p className="text-sm text-neutral-600 italic">No specific notes.</p>
                )}
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:col-span-2">
              <h4 className="mb-2 text-sm font-bold text-neutral-900">Pruning & Pest Control</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-bold text-neutral-400 uppercase">Pruning</h5>
                  <p className="text-sm text-neutral-600 whitespace-pre-wrap">
                    {s.pruningNotes || "No specific pruning notes."}
                  </p>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-400 uppercase">Pests</h5>
                  <p className="text-sm text-neutral-600 whitespace-pre-wrap">
                    {s.pestNotes || "No specific pest notes."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
