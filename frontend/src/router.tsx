import { createBrowserRouter } from 'react-router-dom';
import { HomeRoute } from './routes/home';
import { homeLoader } from './routes/home-loader';
import { locationsAction, locationsLoader } from './routes/locations-data';
import { LocationsError, LocationsRoute } from './routes/locations';
import {
  SpeciesDetailError,
  SpeciesDetailRoute,
} from './routes/species-detail';
import { speciesDetailLoader } from './routes/species-detail-loader';
import { SpeciesListError, SpeciesListRoute } from './routes/species-list';
import { speciesListLoader } from './routes/species-list-loader';
import { PlantCollectionRoute } from './routes/plant-collection';
import { PlantDetailRoute } from './routes/plant-detail';
import { PlantFormRoute } from './routes/plant-form';
import { PlantsByLocationRoute } from './routes/plants-by-location';
import { PlantsError } from './routes/plants-common';
import {
  plantCollectionLoader,
  plantDetailAction,
  plantDetailLoader,
  plantFormAction,
  plantFormLoader,
} from './routes/plants-data';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRoute />,
    loader: homeLoader,
  },
  {
    path: '/plants',
    element: <PlantCollectionRoute />,
    loader: plantCollectionLoader,
    errorElement: <PlantsError />,
  },
  {
    path: '/plants/by-location',
    element: <PlantsByLocationRoute />,
    loader: plantCollectionLoader,
    errorElement: <PlantsError area="locations" />,
  },
  {
    path: '/plants/new',
    element: <PlantFormRoute />,
    loader: plantFormLoader,
    action: plantFormAction,
    errorElement: <PlantsError area="form" />,
  },
  {
    path: '/plants/:plantId',
    element: <PlantDetailRoute />,
    loader: plantDetailLoader,
    action: plantDetailAction,
    errorElement: <PlantsError area="detail" />,
  },
  {
    path: '/plants/:plantId/edit',
    element: <PlantFormRoute />,
    loader: plantFormLoader,
    action: plantFormAction,
    errorElement: <PlantsError area="form" />,
  },
  {
    path: '/locations',
    element: <LocationsRoute />,
    loader: locationsLoader,
    action: locationsAction,
    errorElement: <LocationsError />,
  },
  {
    path: '/species',
    element: <SpeciesListRoute />,
    loader: speciesListLoader,
    errorElement: <SpeciesListError />,
  },
  {
    path: '/species/:speciesId',
    element: <SpeciesDetailRoute />,
    loader: speciesDetailLoader,
    errorElement: <SpeciesDetailError />,
  },
]);
