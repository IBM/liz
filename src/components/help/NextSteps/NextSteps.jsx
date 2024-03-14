/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_next-steps.scss";

const NextSteps = ({
  hasMultipleSteps,
  currentHelpStep,
  updateCurrentHelpStep,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="help-panel__next-steps__header">
        <span>{t("helpPanelHeader.nextSteps", { ns: "help" })}</span>
      </div>
      <div className="help-panel__next-steps__content">
        <Trans i18nKey="helpPanelContents.nextSteps" ns="help" />
      </div>
    </>
  );
};

NextSteps.propTypes = {
  hasMultipleSteps: PropTypes.bool,
  currentHelpStep: PropTypes.number,
  updateCurrentHelpStep: PropTypes.func,
};

export default NextSteps;
