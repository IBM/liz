/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import "./_misc-parameters.scss";

const MiscParameters = () => {
  const { t } = useTranslation();

  return (
    <div className="help-panel__misc-parameters__content">
      {t("helpPanelContents.miscParameters", { ns: "help" })}
    </div>
  );
};

export default MiscParameters;
