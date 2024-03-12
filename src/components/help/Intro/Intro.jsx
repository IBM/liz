/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { Trans } from "react-i18next";
import "./_intro.scss";

const Intro = () => {
  return (
    <div className="help-panel__intro__content">
      <Trans i18nKey="helpPanelContents.intro" ns="help" />
    </div>
  );
};

export default Intro;
