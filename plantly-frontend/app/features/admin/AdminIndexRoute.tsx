import type { Route } from "../../../.react-router/types/app/features/admin/+types/AdminIndexRoute";
import { getTokenFromRequest } from "~/auth/utils";

export async function loader({ request }: Route.LoaderArgs) {
  const token = getTokenFromRequest(request)

}
export async function action({ request }: Route.ActionArgs) {
}


export default function AdminIndexRoute({loaderData}: Route.ComponentProps) {

  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='text-2xl font-bold mb-4'>Admin Index</h1>
    </div>
  );
}