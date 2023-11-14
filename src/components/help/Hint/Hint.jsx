/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import "./_hint.scss";

const Hint = () => {
  const { t } = useTranslation();

  return (
    <div className="help-panel__hint__content">
      {t("helpPanelContents.hint", { ns: "help" })}
    </div>
  );
};

export default Hint;
