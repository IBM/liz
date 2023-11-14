/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import "./_download-param-file.scss";

const DownloadParamFile = () => {
  const { t } = useTranslation();

  return (
    <div className="help-panel__download-param-file__content">
      {t("helpPanelContents.downloadParamFile", { ns: "help" })}
    </div>
  );
};

export default DownloadParamFile;
