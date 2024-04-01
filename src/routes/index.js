/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */
// import React from "react"
import loadable from "@loadable/component";
import PathConstants from "../util/path-constants";
import { renderRoutes } from "./generate-routes";

// Layouts
import { MainLayout, EditLayout } from "../content/layouts";

// Pages
// import { LandingPage, EditPage } from "../content/pages";

const LandingPage = loadable(() => import("../content/pages"), {
  resolveComponent: (components) => components.LandingPage,
});

const EditPage = loadable(() => import("../content/pages"), {
  resolveComponent: (components) => components.EditPage,
});

export const routes = [
  {
    layout: EditLayout,
    routes: [
      {
        name: "edit",
        title: "Edit page",
        // component: React.lazy(() => import("../content/pages/EditPage")),
        component: EditPage,
        path: PathConstants.EDIT,
      },
    ],
  },
  {
    layout: MainLayout,
    routes: [
      {
        name: "landing",
        title: "Landing page",
        // component: React.lazy(() => import("../content/pages/LandingPage")),
        component: LandingPage,
        path: PathConstants.HOME,
      },
      {
        name: "cards",
        title: "Cards",
        hasSiderLink: true,
        routes: [
          {
            name: "expanded-requirements-card",
            title: "Expanded requirements card",
            hasSiderLink: true,
            // component: React.lazy(() => import("../content/pages/LandingPage")),
            component: LandingPage,
            path: PathConstants.EXPANDED_REQUIREMENTS_CARD,
          },
          {
            name: "expanded-parmfile-card",
            title: "Expanded parmfile card",
            hasSiderLink: true,
            // component: React.lazy(() => import("../content/pages/LandingPage")),
            component: LandingPage,
            path: PathConstants.EXPANDED_PARMFILE_CARD,
          },
          {
            name: "expanded-nextsteps-card",
            title: "Expanded next steps card",
            hasSiderLink: true,
            // component: React.lazy(() => import("../content/pages/LandingPage")),
            component: LandingPage,
            path: PathConstants.EXPANDED_NEXTSTEPS_CARD,
          },
        ],
      },
    ],
  },
];

export const Routes = renderRoutes(routes);
