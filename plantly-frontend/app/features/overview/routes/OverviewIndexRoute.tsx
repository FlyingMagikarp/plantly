import type { Route } from "../../../../.react-router/types/app/features/overview/routes/+types/OverviewIndexRoute";
import { useAuth } from "~/auth/AuthContext";
import { useNavigate } from "react-router";
import { StyleDisplay } from "~/styles";

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
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='text-2xl font-bold mb-4'>Overview</h1>
      <div>
        Current user: {currentUser?.username}
      </div>
      <div>
        Current role: {currentUser?.role}
      </div>
      <StyleDisplay />
    </div>
  );
}