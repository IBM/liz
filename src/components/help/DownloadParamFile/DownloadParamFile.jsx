/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_download-param-file.scss";

const DownloadParamFile = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="help-panel__download-param-file__header">
                <span>
                    {t("helpPanelHeader.downloadParamFile", {
                        ns: "help_downloadParamFile",
                    })}
                </span>
            </div>
            <div
                className="help-panel__download-param-file__content"
                id="helpPanelContents_downloadParamFile_para1"
            >
                <Trans
                    i18nKey="helpPanelContents.downloadParamFile.para1"
                    ns="help_downloadParamFile"
                />
            </div>
            <div
                className="help-panel__download-param-file__content"
                id="helpPanelContents_downloadParamFile_para2"
            >
                <Trans
                    i18nKey="helpPanelContents.downloadParamFile.para2"
                    ns="help_downloadParamFile"
                />
            </div>
            <div
                className="help-panel__download-param-file__content"
                id="helpPanelContents_downloadParamFile_para3"
            >
                <Trans
                    i18nKey="helpPanelContents.downloadParamFile.para3"
                    ns="help_downloadParamFile"
                />
            </div>
        </>
    );
};

DownloadParamFile.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
};

export default DownloadParamFile;
