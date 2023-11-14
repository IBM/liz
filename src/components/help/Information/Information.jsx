/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import "./_information.scss";

const Information = () => {
  const { t } = useTranslation();

  return (
    <div className="help-panel__information__content">
      {t("helpPanelContents.information", { ns: "help" })}
    </div>
  );
};

export default Information;
