/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_information.scss";

const Information = ({
  hasMultipleSteps,
  currentHelpStep,
  updateCurrentHelpStep,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="help-panel__information__header">
        <span>{t("helpPanelHeader.information", { ns: "help" })}</span>
      </div>
      <div className="help-panel__information__content">
        <Trans i18nKey="helpPanelContents.information" ns="help" />
      </div>
    </>
  );
};

Information.propTypes = {
  hasMultipleSteps: PropTypes.bool,
  currentHelpStep: PropTypes.number,
  updateCurrentHelpStep: PropTypes.func,
};

export default Information;
