/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useContext } from "react";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import { ApplicationContext } from "../../../contexts";
import { NetworkDevice as CommonView } from "./common/NetworkDevice";
import "./_network-device.scss";

const NetworkDevice = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    const { state: globalState } = useContext(ApplicationContext);

    const distributionName =
        globalState.steps.inputFileSelection.distributionName;
    const DistributionView = loadable(
        () => import(`./distribution/${distributionName}/NetworkDevice`),
        {
            resolveComponent: (components) => components.default,
        }
    );

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
