/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { Trans } from "react-i18next";
import "./_summary.scss";

const Summary = () => {
  return (
    <div className="help-panel__summary__content">
      <Trans i18nKey="helpPanelContents.summary" ns="help" />
    </div>
  );
};

export default Summary;
