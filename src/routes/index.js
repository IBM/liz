/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */
// import React from "react"
import loadable from "@loadable/component";
import PathConstants from "../util/path-constants";
import { renderRoutes, renderRoutesForCreateBrowser } from "./generate-routes";

/*
 * Layouts
 */

const MainLayout = loadable(() => import("../content/layouts"), {
    resolveComponent: (components) => components.MainLayout,
});

const EditLayout = loadable(() => import("../content/layouts"), {
    resolveComponent: (components) => components.EditLayout,
});

const SettingsLayout = loadable(() => import("../content/layouts"), {
    resolveComponent: (components) => components.SettingsLayout,
});

const ErrorLayout = loadable(() => import("../content/layouts"), {
    resolveComponent: (components) => components.ErrorLayout,
});

/*
 * Pages
 */

const LandingPage = loadable(() => import("../content/pages"), {
    resolveComponent: (components) => components.LandingPage,
});

const EditPage = loadable(() => import("../content/pages"), {
    resolveComponent: (components) => components.EditPage,
});

const SettingsPage = loadable(() => import("../content/pages"), {
    resolveComponent: (components) => components.SettingsPage,
});

const ErrorPage = loadable(() => import("../content/pages"), {
    resolveComponent: (components) => components.ErrorPage,
});

export const routes = [
    {
        layout: ErrorLayout,
        errorElement: {
            layout: ErrorLayout,
            page: ErrorPage,
        },
        routes: [
            {
                layout: EditLayout,
                routes: [
                    {
                        name: "edit",
                        title: "Edit page",
                        component: EditPage,
                        path: PathConstants.EDIT,
                    },
                ],
            },
            {
                layout: SettingsLayout,
                routes: [
                    {
                        name: "settings",
                        title: "Settings page",
                        component: SettingsPage,
                        path: PathConstants.SETTINGS,
                    },
                ],
            },
            {
                layout: MainLayout,
                routes: [
                    {
                        name: "landing",
                        title: "Landing page",
                        component: LandingPage,
                        path: PathConstants.HOME,
                    },
                    {
                        name: "cards",
                        title: "Cards",
                        routes: [
                            {
                                name: "expanded-card",
                                title: "Expanded card",
                                component: LandingPage,
                                path: PathConstants.EXPANDED_CARD_WITH_ROUTER_PARM,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

export const Routes = renderRoutes(routes);
export const CreateBrowserRoutes = renderRoutesForCreateBrowser(routes)();
