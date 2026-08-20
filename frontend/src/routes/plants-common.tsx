import {
  Link,
  isRouteErrorResponse,
  useRevalidator,
  useRouteError,
} from 'react-router-dom';
import { ErrorState, Page } from '../components/ui';

export function PlantsError({ area = 'collection' }: { area?: 'collection' | 'detail' | 'form' | 'locations' | 'home' | 'care round' }) {
  const error = useRouteError();
  const revalidator = useRevalidator();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const unavailable = area === 'detail' ? 'plant detail' : area === 'locations' || area === 'home' ? 'plants' : area;

  return (
    <ErrorState title={notFound ? 'Plant not found' : `${capitalize(unavailable)} could not be loaded`} description={
          notFound
            ? 'This plant is no longer available.'
            : `The ${unavailable} is unavailable. Please try again.`
        } action={notFound ? (
          <Link className="text-link" to="/plants">
            Return to collection
          </Link>
        ) : (
          <button
            className="btn-primary"
            disabled={revalidator.state !== 'idle'}
            onClick={() => revalidator.revalidate()}
            type="button"
          >
            {revalidator.state === 'idle' ? 'Try again' : 'Trying again…'}
          </button>
        )} />
  );
}

export function PlantPageHeader({ children }: { children: React.ReactNode }) {
  return <Page width="reading">{children}</Page>;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
