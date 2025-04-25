import { Outlet, redirect } from "react-router";
import { fetchUserData, getTokenFromRequest } from "~/auth/utils";
import type { Route } from "../../../.react-router/types/app/common/layouts/+types/AuthLayout";

export async function loader({ request }:Route.LoaderArgs){
  const token = getTokenFromRequest(request)

  if (!token) {
    return null;
  }

  const user = await fetchUserData(token);

  if (user) {
    throw redirect("/overview");
  }

  return null;
}

export const AuthLayout = () => {
  return <Outlet />;
};
