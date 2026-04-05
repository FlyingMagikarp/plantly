import type { Route } from "./+types/edit";
import { redirect, useLoaderData, useNavigation, useActionData } from "react-router";
import { SpeciesForm } from "../../components/species-form";
import { useToast } from "../../components/toast";
import { useEffect } from "react";

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
    return { errors: errorData.message || "Could not update species" };
  }

  return redirect(`/species/${params.id}?success=species-updated`);
}

export default function SpeciesEdit() {
  const species = useLoaderData() as any;
  const navigation = useNavigation();
  const actionData = useActionData() as any;
  const { error } = useToast();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.errors) {
      error(actionData.errors);
    }
  }, [actionData, error]);

  return (
    <div className="mx-auto max-w-3xl">
      <SpeciesForm species={species} isSubmitting={isSubmitting} />
    </div>
  );
}
