import { redirect, useNavigation, useLoaderData } from "react-router";
import type { Route } from "./+types/edit";
import { PlantForm } from "../../components/plant-form";

const API_URL = "http://localhost:8081";

export async function loader({ params }: Route.LoaderArgs) {
  const [plantResponse, speciesResponse] = await Promise.all([
    fetch(`${API_URL}/plants/${params.id}`),
    fetch(`${API_URL}/species`),
  ]);

  if (!plantResponse.ok || !speciesResponse.ok) {
    throw new Error("Failed to fetch data");
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
    return { errors: errorData.message || "Failed to update plant" };
  }

  return redirect(`/plants/${params.id}`);
}

export default function EditPlant() {
  const { plant, species } = useLoaderData() as { plant: any; species: any[] };
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="mx-auto max-w-2xl">
      <PlantForm plant={plant} species={species} isSubmitting={isSubmitting} />
    </div>
  );
}
