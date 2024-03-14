/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_summary.scss";

const Summary = ({
  hasMultipleSteps,
  currentHelpStep,
  updateCurrentHelpStep,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="help-panel__summary__header">
        <span>{t("helpPanelHeader.summary", { ns: "help" })}</span>
      </div>
      <div className="help-panel__summary__content">
        <Trans i18nKey="helpPanelContents.summary" ns="help" />
      </div>
    </>
  );
};

Summary.propTypes = {
  hasMultipleSteps: PropTypes.bool,
  currentHelpStep: PropTypes.number,
  updateCurrentHelpStep: PropTypes.func,
};

export default Summary;
