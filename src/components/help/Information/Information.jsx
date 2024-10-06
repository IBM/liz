/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";
import "./_information.scss";

const Information = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    return (
        <>
            <div
                className="help-panel__information__content"
                id="helpPanelContents_information_para1"
            >
                <Trans
                    i18nKey="helpPanelContents.information.para1"
                    ns="help_information"
                />
            </div>
            <div
                className="help-panel__information__content__bottom"
                id="helpPanelContents_information_para2"
            >
                <Trans
                    i18nKey="helpPanelContents.information.para2"
                    ns="help_information"
                />
            </div>
        </>
    );
};

Information.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
};

export default Information;
