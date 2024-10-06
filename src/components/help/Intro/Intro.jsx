/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";
import "./_intro.scss";

const Intro = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    return (
        <>
            <div
                className="help-panel__intro__content"
                id="helpPanelContents_intro_para1"
            >
                <Trans
                    i18nKey="helpPanelContents.intro.para1"
                    ns="help_intro"
                />
            </div>
            <div
                className="help-panel__intro__content__bottom"
                id="helpPanelContents_intro_para2"
            >
                <Trans
                    i18nKey="helpPanelContents.intro.para2"
                    ns="help_intro"
                />
            </div>
        </>
    );
};

Intro.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
};

export default Intro;
