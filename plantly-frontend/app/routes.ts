import { type RouteConfig, index, route, prefix, layout } from "@react-router/dev/routes";

export default [
    index('./shell/routes/ShellIndexRoute.tsx'),
    layout('./shell/layout/ContentLayout.tsx',[
        ...prefix('home', [
            index('./features/overview/OverviewIndexRoute.tsx'),
        ])
    ])

] satisfies RouteConfig;
