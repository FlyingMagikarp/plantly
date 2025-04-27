import type { Route } from "../../../.react-router/types/app/features/admin/+types/AdminIndexRoute";

export async function loader({ params }: Route.LoaderArgs) {
  return null;
}
export async function action({ request }: Route.ActionArgs) {
}


export default function AdminIndexRoute() {

  return (
    <div className='p-4 md:p-8 bg-background text-foreground'>
      <h1 className='text-2xl font-bold mb-4'>Admin Index</h1>

    </div>
  );
}