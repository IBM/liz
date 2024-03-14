/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_intro.scss";

const Intro = ({
  hasMultipleSteps,
  currentHelpStep,
  updateCurrentHelpStep,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="help-panel__intro__header">
        <span>{t("helpPanelHeader.intro", { ns: "help" })}</span>
      </div>
      <div className="help-panel__intro__content">
        <Trans i18nKey="helpPanelContents.intro" ns="help" />
      </div>
    </>
  );
};

Intro.propTypes = {
  hasMultipleSteps: PropTypes.bool,
  currentHelpStep: PropTypes.number,
  updateCurrentHelpStep: PropTypes.func,
};

export default Intro;
