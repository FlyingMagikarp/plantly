import { Link, useLoaderData, Form, redirect, useSubmit, useActionData } from "react-router";
import * as React from "react";
import { ConfirmationDialog } from "../../components/confirmation-dialog";
import type { Route } from "./+types/detail";
import {
  PLANT_STATUS_LABELS,
  PLACEMENT_TYPE_LABELS,
  LIGHT_LEVEL_LABELS,
  WATERING_STRATEGY_LABELS,
  CARE_LOG_TYPE_LABELS,
  formatEnum,
} from "../../utils/enum-mappings";

const API_URL = "http://localhost:8081";

export async function loader({ params }: Route.LoaderArgs) {
  const [plantResponse, careLogsResponse] = await Promise.all([
    fetch(`${API_URL}/plants/${params.id}`),
    fetch(`${API_URL}/plants/${params.id}/care-logs`),
  ]);

  if (!plantResponse.ok) {
    if (plantResponse.status === 404) {
      throw new Response("Plant Not Found", { status: 404 });
    }
    throw new Error("Failed to fetch plant");
  }

  const plant = await plantResponse.json();
  const careLogs = careLogsResponse.ok ? await careLogsResponse.json() : [];

  return { plant, careLogs };
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add-care-log") {
    const type = formData.get("type");
    const date = formData.get("date");
    const note = formData.get("note");

    const response = await fetch(`${API_URL}/plants/${params.id}/care-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, date, note }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Failed to add care log" };
    }
    return { success: true };
  }

  if (intent === "delete-care-log") {
    const id = formData.get("id");
    const response = await fetch(`${API_URL}/plants/${params.id}/care-logs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete care log");
    }
    return { success: true };
  }

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
  const { plant, careLogs } = useLoaderData() as any;
  const submit = useSubmit();
  const actionData = useActionData() as any;
  const [activeDialog, setActiveDialog] = React.useState<"dead" | "removed" | "delete" | null>(null);
  const [logToDelete, setLogToDelete] = React.useState<any>(null);
  const [isAddingLog, setIsAddingLog] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (actionData?.success) {
      setIsAddingLog(false);
    }
  }, [actionData]);

  React.useEffect(() => {
    if (!isAddingLog && formRef.current) {
      formRef.current.reset();
    }
  }, [isAddingLog]);

  const handleConfirm = () => {
    if (!activeDialog) return;
    
    const intent = activeDialog === "delete" ? "delete" : `mark-${activeDialog}`;
    const method = activeDialog === "delete" ? "delete" : "post";
    
    submit({ intent }, { method });
    setActiveDialog(null);
  };

  const handleDeleteLog = () => {
    if (!logToDelete) return;
    submit(
      { intent: "delete-care-log", id: logToDelete.id },
      { method: "post" }
    );
    setLogToDelete(null);
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

      <ConfirmationDialog
        isOpen={!!logToDelete}
        onClose={() => setLogToDelete(null)}
        onConfirm={handleDeleteLog}
        title="Delete Care Log"
        message="Are you sure you want to delete this care log entry? This action cannot be undone."
        confirmText="Delete Log"
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
                    {formatEnum(plant.status, PLANT_STATUS_LABELS)}
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
                <dd className="mt-1 text-sm text-neutral-900">{formatEnum(plant.species?.placementType, PLACEMENT_TYPE_LABELS)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-500">Light Level</dt>
                <dd className="mt-1 text-sm text-neutral-900">{formatEnum(plant.species?.lightLevel, LIGHT_LEVEL_LABELS)}</dd>
              </div>
               <div>
                <dt className="text-sm font-medium text-neutral-500">Watering Strategy</dt>
                <dd className="mt-1 text-sm text-neutral-900">{formatEnum(plant.species?.wateringStrategy, WATERING_STRATEGY_LABELS)}</dd>
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

        <div className="lg:col-span-1 space-y-8">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900">Care History</h3>
              <button
                type="button"
                onClick={() => setIsAddingLog(!isAddingLog)}
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                {isAddingLog ? 'Cancel' : 'Add Log'}
              </button>
            </div>

            {isAddingLog && (
              <Form method="post" ref={formRef} className="mb-6 space-y-4 p-4 rounded-lg bg-neutral-50 border border-neutral-100">
                <input type="hidden" name="intent" value="add-care-log" />
                <div>
                  <label htmlFor="type" className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</label>
                  <select
                    name="type"
                    id="type"
                    required
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm"
                  >
                    {Object.entries(CARE_LOG_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="date" className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</label>
                  <input
                    type="datetime-local"
                    name="date"
                    id="date"
                    required
                    defaultValue={new Date().toISOString().slice(0, 16)}
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="note" className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">Note (Optional)</label>
                  <textarea
                    name="note"
                    id="note"
                    rows={2}
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
                >
                  Save Log
                </button>
              </Form>
            )}

            <div className="flow-root">
              {careLogs.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-4">No care logs yet.</p>
              ) : (
                <ul className="-mb-8">
                  {careLogs.map((log: any, logIdx: number) => (
                    <li key={log.id}>
                      <div className="relative pb-8">
                        {logIdx !== careLogs.length - 1 ? (
                          <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-neutral-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
                              <span className="h-2 w-2 rounded-full bg-green-600" />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                {formatEnum(log.type, CARE_LOG_TYPE_LABELS)}
                              </p>
                              {log.note && (
                                <p className="mt-1 text-sm text-neutral-600 italic">
                                  "{log.note}"
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <time className="whitespace-nowrap text-xs text-neutral-500">
                                {new Date(log.date).toLocaleDateString()}
                                <br />
                                {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </time>
                              <button
                                type="button"
                                onClick={() => setLogToDelete(log)}
                                className="text-xs text-red-400 hover:text-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
