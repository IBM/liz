/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import { Trans } from "react-i18next";
import "../../_installation-parameters.scss";

const InstallationParameters = () => {
    return (
        <>
            <div
                className="help-panel__installation-parameters__content"
                id="helpPanelContents_installationParameters_para4"
            >
                <Trans
                    i18nKey="helpPanelContents.installationParameters.para4"
                    ns="help_installationParameters"
                />
            </div>
            <div
                className="help-panel__installation-parameters__content"
                id="helpPanelContents_installationParameters_para5"
            >
                <Trans
                    i18nKey="helpPanelContents.installationParameters.para5"
                    ns="help_installationParameters"
                />
            </div>
            <div
                className="help-panel__installation-parameters__content__bottom"
                id="helpPanelContents_installationParameters_para6"
            >
                <Trans
                    i18nKey="helpPanelContents.installationParameters.para6"
                    ns="help_installationParameters"
                />
            </div>
        </>
    );
};

export default InstallationParameters;
