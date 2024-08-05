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
import "./_settings-page.scss";

const SettingsPage = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    const { t } = useTranslation();

    return (
        <>
            {currentHelpStep === 0 && (
                <>
                    <div className="help-panel__settings-page__header">
                        <span>
                            {t("helpPanelHeader.settingsPage", {
                                ns: "help_settingsPage",
                            })}
                        </span>
                    </div>
                    <div
                        className="help-panel__settings-page__content"
                        id="helpPanelContents_settingsPage_para1"
                    >
                        <Trans
                            i18nKey="helpPanelContents.settingsPage.para1"
                            ns="help_settingsPage"
                        />
                    </div>
                    <div
                        className="help-panel__settings-page__content"
                        id="helpPanelContents_settingsPage_para2"
                    >
                        <Trans
                            i18nKey="helpPanelContents.settingsPage.para2"
                            ns="help_settingsPage"
                        />
                    </div>
                    <div
                        className="help-panel__settings-page__content"
                        id="helpPanelContents_settingsPage_para3"
                    >
                        <Trans
                            i18nKey="helpPanelContents.settingsPage.para3"
                            ns="help_settingsPage"
                        />
                    </div>
                    <div
                        className="help-panel__settings-page__content"
                        id="helpPanelContents_settingsPage_para4"
                    >
                        <Trans
                            i18nKey="helpPanelContents.settingsPage.para4"
                            ns="help_settingsPage"
                        />
                    </div>
                    <div
                        className="help-panel__settings-page__content__bottom"
                        id="helpPanelContents_settingsPage_para5"
                    >
                        <Trans
                            i18nKey="helpPanelContents.settingsPage.para5"
                            ns="help_settingsPage"
                        />
                    </div>
                    <div className="help-panel__settings-page__footer">
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

SettingsPage.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
    useSsh: PropTypes.bool,
    useVnc: PropTypes.bool,
    networkAddress: PropTypes.string,
    vncPassword: PropTypes.string,
};

export default SettingsPage;
