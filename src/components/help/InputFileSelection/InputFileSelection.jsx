/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import "./_input-file-selection.scss";

const InputFileSelection = () => {
  const { t } = useTranslation();

  return (
    <div className="help-panel__input-file-selection__content">
      {t("helpPanelContents.inputFileSelection", { ns: "help" })}
    </div>
  );
};

export default InputFileSelection;
