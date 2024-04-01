/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { Outlet } from "react-router-dom";

const DefaultRoute = () => {
  return <Outlet />;
};

export default DefaultRoute;
