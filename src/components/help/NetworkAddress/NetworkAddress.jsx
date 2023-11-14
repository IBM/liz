/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import "./_network-address.scss";

const NetworkAddress = () => {
  const { t } = useTranslation();

  return (
    <div className="help-panel__network-address__content">
      {t("helpPanelContents.networkAddress", { ns: "help" })}
    </div>
  );
};

export default NetworkAddress;
