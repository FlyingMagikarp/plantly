import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

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

] satisfies RouteConfig;
