/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { Trans } from "react-i18next";
import "./_network-device.scss";

const NetworkDevice = () => {
  return (
    <div className="help-panel__network-device__content">
      <Trans i18nKey="helpPanelContents.networkDevice" ns="help" />
    </div>
  );
};

export default NetworkDevice;
