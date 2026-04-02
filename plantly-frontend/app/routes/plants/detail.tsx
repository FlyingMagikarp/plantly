import { Link, useLoaderData, Form, redirect, useSubmit } from "react-router";
import * as React from "react";
import { ConfirmationDialog } from "../../components/confirmation-dialog";
import type { Route } from "./+types/detail";

const API_URL = "http://localhost:8081";

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(`${API_URL}/plants/${params.id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Response("Plant Not Found", { status: 404 });
    }
    throw new Error("Failed to fetch plant");
  }
  return await response.json();
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "mark-dead") {
    const response = await fetch(`${API_URL}/plants/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "dead" }),
    });
    if (!response.ok) {
      throw new Error("Failed to mark plant as dead");
    }
    return null;
  }

  if (intent === "mark-removed") {
    const response = await fetch(`${API_URL}/plants/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "removed" }),
    });
    if (!response.ok) {
      throw new Error("Failed to mark plant as removed");
    }
    return null;
  }

  if (request.method === "DELETE" || intent === "delete") {
    const response = await fetch(`${API_URL}/plants/${params.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete plant");
    }

    return redirect("/plants");
  }

  return { error: "Method not allowed" };
}

export default function PlantDetail() {
  const plant = useLoaderData() as any;
  const submit = useSubmit();
  const [activeDialog, setActiveDialog] = React.useState<"dead" | "removed" | "delete" | null>(null);

  const handleConfirm = () => {
    if (!activeDialog) return;
    
    const intent = activeDialog === "delete" ? "delete" : `mark-${activeDialog}`;
    const method = activeDialog === "delete" ? "delete" : "post";
    
    submit({ intent }, { method });
    setActiveDialog(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
            {plant.nickname}
          </h2>
          <p className="text-lg text-neutral-500">
            {plant.species?.commonName} ({plant.species?.scientificName})
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/plants/${plant.id}/edit`}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            Edit
          </Link>

          {plant.status === "active" && (
            <>
              <button
                type="button"
                onClick={() => setActiveDialog("dead")}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 transition-colors"
              >
                Mark as Dead
              </button>
              <button
                type="button"
                onClick={() => setActiveDialog("removed")}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-600 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 transition-colors"
              >
                Given Away
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setActiveDialog("delete")}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors"
          >
            Delete Permanently
          </button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={activeDialog === "dead"}
        onClose={() => setActiveDialog(null)}
        onConfirm={handleConfirm}
        title="Mark as Dead"
        message={`Are you sure you want to mark "${plant.nickname}" as dead?`}
        confirmText="Mark as Dead"
        type="danger"
      />

      <ConfirmationDialog
        isOpen={activeDialog === "removed"}
        onClose={() => setActiveDialog(null)}
        onConfirm={handleConfirm}
        title="Mark as Given Away"
        message={`Are you sure you want to mark "${plant.nickname}" as given away / removed?`}
        confirmText="Confirm"
        type="warning"
      />

      <ConfirmationDialog
        isOpen={activeDialog === "delete"}
        onClose={() => setActiveDialog(null)}
        onConfirm={handleConfirm}
        title="Delete Plant Permanently"
        message={`Are you sure you want to permanently delete "${plant.nickname}"? This action cannot be undone.`}
        confirmText="Delete Permanently"
        type="danger"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Plant Info</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-neutral-500">Status</dt>
                <dd className="mt-1">
                   <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    plant.status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                    plant.status === 'dead' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                    'bg-gray-50 text-gray-700 ring-gray-600/20'
                  }`}>
                    {plant.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-500">Acquired At</dt>
                <dd className="mt-1 text-sm text-neutral-900">
                  {plant.acquiredAt ? new Date(plant.acquiredAt).toLocaleDateString() : 'Unknown'}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-neutral-500">Notes</dt>
                <dd className="mt-1 text-sm text-neutral-900 whitespace-pre-wrap">
                  {plant.notes || 'No notes provided.'}
                </dd>
              </div>
            </dl>
          </div>
          
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Care Information (Species)</h3>
             <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-neutral-500">Placement</dt>
                <dd className="mt-1 text-sm text-neutral-900">{plant.species?.placementType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-500">Light Level</dt>
                <dd className="mt-1 text-sm text-neutral-900">{plant.species?.lightLevel}</dd>
              </div>
               <div>
                <dt className="text-sm font-medium text-neutral-500">Watering Strategy</dt>
                <dd className="mt-1 text-sm text-neutral-900">{plant.species?.wateringStrategy}</dd>
              </div>
            </dl>
            <div className="mt-6">
               <Link
                to={`/species/${plant.speciesId}`}
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                View full species details &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
