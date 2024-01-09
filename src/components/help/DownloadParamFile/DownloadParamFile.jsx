/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { Trans } from "react-i18next";
import "./_download-param-file.scss";

const DownloadParamFile = () => {
  return (
    <div className="help-panel__download-param-file__content">
      <Trans i18nKey="helpPanelContents.downloadParamFile" ns="help" />
    </div>
  );
};

export default DownloadParamFile;
