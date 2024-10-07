/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { lazy, useContext } from "react";
import PropTypes from "prop-types";
import { ApplicationContext } from "../../../contexts";
import "./_installation-parameters.scss";

const CommonView = lazy(() => import("./common/InstallationParameters"));
const RhelView = lazy(
    () => import("./distribution/rhel/InstallationParameters")
);
const SlesView = lazy(
    () => import("./distribution/sles/InstallationParameters")
);
const UbuntuView = lazy(
    () => import("./distribution/ubuntu/InstallationParameters")
);

const views = {
    rhel: RhelView,
    sles: SlesView,
    ubuntu: UbuntuView,
};

const InstallationParameters = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    const { state: globalState } = useContext(ApplicationContext);
    const distributionName =
        globalState.steps.inputFileSelection.distributionName;
    const DistributionView = views[distributionName];

    return (
        <>
            <CommonView />
            <DistributionView />
        </>
    );
};

InstallationParameters.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
};

export default InstallationParameters;
