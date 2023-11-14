/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import "./_next-steps.scss";

const NextSteps = () => {
  const { t } = useTranslation();

  return (
    <div className="help-panel__next-steps__content">
      {t("helpPanelContents.nextSteps", { ns: "help" })}
    </div>
  );
};

export default NextSteps;
