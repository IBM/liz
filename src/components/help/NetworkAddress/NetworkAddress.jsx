/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";
import "./_network-address.scss";

const NetworkAddress = ({
    hasMultipleSteps,
    currentHelpStep,
    updateCurrentHelpStep,
}) => {
    return (
        <>
            <div
                className="help-panel__network-address__content"
                id="helpPanelContents_networkAddress_para1"
            >
                <Trans
                    i18nKey="helpPanelContents.networkAddress.para1"
                    ns="help_networkAddress"
                />
            </div>
            <div
                className="help-panel__network-address__content"
                id="helpPanelContents_networkAddress_para2"
            >
                <Trans
                    i18nKey="helpPanelContents.networkAddress.para2"
                    ns="help_networkAddress"
                />
            </div>
            <div
                className="help-panel__network-address__content"
                id="helpPanelContents_networkAddress_para3"
            >
                <Trans
                    i18nKey="helpPanelContents.networkAddress.para3"
                    ns="help_networkAddress"
                />
            </div>
            <div
                className="help-panel__network-address__content__bottom"
                id="helpPanelContents_networkAddress_para4"
            >
                <Trans
                    i18nKey="helpPanelContents.networkAddress.para4"
                    ns="help_networkAddress"
                />
            </div>
        </>
    );
};

NetworkAddress.propTypes = {
    hasMultipleSteps: PropTypes.bool,
    currentHelpStep: PropTypes.number,
    updateCurrentHelpStep: PropTypes.func,
};

export default NetworkAddress;
