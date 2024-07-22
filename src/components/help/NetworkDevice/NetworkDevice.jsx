/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_network-device.scss";

const NetworkDevice = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="help-panel__network-device__header">
                <span>
                    {t("helpPanelHeader.networkDevice", {
                        ns: "help_networkDevice",
                    })}
                </span>
            </div>
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
            <div
                className="help-panel__network-device__content"
                id="helpPanelContents_networkDevice_para5"
            >
                <Trans
                    i18nKey="helpPanelContents.networkDevice.para5"
                    ns="help_networkDevice"
                />
            </div>
            <div
                className="help-panel__network-device__content"
                id="helpPanelContents_networkDevice_para6"
            >
                <Trans
                    i18nKey="helpPanelContents.networkDevice.para6"
                    ns="help_networkDevice"
                />
            </div>
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
