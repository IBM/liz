/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { Trans } from "react-i18next";
import "./_landing-page.scss";

const LandingPage = () => {
  return (
    <div className="help-panel__landing-page__content">
      <Trans i18nKey="helpPanelContents.landingPage" ns="help" />
    </div>
  );
};

export default LandingPage;
