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
import "./_landing-page.scss";

const LandingPage = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    const { t } = useTranslation();

    return (
        <>
            {currentHelpStep === 0 && (
                <>
                    <div className="help-panel__landing-page__header">
                        <span>
                            {t("helpPanelHeader.landingPage", {
                                ns: "help_landingPage",
                            })}
                        </span>
                    </div>
                    <div
                        className="help-panel__landing-page__content"
                        id="helpPanelContents_landingPage_para1"
                    >
                        <Trans
                            i18nKey="helpPanelContents.landingPage.para1"
                            ns="help_landingPage"
                        />
                    </div>
                    <div
                        className="help-panel__landing-page__content__bottom"
                        id="helpPanelContents_landingPage_para2"
                    >
                        <Trans
                            i18nKey="helpPanelContents.landingPage.para2"
                            ns="help_landingPage"
                        />
                    </div>
                    <div className="help-panel__landing-page__footer">
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

LandingPage.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
    useSsh: PropTypes.bool,
    useVnc: PropTypes.bool,
    networkAddress: PropTypes.string,
    vncPassword: PropTypes.string,
};

export default LandingPage;
