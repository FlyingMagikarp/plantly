import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  index('index.tsx'),

  layout('./common/layouts/AuthLayout.tsx', [
    route('login', './auth/LoginIndexRoute.tsx'),
    route('register', './auth/RegisterIndexRoute.tsx')
  ]),

  layout('./common/layouts/ProtectedLayout.tsx', [
    route('overview', './features/overview/routes/OverviewIndexRoute.tsx'),
    ...prefix('plants', [
        index('./features/plants/routes/PlantsIndexRoute.tsx'),
        route('create', './features/plants/routes/CreatePlantRoute.tsx'),
        ...prefix(':plantId', [
          index('./features/plants/routes/PlantDetailRoute.tsx'),
          route('edit', './features/plants/routes/EditPlantRoute.tsx'),
          route('update', './features/plants/routes/resources/UpdatePlantRoute.tsx'),
        ])
    ]),
    ...prefix('locations', [
      index('./features/location/routes/LocationIndexRoute.tsx'),
      route('updateLocations', './features/location/routes/resources/UpdateLocationsRoute.tsx')
    ]),

    ...prefix('catalog', [
      index('./features/catalog/routes/CatalogIndexRoute.tsx'),
      ...prefix(':speciesId', [
        index('./features/catalog/routes/CatalogDetailRoute.tsx'),
      ])
    ])
  ]),

  layout('./common/layouts/AdminProtectedLayout.tsx', [
    ...prefix('admin', [
      index('./features/admin/AdminIndexRoute.tsx'),
      ...prefix('species', [
        index('./features/admin/adminSpecies/routes/AdminSpeciesIndexRoute.tsx'),
        ...prefix(':speciesId', [
          index('./features/admin/adminSpecies/routes/AdminSpeciesDetailRoute.tsx'),
          route('updateNames', './features/admin/adminSpecies/routes/resources/UpdateSpeciesNamesRoute.tsx'),
          route('updateCareTips', './features/admin/adminSpecies/routes/resources/UpdateSpeciesCareTipsRoute.tsx'),
          route('delete', './features/admin/adminSpecies/routes/resources/DeleteSpeciesRoute.tsx'),
        ]),
        route('create', './features/admin/adminSpecies/routes/CreateSpeciesRoute.tsx'),
      ])
    ])
  ]),

] satisfies RouteConfig;
