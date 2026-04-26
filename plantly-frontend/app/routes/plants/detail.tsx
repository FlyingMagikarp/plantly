import { Link, useLoaderData, Form, redirect, useSubmit, useActionData, useSearchParams } from "react-router";
import * as React from "react";
import { ConfirmationDialog } from "../../components/confirmation-dialog";
import type { Route } from "./+types/detail";
import { useToast } from "../../components/toast";
import { API_BASE_URL } from "../../config";
import {
  PLANT_STATUS_LABELS,
  PLACEMENT_TYPE_LABELS,
  LIGHT_LEVEL_LABELS,
  WATERING_STRATEGY_LABELS,
  CARE_LOG_TYPE_LABELS,
  formatEnum,
} from "../../utils/enum-mappings";

const API_URL = API_BASE_URL;

export async function loader({ params }: Route.LoaderArgs) {
  const [plantResponse, careLogsResponse] = await Promise.all([
    fetch(`${API_URL}/plants/${params.id}`),
    fetch(`${API_URL}/plants/${params.id}/care-logs`),
  ]);
  
  if (!plantResponse.ok) {
    if (plantResponse.status === 404) {
      throw new Response("Plant Not Found", { status: 404 });
    }
    throw new Error("Could not fetch plant");
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
      return { error: errorData.message || "Could not add care log" };
    }
    return { success: true, message: "Care log added" };
  }

  if (intent === "delete-care-log") {
    const id = formData.get("id");
    const response = await fetch(`${API_URL}/plants/${params.id}/care-logs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Could not delete care log" };
    }
    return { success: true, message: "Care log deleted" };
  }

  if (intent === "mark-dead") {
    const response = await fetch(`${API_URL}/plants/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "dead" }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Could not mark plant as dead" };
    }
    return { success: true, message: "Plant marked as dead" };
  }

  if (intent === "mark-removed") {
    const response = await fetch(`${API_URL}/plants/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "removed" }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Could not mark plant as removed" };
    }
    return { success: true, message: "Plant marked as removed" };
  }

  if (intent === "upload-images") {
    const files = formData.getAll("files") as File[];
    const uploadFormData = new FormData();
    files.forEach((file) => uploadFormData.append("files", file));

    const response = await fetch(`${API_URL}/plants/${params.id}/images`, {
      method: "POST",
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Could not upload images" };
    }
    return { success: true, message: "Images uploaded" };
  }

  if (intent === "update-image") {
    const imageId = formData.get("imageId");
    const caption = formData.get("caption");
    const imageDate = formData.get("imageDate");
    const isPrimary = formData.get("isPrimary") === "true";

    const response = await fetch(`${API_URL}/plants/images/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption, imageDate, isPrimary }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Could not update image" };
    }
    return { success: true, message: "Image updated" };
  }

  if (intent === "delete-image") {
    const imageId = formData.get("imageId");
    const response = await fetch(`${API_URL}/plants/images/${imageId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Could not delete image" };
    }
    return { success: true, message: "Image deleted" };
  }

  if (request.method === "DELETE" || intent === "delete") {
    const response = await fetch(`${API_URL}/plants/${params.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Could not delete plant" };
    }

    return redirect("/plants?success=plant-deleted");
  }

  return { error: "Method not allowed" };
}

export default function PlantDetail() {
  const { plant, careLogs } = useLoaderData() as any;
  const submit = useSubmit();
  const actionData = useActionData() as any;
  const { success, error } = useToast();
  const [searchParams] = useSearchParams();
  const notifiedRef = React.useRef(false);

  const [activeDialog, setActiveDialog] = React.useState<"dead" | "removed" | "delete" | null>(null);
  const [logToDelete, setLogToDelete] = React.useState<any>(null);
  const [imageToDelete, setImageToDelete] = React.useState<any>(null);
  const [editingImage, setEditingImage] = React.useState<any>(null);
  const [isAddingLog, setIsAddingLog] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const uploadFormRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (actionData?.success) {
      setIsAddingLog(false);
      setIsUploading(false);
      setEditingImage(null);
      if (actionData.message) {
        success(actionData.message);
      }
    } else if (actionData?.error) {
      error(actionData.error);
    }
  }, [actionData, success, error]);

  React.useEffect(() => {
    if (notifiedRef.current) return;
    const successType = searchParams.get("success");
    if (successType === "plant-updated") {
      success("Plant updated");
      notifiedRef.current = true;
    }
  }, [searchParams, success]);

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

  const handleDeleteImage = () => {
    if (!imageToDelete) return;
    submit(
      { intent: "delete-image", imageId: imageToDelete.id },
      { method: "post" }
    );
    setImageToDelete(null);
  };

  const handleSetPrimary = (imageId: string) => {
    submit(
      { intent: "update-image", imageId, isPrimary: "true" },
      { method: "post" }
    );
  };

  const careTypeIcons: Record<string, React.ReactNode> = {
    WATER: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2M4 13h2m7 4h.01m-4 0h.01m8 0h.01M12 4v16" />
      </svg>
    ),
    FERTILIZE: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m12 14a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    PRUNE: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758L5 19m0-14l4.121 4.121" />
      </svg>
    ),
    REPOT: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    CHECK: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    MOVE_INSIDE: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    MOVE_OUTSIDE: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
    PEST_TREATMENT: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
      </svg>
    ),
  };

  const primaryImage = plant.images?.find((img: any) => img.isPrimary) || plant.images?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="h-32 w-32 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 flex-shrink-0 shadow-sm">
            {primaryImage ? (
              <img 
                src={`${API_URL}/plants/images/${primaryImage.id}`} 
                alt={plant.nickname} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-neutral-400">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
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
                <input type="hidden" name="date" value={(() => {
                  const now = new Date();
                  const offset = now.getTimezoneOffset() * 60000;
                  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
                })()} />
                <button
                  type="submit"
                  name="type"
                  value="WATER"
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all shadow-sm active:transform active:scale-95"
                >
                  <span className="text-blue-500">{careTypeIcons.WATER}</span>
                  Water
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
                  value="FERTILIZE"
                  className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700 border border-orange-100 hover:bg-orange-100 transition-all shadow-sm active:transform active:scale-95"
                >
                  <span className="text-orange-500">{careTypeIcons.FERTILIZE}</span>
                  Fertilize
                </button>
                <button
                  type="submit"
                  name="type"
                  value="PRUNE"
                  className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-4 py-2 text-sm font-bold text-purple-700 border border-purple-100 hover:bg-purple-100 transition-all shadow-sm active:transform active:scale-95"
                >
                  <span className="text-purple-500">{careTypeIcons.PRUNE}</span>
                  Prune
                </button>
                <button
                  type="submit"
                  name="type"
                  value="REPOT"
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 border border-amber-100 hover:bg-amber-100 transition-all shadow-sm active:transform active:scale-95"
                >
                  <span className="text-amber-500">{careTypeIcons.REPOT}</span>
                  Repot
                </button>
                <button
                  type="submit"
                  name="type"
                  value="MOVE_INSIDE"
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-all shadow-sm active:transform active:scale-95"
                >
                  <span className="text-indigo-500">{careTypeIcons.MOVE_INSIDE}</span>
                  In
                </button>
                <button
                  type="submit"
                  name="type"
                  value="MOVE_OUTSIDE"
                  className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700 border border-yellow-100 hover:bg-yellow-100 transition-all shadow-sm active:transform active:scale-95"
                >
                  <span className="text-yellow-500">{careTypeIcons.MOVE_OUTSIDE}</span>
                  Out
                </button>
                <button
                  type="submit"
                  name="type"
                  value="PEST_TREATMENT"
                  className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700 border border-red-100 hover:bg-red-100 transition-all shadow-sm active:transform active:scale-95"
                >
                  <span className="text-red-500">{careTypeIcons.PEST_TREATMENT}</span>
                  Pest
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

      <ConfirmationDialog
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={handleDeleteImage}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete Image"
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

          {/* Plant Gallery Section */}
          <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">Plant Gallery</h3>
              <button
                type="button"
                onClick={() => setIsUploading(!isUploading)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  isUploading 
                    ? 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isUploading ? 'Cancel' : (
                  <>
                    <svg className="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Photos
                  </>
                )}
              </button>
            </div>
            <div className="p-6">
              {isUploading && (
                <Form 
                  method="post" 
                  encType="multipart/form-data" 
                  className="mb-8 p-6 border-2 border-dashed border-green-200 rounded-2xl bg-green-50/30"
                  ref={uploadFormRef}
                >
                  <input type="hidden" name="intent" value="upload-images" />
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center">
                      <label 
                        htmlFor="files" 
                        className="cursor-pointer bg-white px-4 py-2 rounded-lg border border-neutral-300 shadow-sm text-sm font-semibold hover:bg-neutral-50"
                      >
                        Select Photos
                      </label>
                      <input 
                        type="file" 
                        id="files" 
                        name="files" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <p className="mt-2 text-xs text-neutral-500">Support for multiple JPG, PNG, WEBP</p>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white rounded-xl py-2.5 font-bold shadow-md hover:bg-green-500 transition-all active:scale-[0.98]"
                    >
                      Upload Selected Photos
                    </button>
                  </div>
                </Form>
              )}

              {editingImage && (
                <Form method="post" className="mb-8 p-6 border border-amber-200 rounded-2xl bg-amber-50/30 space-y-4">
                  <input type="hidden" name="intent" value="update-image" />
                  <input type="hidden" name="imageId" value={editingImage.id} />
                  <h4 className="font-bold text-amber-900 text-sm">Edit Image Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">Caption</label>
                      <input 
                        type="text" 
                        name="caption" 
                        defaultValue={editingImage.caption || ''} 
                        className="w-full rounded-lg border-amber-200 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">Date Taken</label>
                      <input 
                        type="date" 
                        name="imageDate" 
                        defaultValue={editingImage.imageDate ? editingImage.imageDate.split('T')[0] : ''} 
                        className="w-full rounded-lg border-amber-200 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="editIsPrimary" 
                      name="isPrimary" 
                      value="true" 
                      defaultChecked={editingImage.isPrimary}
                      className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="editIsPrimary" className="text-sm font-medium text-amber-900">Make Primary Image</label>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-amber-600 text-white rounded-lg py-2 text-sm font-bold">Save Changes</button>
                    <button type="button" onClick={() => setEditingImage(null)} className="flex-1 bg-white border border-amber-200 rounded-lg py-2 text-sm font-bold text-amber-900">Cancel</button>
                  </div>
                </Form>
              )}

              {!plant.images || plant.images.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-neutral-100 rounded-2xl">
                  <p className="text-sm text-neutral-400">No photos yet. Add some to track growth!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {plant.images.map((img: any) => (
                    <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-sm">
                      <img 
                        src={`${API_URL}/plants/images/${img.id}`} 
                        alt={img.caption || plant.nickname} 
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                      {img.isPrimary && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm">
                          PRIMARY
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setEditingImage(img)}
                          className="p-1.5 bg-white rounded-full text-neutral-700 hover:text-green-600 shadow-sm"
                          title="Edit"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        {!img.isPrimary && (
                          <button 
                            onClick={() => handleSetPrimary(img.id)}
                            className="p-1.5 bg-white rounded-full text-neutral-700 hover:text-blue-600 shadow-sm"
                            title="Set as Primary"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button 
                          onClick={() => setImageToDelete(img)}
                          className="p-1.5 bg-white rounded-full text-neutral-700 hover:text-red-600 shadow-sm"
                          title="Delete"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      {img.caption && (
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white p-1 text-[10px] truncate">
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ))}
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
                      defaultValue={(() => {
                        const now = new Date();
                        const offset = now.getTimezoneOffset() * 60000;
                        const localISODate = new Date(now.getTime() - offset).toISOString().slice(0, 16);
                        return localISODate;
                      })()}
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
                                log.type === 'WATER' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                log.type === 'FERTILIZE' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                log.type === 'PRUNE' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                log.type === 'REPOT' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                log.type === 'MOVE_INSIDE' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                log.type === 'MOVE_OUTSIDE' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                log.type === 'PEST_TREATMENT' ? 'bg-red-50 text-red-600 border-red-100' :
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
