/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@carbon/react";
import { NextOutline } from "@carbon/icons-react";
import "./_error-page.scss";

const ErrorPage = ({
  hasMultipleSteps,
  currentHelpStep,
  updateCurrentHelpStep,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {currentHelpStep === 0 && (
        <>
          <div className="help-panel__error-page__header">
            <span>{t("helpPanelHeader.errorPage", { ns: "help" })}</span>
          </div>
          <div className="help-panel__error-page__content">
            <Trans i18nKey="helpPanelContents.errorPage" ns="help" />
          </div>
          <div className="help-panel__error-page__footer">
            {hasMultipleSteps && (
              <Button
                kind="tertiary"
                onClick={() => updateCurrentHelpStep(currentHelpStep + 1)}
                renderIcon={(props) => <NextOutline size={24} {...props} />}
              >
                {t("btnLabel.SystemRequirements", { ns: "common" })}
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
};

ErrorPage.propTypes = {
  hasMultipleSteps: PropTypes.bool,
  currentHelpStep: PropTypes.number,
  updateCurrentHelpStep: PropTypes.func,
};

export default ErrorPage;
