/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import { useTranslation } from "react-i18next";
import "./_loading-layout.scss";

const LoadingLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="lix__loading-layout__loading-message">
      {t("message.loading", { ns: "common" })}...
    </div>
  );
};

export default LoadingLayout;
