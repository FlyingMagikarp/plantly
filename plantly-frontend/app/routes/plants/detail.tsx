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

  const careTypeIcons: Record<string, React.ReactNode> = {
    WATERING: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2M4 13h2m7 4h.01m-4 0h.01m8 0h.01M12 4v16" />
      </svg>
    ),
    FERTILIZING: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m12 14a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    PRUNING: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758L5 19m0-14l4.121 4.121" />
      </svg>
    ),
    REPOTTING: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    CHECK: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              {plant.nickname}
            </h2>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
              plant.status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
              plant.status === 'dead' ? 'bg-red-50 text-red-700 ring-red-600/20' :
              'bg-neutral-50 text-neutral-700 ring-neutral-600/20'
            }`}>
              {formatEnum(plant.status, PLANT_STATUS_LABELS)}
            </span>
          </div>
          <p className="text-xl text-neutral-500 font-medium">
            {plant.species?.commonName} <span className="text-neutral-400 font-normal italic ml-1">({plant.species?.scientificName})</span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/plants/${plant.id}/edit`}
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>

          {plant.status === "active" && (
            <>
              <button
                type="button"
                onClick={() => setActiveDialog("dead")}
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 transition-colors"
              >
                Mark as Dead
              </button>
              <button
                type="button"
                onClick={() => setActiveDialog("removed")}
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-600 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 transition-colors"
              >
                Given Away
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setActiveDialog("delete")}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Quick Actions Bar */}
      {plant.status === "active" && (
        <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider whitespace-nowrap">
              Quick Care:
            </h3>
            <div className="flex flex-wrap gap-2">
              <Form method="post" className="contents">
                <input type="hidden" name="intent" value="add-care-log" />
                <input type="hidden" name="date" value={new Date().toISOString().slice(0, 16)} />
                <button
                  type="submit"
                  name="type"
                  value="WATERING"
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all shadow-sm active:transform active:scale-95"
                >
                  <span className="text-blue-500">{careTypeIcons.WATERING}</span>
                  Watering
                </button>
                <button
                  type="submit"
                  name="type"
                  value="CHECK"
                  className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700 border border-green-100 hover:bg-green-100 transition-all shadow-sm active:transform active:scale-95"
                >
                  <span className="text-green-500">{careTypeIcons.CHECK}</span>
                  Check
                </button>
                <button
                  type="submit"
                  name="type"
                  value="FERTILIZING"
                  className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700 border border-orange-100 hover:bg-orange-100 transition-all shadow-sm active:transform active:scale-95"
                >
                  <span className="text-orange-500">{careTypeIcons.FERTILIZING}</span>
                  Fertilizing
                </button>
                <button
                  type="submit"
                  name="type"
                  value="PRUNING"
                  className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-4 py-2 text-sm font-bold text-purple-700 border border-purple-100 hover:bg-purple-100 transition-all shadow-sm active:transform active:scale-95"
                >
                  <span className="text-purple-500">{careTypeIcons.PRUNING}</span>
                  Pruning
                </button>
                <button
                  type="submit"
                  name="type"
                  value="REPOTTING"
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 border border-amber-100 hover:bg-amber-100 transition-all shadow-sm active:transform active:scale-95"
                >
                  <span className="text-amber-500">{careTypeIcons.REPOTTING}</span>
                  Repotting
                </button>
              </Form>
            </div>
          </div>
        </section>
      )}

      <ConfirmationDialog
        isOpen={activeDialog === "dead"}
        onClose={() => setActiveDialog(null)}
        onConfirm={handleConfirm}
        title="Mark as Dead"
        message={`Are you sure you want to mark "${plant.nickname}" as dead? This will stop future reminders.`}
        confirmText="Mark as Dead"
        type="danger"
      />

      <ConfirmationDialog
        isOpen={activeDialog === "removed"}
        onClose={() => setActiveDialog(null)}
        onConfirm={handleConfirm}
        title="Mark as Given Away"
        message={`Are you sure you want to mark "${plant.nickname}" as given away or removed from your collection?`}
        confirmText="Confirm"
        type="warning"
      />

      <ConfirmationDialog
        isOpen={activeDialog === "delete"}
        onClose={() => setActiveDialog(null)}
        onConfirm={handleConfirm}
        title="Delete Plant Permanently"
        message={`Are you sure you want to permanently delete "${plant.nickname}"? This action cannot be undone and all care history will be lost.`}
        confirmText="Delete Permanently"
        type="danger"
      />

      <ConfirmationDialog
        isOpen={!!logToDelete}
        onClose={() => setLogToDelete(null)}
        onConfirm={handleDeleteLog}
        title="Delete Care Log"
        message="Are you sure you want to delete this care log entry?"
        confirmText="Delete Log"
        type="danger"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Info and Species */}
        <div className="lg:col-span-2 space-y-8">
          {/* Plant Info Card */}
          <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
              <h3 className="text-lg font-bold text-neutral-900">Plant Overview</h3>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Acquired On</dt>
                  <dd className="mt-2 text-base text-neutral-900 flex items-center">
                    <svg className="h-5 w-5 text-neutral-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {plant.acquiredAt ? new Date(plant.acquiredAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Unknown date'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Last Activity</dt>
                  <dd className="mt-2 text-base text-neutral-900 flex items-center">
                    <svg className="h-5 w-5 text-neutral-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {careLogs.length > 0 
                      ? new Date(careLogs[0].date).toLocaleDateString(undefined, { dateStyle: 'medium' })
                      : 'No activity recorded'}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Personal Notes</dt>
                  <dd className="mt-2 text-base text-neutral-900 bg-neutral-50 rounded-lg p-4 border border-neutral-100 min-h-[100px] whitespace-pre-wrap italic">
                    {plant.notes || 'No personal notes for this plant yet. Use notes to track its specific location, soil mix, or personality!'}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
          
          {/* Species Info Card */}
          <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-neutral-900">Species Care Guide</h3>
              <Link
                to={`/species/${plant.speciesId}`}
                className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center"
              >
                Full Guide
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="flex flex-col items-center p-4 rounded-xl bg-blue-50/50 text-center">
                  <span className="text-blue-600 mb-2">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                  <dt className="text-xs font-bold text-blue-800 uppercase tracking-tighter mb-1">Placement</dt>
                  <dd className="text-sm font-medium text-neutral-900">{formatEnum(plant.species?.placementType, PLACEMENT_TYPE_LABELS)}</dd>
                </div>
                
                <div className="flex flex-col items-center p-4 rounded-xl bg-orange-50/50 text-center">
                  <span className="text-orange-600 mb-2">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                  </span>
                  <dt className="text-xs font-bold text-orange-800 uppercase tracking-tighter mb-1">Light</dt>
                  <dd className="text-sm font-medium text-neutral-900">{formatEnum(plant.species?.lightLevel, LIGHT_LEVEL_LABELS)}</dd>
                </div>

                <div className="flex flex-col items-center p-4 rounded-xl bg-cyan-50/50 text-center">
                  <span className="text-cyan-600 mb-2">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2M4 13h2m7 4h.01m-4 0h.01m8 0h.01M12 4v16" />
                    </svg>
                  </span>
                  <dt className="text-xs font-bold text-cyan-800 uppercase tracking-tighter mb-1">Watering</dt>
                  <dd className="text-sm font-medium text-neutral-900">{formatEnum(plant.species?.wateringStrategy, WATERING_STRATEGY_LABELS)}</dd>
                </div>
              </div>

              {plant.species?.description && (
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {plant.species.description}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Care History Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-lg font-bold text-neutral-900">Care History</h3>
              <button
                type="button"
                onClick={() => setIsAddingLog(!isAddingLog)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  isAddingLog 
                    ? 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isAddingLog ? 'Cancel' : (
                  <>
                    <svg className="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    New Log
                  </>
                )}
              </button>
            </div>

            <div className="p-6 flex-grow">
              {isAddingLog && (
                <Form method="post" ref={formRef} className="mb-8 space-y-4 p-5 rounded-xl bg-green-50/30 border border-green-100 shadow-inner animate-in fade-in slide-in-from-top-2 duration-300">
                  <input type="hidden" name="intent" value="add-care-log" />
                  <div>
                    <label htmlFor="type" className="block text-[10px] font-bold text-green-800 uppercase tracking-widest mb-1">Care Type</label>
                    <select
                      name="type"
                      id="type"
                      required
                      className="block w-full rounded-lg border-green-200 bg-white py-2 text-sm text-neutral-900 focus:border-green-500 focus:ring-green-500 transition-shadow"
                    >
                      {Object.entries(CARE_LOG_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-[10px] font-bold text-green-800 uppercase tracking-widest mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      name="date"
                      id="date"
                      required
                      defaultValue={new Date().toISOString().slice(0, 16)}
                      className="block w-full rounded-lg border-green-200 bg-white py-2 text-sm text-neutral-900 focus:border-green-500 focus:ring-green-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="note" className="block text-[10px] font-bold text-green-800 uppercase tracking-widest mb-1">Optional Note</label>
                    <textarea
                      name="note"
                      id="note"
                      rows={2}
                      placeholder="How is she doing?"
                      className="block w-full rounded-lg border-green-200 bg-white py-2 text-sm text-neutral-900 focus:border-green-500 focus:ring-green-500 transition-shadow"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-green-500 hover:shadow-lg active:transform active:scale-[0.98] transition-all"
                  >
                    Save Activity
                  </button>
                </Form>
              )}

              <div className="flow-root">
                {careLogs.length === 0 ? (
                  <div className="text-center py-12 px-4 border-2 border-dashed border-neutral-100 rounded-2xl">
                    <div className="mx-auto w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mb-3">
                      <svg className="h-6 w-6 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900">No care logs yet</h4>
                    <p className="mt-1 text-xs text-neutral-500">Start tracking {plant.nickname}'s care journey today.</p>
                  </div>
                ) : (
                  <ul className="-mb-8">
                    {careLogs.map((log: any, logIdx: number) => (
                      <li key={log.id}>
                        <div className="relative pb-8">
                          {logIdx !== careLogs.length - 1 ? (
                            <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-neutral-100" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex items-start space-x-4">
                            <div className="relative">
                              <span className={`h-10 w-10 rounded-xl flex items-center justify-center ring-4 ring-white shadow-sm border ${
                                log.type === 'WATERING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                log.type === 'FERTILIZING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                log.type === 'PRUNING' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                log.type === 'REPOTTING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-green-50 text-green-600 border-green-100'
                              }`}>
                                {careTypeIcons[log.type] || careTypeIcons.CHECK}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 py-0.5">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-bold text-neutral-900 leading-none">
                                    {formatEnum(log.type, CARE_LOG_TYPE_LABELS)}
                                  </p>
                                  <p className="mt-1 text-[11px] font-medium text-neutral-400 uppercase tracking-tighter">
                                    {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} @ {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setLogToDelete(log)}
                                  className="text-neutral-300 hover:text-red-500 transition-colors p-1"
                                  title="Delete log"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                              {log.note && (
                                <div className="mt-2 text-sm text-neutral-600 bg-neutral-50/50 p-2 rounded-lg border border-neutral-100/50 italic">
                                  {log.note}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
