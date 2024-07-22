/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import "./_summary.scss";

const Summary = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="help-panel__summary__header">
                <span>
                    {t("helpPanelHeader.summary", { ns: "help_summary" })}
                </span>
            </div>
            <div
                className="help-panel__summary__content"
                id="helpPanelContents_summary_para1"
            >
                <Trans
                    i18nKey="helpPanelContents.summary.para1"
                    ns="help_summary"
                />
            </div>
        </>
    );
};

Summary.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
};

export default Summary;
