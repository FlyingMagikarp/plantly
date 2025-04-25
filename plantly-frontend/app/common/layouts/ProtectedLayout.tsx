import { Outlet, redirect } from "react-router";
import { fetchUserData, getTokenFromRequest } from "~/auth/utils";
import type { Route } from "../../../.react-router/types/app/common/layouts/+types/ProtectedLayout";

export async function loader({ request }:Route.LoaderArgs){
  const token = getTokenFromRequest(request)

  if (!token) {
    throw redirect("/");
  }

  const user = await fetchUserData(token);

  if (!user) {
    throw redirect("/");
  }

  return { user };
}

export const ProtectedLayout = () => {
  return <Outlet />;
};

export default ProtectedLayout;