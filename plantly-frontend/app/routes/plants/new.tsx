import { redirect, useNavigation, useLoaderData, useActionData } from "react-router";
import type { Route } from "./+types/new";
import { PlantForm } from "../../components/plant-form";
import { useToast } from "../../components/toast";
import { useEffect } from "react";

const API_URL = "http://localhost:8081";

export async function loader() {
  const response = await fetch(`${API_URL}/species?onlyActive=true`);
  if (!response.ok) {
    throw new Error("Could not fetch species");
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
    return { errors: errorData.message || "Could not create plant" };
  }

  return redirect("/plants?success=plant-created");
}

export default function NewPlant() {
  const species = useLoaderData() as any[];
  const navigation = useNavigation();
  const actionData = useActionData() as any;
  const { success, error } = useToast();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.errors) {
      error(actionData.errors);
    }
  }, [actionData, error]);

  return (
    <div className="mx-auto max-w-2xl">
      <PlantForm species={species} isSubmitting={isSubmitting} />
    </div>
  );
}
