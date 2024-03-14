/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_network-device.scss";

const NetworkDevice = ({
  hasMultipleSteps,
  currentHelpStep,
  updateCurrentHelpStep,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="help-panel__network-device__header">
        <span>{t("helpPanelHeader.networkDevice", { ns: "help" })}</span>
      </div>
      <div className="help-panel__network-device__content">
        <Trans i18nKey="helpPanelContents.networkDevice" ns="help" />
      </div>
    </>
  );
};

NetworkDevice.propTypes = {
  hasMultipleSteps: PropTypes.bool,
  currentHelpStep: PropTypes.number,
  updateCurrentHelpStep: PropTypes.func,
};

export default NetworkDevice;
