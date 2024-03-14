/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_input-file-selection.scss";

const InputFileSelection = ({
  hasMultipleSteps,
  currentHelpStep,
  updateCurrentHelpStep,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="help-panel__input-file-selection__header">
        <span>{t("helpPanelHeader.inputFileSelection", { ns: "help" })}</span>
      </div>
      <div className="help-panel__input-file-selection__content">
        <Trans i18nKey="helpPanelContents.inputFileSelection" ns="help" />
      </div>
    </>
  );
};

InputFileSelection.propTypes = {
  hasMultipleSteps: PropTypes.bool,
  currentHelpStep: PropTypes.number,
  updateCurrentHelpStep: PropTypes.func,
};

export default InputFileSelection;
