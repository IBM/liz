/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { Trans } from "react-i18next";
import "./_installation-parameters.scss";

const InstallationParameters = () => {
  return (
    <div className="help-panel__installation-parameters__content">
      <Trans i18nKey="helpPanelContents.installationParameters" ns="help" />
    </div>
  );
};

export default InstallationParameters;
