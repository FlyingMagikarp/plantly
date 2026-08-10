import { createBrowserRouter } from 'react-router-dom';
import { HomeRoute } from './routes/home';
import { homeLoader } from './routes/home-loader';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRoute />,
    loader: homeLoader,
  },
]);
