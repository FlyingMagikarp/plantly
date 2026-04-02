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
  const data = Object.fromEntries(formData);

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
