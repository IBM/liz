/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { Trans } from "react-i18next";
import "./_information.scss";

const Information = () => {
  return (
    <div className="help-panel__information__content">
      <Trans i18nKey="helpPanelContents.information" ns="help" />
    </div>
  );
};

export default Information;
