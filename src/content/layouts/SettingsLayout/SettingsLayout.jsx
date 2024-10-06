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
import "./_settings-layout.scss";

const SettingsLayout = () => {
    const contexts = {
        headerContext: useContext(HeaderContext),
    };
    const { state } = contexts.headerContext;
    const isHelpPanelExpanded = state?.isHelpPanelExpanded ?? false;
    const contentClassName = isHelpPanelExpanded
        ? "liz__settings-layout-content liz__settings-layout-content__with-side-panel"
        : "liz__settings-layout-content";

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

export default SettingsLayout;
