import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  index('index.tsx'),

  layout('./common/layouts/AuthLayout.tsx', [
    route('login', './auth/LoginIndexRoute.tsx'),
    route('register', './auth/RegisterIndexRoute.tsx')
  ]),

  layout('./common/layouts/ProtectedLayout.tsx', [
    route('overview', './features/overview/routes/OverviewIndexRoute.tsx'),
    route('myplants', './features/myplants/routes/MyplantsIndexRoute.tsx')
  ]),

  layout('./common/layouts/AdminProtectedLayout.tsx', [
    ...prefix('admin', [
      index('./features/admin/AdminIndexRoute.tsx'),
      ...prefix('species', [
        index('./features/admin/adminSpecies/routes/AdminSpeciesIndexRoute.tsx'),
        route(':speciesId', './features/admin/adminSpecies/routes/AdminSpeciesDetailRoute.tsx'),
      ])
    ])
  ]),

] satisfies RouteConfig;
