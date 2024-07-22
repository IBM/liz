/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import { ApplicationContext } from "../../../contexts";
import { UBUNTU_DISTRIBUTION_ID } from "../../../util/constants";
import "./_installation-parameters.scss";

const InstallationParameters = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    const { t } = useTranslation();
    const { state: globalState } = useContext(ApplicationContext);

    const distributionName =
        globalState.steps.inputFileSelection.distributionName;

    return (
        <>
            <div className="help-panel__installation-parameters__header">
                <span>
                    {t("helpPanelHeader.installationParameters", {
                        ns: "help_installationParameters",
                    })}
                </span>
            </div>
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
            {distributionName !== UBUNTU_DISTRIBUTION_ID && (
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
                </>
            )}
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

InstallationParameters.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
};

export default InstallationParameters;
