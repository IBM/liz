/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Content } from "@carbon/react";
import HeaderLayout from "../HeaderLayout";
import FooterLayout from "../FooterLayout";
import LoadingLayout from "../LoadingLayout";
import "./_edit-layout.scss";

const EditLayout = () => {
  return (
    <>
      <HeaderLayout />
      <Content id="liz__page-content" className="liz__edit-layout-content">
        <Suspense fallback={<LoadingLayout />}>
          <Outlet />
        </Suspense>
      </Content>
      <FooterLayout />
    </>
  );
};

export default EditLayout;
