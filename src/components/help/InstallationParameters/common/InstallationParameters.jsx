/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import { Trans } from "react-i18next";
import "../_installation-parameters.scss";

const InstallationParameters = () => {
    return (
        <>
            <div
                className="help-panel__installation-parameters__content"
                id="helpPanelContents_installationParameters_para1"
            >
                <Trans
                    i18nKey="helpPanelContents.installationParameters.para1"
                    ns="help_installationParameters"
                />
            </div>
            <div
                className="help-panel__installation-parameters__content"
                id="helpPanelContents_installationParameters_para2"
            >
                <Trans
                    i18nKey="helpPanelContents.installationParameters.para2"
                    ns="help_installationParameters"
                />
            </div>
            <div
                className="help-panel__installation-parameters__content"
                id="helpPanelContents_installationParameters_para3"
            >
                <Trans
                    i18nKey="helpPanelContents.installationParameters.para3"
                    ns="help_installationParameters"
                />
            </div>
        </>
    );
};

export { InstallationParameters };
