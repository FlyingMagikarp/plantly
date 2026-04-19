import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("species", "routes/species/list.tsx"),
  route("species/new", "routes/species/new.tsx"),
  route("species/:id", "routes/species/detail.tsx"),
  route("species/:id/edit", "routes/species/edit.tsx"),

  route("plants", "routes/plants/list.tsx"),
  route("plants/new", "routes/plants/new.tsx"),
  route("plants/:id", "routes/plants/detail.tsx"),
  route("plants/:id/edit", "routes/plants/edit.tsx"),
] satisfies RouteConfig;
