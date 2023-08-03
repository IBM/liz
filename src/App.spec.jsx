/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";

import App from "./App";

const mockedUseRoutes = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useRoutes: () => mockedUseRoutes,
}));

describe("App", () => {
  test("snapshot renders", () => {
    const component = renderer.create(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
