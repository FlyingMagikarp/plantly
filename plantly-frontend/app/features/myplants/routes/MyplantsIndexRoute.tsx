import type { Route } from "../../../../.react-router/types/app/features/overview/routes/+types/OverviewIndexRoute";
import { useAuth } from "~/auth/AuthContext";
import { useNavigate } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  return null;
}
export async function action({ request }: Route.ActionArgs) {
}


export default function MyplantsIndexRoute() {



  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='text-2xl font-bold mb-4'>My Plants</h1>
    </div>
  );
}