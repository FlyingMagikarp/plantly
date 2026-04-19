import { API_BASE_URL } from "../../config";
import type { Route } from "./+types/new";
import { redirect, useNavigation, useActionData } from "react-router";
import { SpeciesForm } from "../../components/species-form";
import { useToast } from "../../components/toast";
import { useEffect } from "react";

const API_URL = API_BASE_URL;

export async function action({ request }: Route.ActionArgs) {
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
      delete data[key];
    } else if (numericFields.includes(key)) {
      data[key] = parseInt(data[key], 10);
    }
  }

  const response = await fetch(`${API_URL}/species`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { errors: errorData.message || "Could not create species" };
  }

  const species = await response.json();
  return redirect(`/species/${species.id}?success=species-created`);
}

export default function SpeciesNew() {
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
      <SpeciesForm isSubmitting={isSubmitting} />
    </div>
  );
}
