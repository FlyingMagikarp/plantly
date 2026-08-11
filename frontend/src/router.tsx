import { createBrowserRouter } from 'react-router-dom';
import { HomeRoute } from './routes/home';
import { homeLoader } from './routes/home-loader';
import {
  SpeciesDetailError,
  SpeciesDetailRoute,
} from './routes/species-detail';
import { speciesDetailLoader } from './routes/species-detail-loader';
import { SpeciesListError, SpeciesListRoute } from './routes/species-list';
import { speciesListLoader } from './routes/species-list-loader';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRoute />,
    loader: homeLoader,
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
