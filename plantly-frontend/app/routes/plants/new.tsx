import { redirect, useNavigation, useLoaderData } from "react-router";
import type { Route } from "./+types/new";
import { PlantForm } from "../../components/plant-form";

const API_URL = "http://localhost:8081";

export async function loader() {
  const response = await fetch(`${API_URL}/species`);
  if (!response.ok) {
    throw new Error("Failed to fetch species");
  }
  return await response.json();
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const response = await fetch(`${API_URL}/plants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { errors: errorData.message || "Failed to create plant" };
  }

  return redirect("/plants");
}

export default function NewPlant() {
  const species = useLoaderData() as any[];
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="mx-auto max-w-2xl">
      <PlantForm species={species} isSubmitting={isSubmitting} />
    </div>
  );
}
