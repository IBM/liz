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
        <span>{t("helpPanelHeader.downloadParamFile", { ns: "help" })}</span>
      </div>
      <div className="help-panel__download-param-file__content">
        <Trans i18nKey="helpPanelContents.downloadParamFile" ns="help" />
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
