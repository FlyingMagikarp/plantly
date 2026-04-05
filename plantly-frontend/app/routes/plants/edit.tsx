import { redirect, useNavigation, useLoaderData, useActionData } from "react-router";
import type { Route } from "./+types/edit";
import { PlantForm } from "../../components/plant-form";
import { useToast } from "../../components/toast";
import { useEffect } from "react";

const API_URL = "http://localhost:8081";

export async function loader({ params }: Route.LoaderArgs) {
  const [plantResponse, speciesResponse] = await Promise.all([
    fetch(`${API_URL}/plants/${params.id}`),
    fetch(`${API_URL}/species?onlyActive=true`),
  ]);

  if (!plantResponse.ok || !speciesResponse.ok) {
    throw new Error("Could not fetch data");
  }

  return {
    plant: await plantResponse.json(),
    species: await speciesResponse.json(),
  };
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const response = await fetch(`${API_URL}/plants/${params.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { errors: errorData.message || "Could not update plant" };
  }

  return redirect(`/plants/${params.id}?success=plant-updated`);
}

export default function EditPlant() {
  const { plant, species } = useLoaderData() as { plant: any; species: any[] };
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
    <div className="mx-auto max-w-2xl">
      <PlantForm plant={plant} species={species} isSubmitting={isSubmitting} />
    </div>
  );
}
