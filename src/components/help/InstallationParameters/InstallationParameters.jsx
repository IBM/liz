/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import "./_installation-parameters.scss";

const InstallationParameters = () => {
  const { t } = useTranslation();

  return (
    <div className="help-panel__installation-parameters__content">
      {t("helpPanelContents.installationParameters", { ns: "help" })}
    </div>
  );
};

export default InstallationParameters;
