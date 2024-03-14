/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_installation-parameters.scss";

const InstallationParameters = ({
  hasMultipleSteps,
  currentHelpStep,
  updateCurrentHelpStep,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="help-panel__installation-parameters__header">
        <span>
          {t("helpPanelHeader.installationParameters", { ns: "help" })}
        </span>
      </div>
      <div className="help-panel__installation-parameters__content">
        <Trans i18nKey="helpPanelContents.installationParameters" ns="help" />
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
