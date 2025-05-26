import type {
  Route
} from "../../../../../.react-router/types/app/features/careLog/routes/resources/+types/DeleteCareLogRoute";
import {getTokenFromRequest} from "~/auth/utils";

export async function action({ request }: Route.ActionArgs) {
  const token = getTokenFromRequest(request);
  const formData = await request.formData();
}