import { Outlet, redirect } from "react-router";
import { fetchUserData, getTokenFromRequest } from "~/auth/utils";
import type { Route } from "../../../.react-router/types/app/common/layouts/+types/ProtectedLayout";
import Navbar from "~/common/components/Navbar";

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
  return (
    <>
      <Navbar />
      <main className="pt-16 md:ml-28 transition-all duration-300">
        <Outlet />
      </main>
    </>
  );
};

export default ProtectedLayout;