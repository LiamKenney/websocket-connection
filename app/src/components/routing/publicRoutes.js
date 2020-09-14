import { lazy } from "react";
const publicRoutes = [
  {
    path: "/",
    exact: true,
    component: lazy(() => import("../landing/Landing")),
  },
  {
    path: "/view-data",
    exact: true,
    component: lazy(() => import("../dataView/DataView")),
  },
];

const listOfPages = publicRoutes.map((route) => route.path);
export { publicRoutes, listOfPages };
