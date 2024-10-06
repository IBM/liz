/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, { Suspense, useContext } from "react";
import { Outlet } from "react-router-dom";
import { Content } from "@carbon/react";
import HeaderLayout from "../HeaderLayout";
import FooterLayout from "../FooterLayout";
import LoadingLayout from "../LoadingLayout";
import { HeaderContext } from "../../../contexts";
import "./_edit-layout.scss";

const EditLayout = () => {
    const contexts = {
        headerContext: useContext(HeaderContext),
    };
    const { state } = contexts.headerContext;
    const isHelpPanelExpanded = state?.isHelpPanelExpanded ?? false;
    const contentClassName = isHelpPanelExpanded
        ? "liz__edit-layout-content liz__edit-layout-content__with-side-panel"
        : "liz__edit-layout-content";

    return (
        <>
            <HeaderLayout />
            <Content id="liz__page-content" className={contentClassName}>
                <Suspense fallback={<LoadingLayout />}>
                    <Outlet />
                </Suspense>
            </Content>
            <FooterLayout />
        </>
    );
};

export default EditLayout;
