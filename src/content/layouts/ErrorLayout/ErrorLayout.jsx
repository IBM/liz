/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, { Suspense } from "react";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import { Content } from "@carbon/react";
import HeaderLayout from "../HeaderLayout";
import FooterLayout from "../FooterLayout";
import LoadingLayout from "../LoadingLayout";
import "./_error-layout.scss";

const ErrorLayout = ({ children }) => {
  return (
    <>
      <HeaderLayout />
      <Content id="liz__page-content" className="liz__error-layout-content">
        <Suspense fallback={<LoadingLayout />}>
          {children ?? <Outlet />}
        </Suspense>
      </Content>
      <FooterLayout />
    </>
  );
};

ErrorLayout.propTypes = {
  children: PropTypes.node,
};

export default ErrorLayout;
