/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import i18Init from "./i18n";
import App from "./App";
import "./index.scss";

i18Init();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={import.meta.env.VITE_URL_PATH_PREFIX}>
    <App />
  </BrowserRouter>,
);
