/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { Trans } from "react-i18next";
import "./_hint.scss";

const Hint = () => {
  return (
    <div className="help-panel__hint__content">
      <Trans i18nKey="helpPanelContents.hint" ns="help" />
    </div>
  );
};

export default Hint;
