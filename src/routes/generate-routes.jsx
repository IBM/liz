/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { flattenDeep } from "../util/array-util";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import DefaultRoute from "./DefaultRoute";

const generateFlattenRoutes = (routes) => {
  if (!routes) return [];
  return flattenDeep(
    routes.map(({ routes: subRoutes, ...rest }) => [
      rest,
      generateFlattenRoutes(subRoutes),
    ]),
  );
};

export const renderRoutes = (mainRoutes) => {
  const Routes = () => {
    const mainRoutesRoot = mainRoutes.root;
    const layouts = mainRoutesRoot.map(({ layout: Layout, routes }, index) => {
      const subRoutes = generateFlattenRoutes(routes);

      return (
        <Route key={index} element={<Layout />}>
          <Route element={<DefaultRoute />}>
            {subRoutes.map(({ component: Component, path, name }) => {
              return (
                Component &&
                path && <Route key={name} element={<Component />} path={path} />
              );
            })}
          </Route>
        </Route>
      );
    });
    return <ReactRoutes>{layouts}</ReactRoutes>;
  };
  return Routes;
};

const composeErrorElement = (errorElement) => {
  const MainRoutesErrorElementLayout = errorElement.layout;
  const MainRoutesErrorElementPage = errorElement.page;

  return (
    <MainRoutesErrorElementLayout>
      <MainRoutesErrorElementPage />
    </MainRoutesErrorElementLayout>
  );
};

const getChild = (Component, name, path, errorElement) => {
  if (Component && name && path && errorElement) {
    return {
      id: name,
      path,
      element: <Component />,
      errorElement: composeErrorElement(errorElement),
    };
  } else if (Component && name && path) {
    return {
      id: name,
      path,
      element: <Component />,
    };
  }
};

const getChildrenForSubroute = (subRoutes) => {
  return subRoutes
    .map(({ component: Component, errorElement: ErrorElement, path, name }) => {
      return getChild(Component, name, path, ErrorElement);
    })
    .filter((word) => word !== undefined);
};

const composeLayout = (subRoutes, Layout, errorElement) => {
  if (
    Array.isArray(subRoutes) &&
    subRoutes.length > 0 &&
    Layout &&
    errorElement
  ) {
    return {
      element: <Layout />,
      errorElement: composeErrorElement(errorElement),
      children: getChildrenForSubroute(subRoutes),
    };
  } else if (Layout && errorElement) {
    return {
      element: <Layout />,
      errorElement: composeErrorElement(errorElement),
    };
  } else if (Layout) {
    return {
      element: <Layout />,
    };
  } else if (Array.isArray(subRoutes) && subRoutes.length > 0 && errorElement) {
    return {
      errorElement: composeErrorElement(errorElement),
      children: getChildrenForSubroute(subRoutes),
    };
  }
};

export const renderRoutesForCreateBrowser = (mainRoutes) => {
  const Routes = () => {
    const layouts = mainRoutes
      .map(({ layout: Layout, errorElement: ErrorElement, routes }, index) => {
        const subRoutes = generateFlattenRoutes(routes);
        return composeLayout(subRoutes, Layout, ErrorElement);
      })
      .filter((word) => word !== undefined);
    return layouts;
  };
  return Routes;
};
