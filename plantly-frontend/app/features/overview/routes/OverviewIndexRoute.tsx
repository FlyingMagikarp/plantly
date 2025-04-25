import type { Route } from "../../../../.react-router/types/app/features/overview/routes/+types/OverviewIndexRoute";
import { useAuth } from "~/auth/AuthContext";
import { useNavigate } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  return null;
}
export async function action({ request }: Route.ActionArgs) {
}


export default function OverviewIndexRoute() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <div>
      OVERVIEW, {currentUser?.username}
      <div>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
}