/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";
import { ApplicationContext } from "../../../contexts";
import {
    SLES_DISTRIBUTION_ID,
    UBUNTU_DISTRIBUTION_ID,
} from "../../../util/constants";
import "./_network-device.scss";

const NetworkDevice = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    const { state: globalState } = useContext(ApplicationContext);

    const distributionName =
        globalState.steps.inputFileSelection.distributionName;

    return (
        <>
            <div
                className="help-panel__network-device__content"
                id="helpPanelContents_networkDevice_para1"
            >
                <Trans
                    i18nKey="helpPanelContents.networkDevice.para1"
                    ns="help_networkDevice"
                />
            </div>
            <div
                className="help-panel__network-device__content"
                id="helpPanelContents_networkDevice_para2"
            >
                <Trans
                    i18nKey="helpPanelContents.networkDevice.para2"
                    ns="help_networkDevice"
                />
            </div>
            <div
                className="help-panel__network-device__content"
                id="helpPanelContents_networkDevice_para3"
            >
                <Trans
                    i18nKey="helpPanelContents.networkDevice.para3"
                    ns="help_networkDevice"
                />
            </div>
            <div
                className="help-panel__network-device__content"
                id="helpPanelContents_networkDevice_para4"
            >
                <Trans
                    i18nKey="helpPanelContents.networkDevice.para4"
                    ns="help_networkDevice"
                />
            </div>
            {distributionName !== UBUNTU_DISTRIBUTION_ID && (
                <div
                    className="help-panel__network-device__content"
                    id="helpPanelContents_networkDevice_para5"
                >
                    <Trans
                        i18nKey="helpPanelContents.networkDevice.para5"
                        ns="help_networkDevice"
                    />
                </div>
            )}
            {distributionName !== SLES_DISTRIBUTION_ID && (
                <div
                    className="help-panel__network-device__content"
                    id="helpPanelContents_networkDevice_para6"
                >
                    <Trans
                        i18nKey="helpPanelContents.networkDevice.para6"
                        ns="help_networkDevice"
                    />
                </div>
            )}
            <div
                className="help-panel__network-device__content__bottom"
                id="helpPanelContents_networkDevice_para7"
            >
                <Trans
                    i18nKey="helpPanelContents.networkDevice.para7"
                    ns="help_networkDevice"
                />
            </div>
        </>
    );
};

NetworkDevice.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
};

export default NetworkDevice;
