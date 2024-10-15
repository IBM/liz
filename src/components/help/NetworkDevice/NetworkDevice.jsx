/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { lazy, Suspense, useContext } from "react";
import PropTypes from "prop-types";
import { Loading } from "@carbon/react";
import { ApplicationContext } from "../../../contexts";
import { DEFAULT_DISTRIBUTION_ID } from "../../../util/constants";
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
    const hasDistributionName =
        typeof globalState.steps.inputFileSelection.distributionName ===
            "string" &&
        globalState.steps.inputFileSelection.distributionName.length > 0;
    const distributionName = hasDistributionName
        ? globalState.steps.inputFileSelection.distributionName
        : DEFAULT_DISTRIBUTION_ID;
    const DistributionView = views[distributionName];

    return (
        <>
            <Suspense fallback={<Loading />}>
                <CommonView>
                    <Suspense fallback={<Loading />}>
                        <DistributionView />
                    </Suspense>
                </CommonView>
            </Suspense>
        </>
    );
};

NetworkDevice.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
};

export default NetworkDevice;
