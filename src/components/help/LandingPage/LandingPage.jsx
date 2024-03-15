/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_landing-page.scss";

const LandingPage = ({
  hasMultipleSteps,
  currentHelpStep,
  updateCurrentHelpStep,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {currentHelpStep === 0 && (
        <>
          <div className="help-panel__landing-page__header">
            <span>{t("helpPanelHeader.landingPage", { ns: "help" })}</span>
          </div>
          <div className="help-panel__landing-page__content">
            <Trans i18nKey="helpPanelContents.landingPage" ns="help" />
          </div>
        </>
      )}
    </>
  );
};

LandingPage.propTypes = {
  hasMultipleSteps: PropTypes.bool,
  currentHelpStep: PropTypes.number,
  updateCurrentHelpStep: PropTypes.func,
};

export default LandingPage;
