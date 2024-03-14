/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_network-address.scss";

const NetworkAddress = ({
  hasMultipleSteps,
  currentHelpStep,
  updateCurrentHelpStep,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="help-panel__network-address__header">
        <span>{t("helpPanelHeader.networkAddress", { ns: "help" })}</span>
      </div>
      <div className="help-panel__network-address__content">
        <Trans i18nKey="helpPanelContents.networkAddress" ns="help" />
      </div>
    </>
  );
};

NetworkAddress.propTypes = {
  hasMultipleSteps: PropTypes.bool,
  currentHelpStep: PropTypes.number,
  updateCurrentHelpStep: PropTypes.func,
};

export default NetworkAddress;
