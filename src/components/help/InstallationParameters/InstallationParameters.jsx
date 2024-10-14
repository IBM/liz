/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { lazy, Suspense, useContext } from "react";
import PropTypes from "prop-types";
import { Loading } from "@carbon/react";
import { ApplicationContext } from "../../../contexts";
import "./_installation-parameters.scss";

const CommonView = lazy(
    () => import("./components/common/InstallationParameters")
);
const RhelView = lazy(
    () => import("./components/distribution/rhel/InstallationParameters")
);
const SlesView = lazy(
    () => import("./components/distribution/sles/InstallationParameters")
);
const UbuntuView = lazy(
    () => import("./components/distribution/ubuntu/InstallationParameters")
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
            <Suspense fallback={<Loading />}>
                <CommonView />
            </Suspense>
            <Suspense fallback={<Loading />}>
                <DistributionView />
            </Suspense>
        </>
    );
};

InstallationParameters.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
};

export default InstallationParameters;
