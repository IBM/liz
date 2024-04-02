/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { pkg } from "@carbon/ibm-products";
import i18Init from "./i18n";
import App from "./App";
import "./index.scss";

pkg.component.Decorator = true;
i18Init();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
