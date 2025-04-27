import { Outlet, redirect } from "react-router";
import { fetchUserData, getTokenFromRequest } from "~/auth/utils";
import type { Route } from "../../../.react-router/types/app/common/layouts/+types/ProtectedLayout";
import Navbar from "~/common/components/Navbar";
import { USER_ROLE_ADMIN } from "~/common/constants/constants";

export async function loader({ request }:Route.LoaderArgs){
  const token = getTokenFromRequest(request)

  if (!token) {
    throw redirect("/");
  }

  const user = await fetchUserData(token);

  if (!user) {
    throw redirect("/");
  }

  if (user.role !== USER_ROLE_ADMIN) {
    throw redirect("/overview");
  }

  return { user };
}

export const AdminProtectedLayout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:ml-28 transition-all duration-300">
        <Outlet />
      </main>
    </>
  );
};

export default AdminProtectedLayout;