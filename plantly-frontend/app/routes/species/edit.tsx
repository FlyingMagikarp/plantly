import type { Route } from "./+types/edit";
import { redirect, useLoaderData, useNavigation } from "react-router";
import { SpeciesForm } from "../../components/species-form";

const API_URL = "http://localhost:8081";

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(`${API_URL}/species/${params.id}`);
  if (!response.ok) {
    throw new Error("Species not found");
  }
  return await response.json();
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const data: any = Object.fromEntries(formData);

  // Clean up empty strings for optional fields and convert numbers
  const numericFields = [
    "wateringGrowingMinDays",
    "wateringGrowingMaxDays",
    "wateringDormantMinDays",
    "wateringDormantMaxDays",
    "fertilizingGrowingMinDays",
    "fertilizingGrowingMaxDays",
    "repottingFrequencyMinMonths",
    "repottingFrequencyMaxMonths",
  ];

  for (const key in data) {
    if (data[key] === "") {
      data[key] = null; // Use null for PATCH to clear values if needed
    } else if (numericFields.includes(key)) {
      data[key] = parseInt(data[key], 10);
    }
  }

  const response = await fetch(`${API_URL}/species/${params.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update species");
  }

  return redirect(`/species/${params.id}`);
}

export default function SpeciesEdit() {
  const species = useLoaderData() as any;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="mx-auto max-w-3xl">
      <SpeciesForm species={species} isSubmitting={isSubmitting} />
    </div>
  );
}
