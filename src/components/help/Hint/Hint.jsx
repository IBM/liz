/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_hint.scss";

const Hint = ({ hasMultipleSteps, currentHelpStep, updateCurrentHelpStep }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="help-panel___hint__content">
        <span>{t("helpPanelHeader.hint", { ns: "help" })}</span>
      </div>
      <div className="help-panel__hint__content">
        <Trans i18nKey="helpPanelContents.hint" ns="help" />
      </div>
    </>
  );
};

Hint.propTypes = {
  hasMultipleSteps: PropTypes.bool,
  currentHelpStep: PropTypes.number,
  updateCurrentHelpStep: PropTypes.func,
};

export default Hint;
