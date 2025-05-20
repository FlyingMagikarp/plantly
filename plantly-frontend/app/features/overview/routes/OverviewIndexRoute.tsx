import { useAuth } from "~/auth/AuthContext";
import { useNavigate } from "react-router";
import { StyleDisplay } from "~/styles";


export default function OverviewIndexRoute() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='heading-xl mb-4'>Overview</h1>
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