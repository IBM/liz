/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import { Trans } from "react-i18next";
import "../../_network-device.scss";

const NetworkDevice = () => {
    return (
        <>
            <div
                className="help-panel__network-device__content"
                id="helpPanelContents_networkDevice_para6"
            >
                <Trans
                    i18nKey="helpPanelContents.networkDevice.para6"
                    ns="help_networkDevice"
                />
            </div>
        </>
    );
};

export default NetworkDevice;
