/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { lazy, useContext } from "react";
import PropTypes from "prop-types";
import { ApplicationContext } from "../../../contexts";
import "./_network-device.scss";

const CommonView = lazy(() => import("./components/common/NetworkDevice"));
const RhelView = lazy(
    () => import("./components/distribution/rhel/NetworkDevice")
);
const SlesView = lazy(
    () => import("./components/distribution/sles/NetworkDevice")
);
const UbuntuView = lazy(
    () => import("./components/distribution/ubuntu/NetworkDevice")
);

const views = {
    rhel: RhelView,
    sles: SlesView,
    ubuntu: UbuntuView,
};

const NetworkDevice = ({
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
            <CommonView>
                <DistributionView />
            </CommonView>
        </>
    );
};

NetworkDevice.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
};

export default NetworkDevice;
