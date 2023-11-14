/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import "./_network-device.scss";

const NetworkDevice = () => {
  const { t } = useTranslation();

  return (
    <div className="help-panel__network-device__content">
      {t("helpPanelContents.networkDevice", { ns: "help" })}
    </div>
  );
};

export default NetworkDevice;
