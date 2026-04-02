import type { Route } from "./+types/new";
import { redirect, useNavigation } from "react-router";
import { SpeciesForm } from "../../components/species-form";

const API_URL = "http://localhost:8081";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const response = await fetch(`${API_URL}/species`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create species");
  }

  const species = await response.json();
  return redirect(`/species/${species.id}`);
}

export default function SpeciesNew() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="mx-auto max-w-3xl">
      <SpeciesForm isSubmitting={isSubmitting} />
    </div>
  );
}
