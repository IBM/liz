/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useContext } from "react";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import { ApplicationContext } from "../../../contexts";
import { InstallationParameters as CommonView } from "./common/InstallationParameters";
import "./_installation-parameters.scss";

const InstallationParameters = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    const { state: globalState } = useContext(ApplicationContext);
    const distributionName =
        globalState.steps.inputFileSelection.distributionName;
    const DistributionView = loadable(
        () =>
            import(`./distribution/${distributionName}/InstallationParameters`),
        {
            resolveComponent: (components) => components.default,
        }
    );

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
