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
                        <span>
                            {t("helpPanelHeader.errorPage", {
                                ns: "help_errorPage",
                            })}
                        </span>
                    </div>
                    <div
                        className="help-panel__error-page__content"
                        id="helpPanelContents_errorPage_para1"
                    >
                        <Trans
                            i18nKey="helpPanelContents.errorPage.para1"
                            ns="help_errorPage"
                        />
                    </div>
                    <div
                        className="help-panel__error-page__content"
                        id="helpPanelContents_errorPage_para2"
                    >
                        <Trans
                            i18nKey="helpPanelContents.errorPage.para2"
                            ns="help_errorPage"
                        />
                    </div>
                    <div
                        className="help-panel__error-page__content"
                        id="helpPanelContents_errorPage_para3"
                    >
                        <Trans
                            i18nKey="helpPanelContents.errorPage.para3"
                            ns="help_errorPage"
                        />
                    </div>
                    <div
                        className="help-panel__error-page__content"
                        id="helpPanelContents_errorPage_para4"
                    >
                        <Trans
                            i18nKey="helpPanelContents.errorPage.para4"
                            ns="help_errorPage"
                        />
                    </div>
                    <div
                        className="help-panel__error-page__content"
                        id="helpPanelContents_errorPage_para5"
                    >
                        <Trans
                            i18nKey="helpPanelContents.errorPage.para5"
                            ns="help_errorPage"
                        />
                    </div>
                    <div className="help-panel__error-page__footer">
                        {hasMultipleSteps && (
                            <Button
                                kind="tertiary"
                                onClick={() =>
                                    updateCurrentHelpStep(currentHelpStep + 1)
                                }
                                renderIcon={(props) => (
                                    <NextOutline size={24} {...props} />
                                )}
                            >
                                {t("btnLabel.SystemRequirements", {
                                    ns: "common",
                                })}
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
