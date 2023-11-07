/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { TextInput, Toggle, ToggletipLabel, Toggletip, ToggletipButton, ToggletipContent, Grid, Column } from "@carbon/react";
import { Information } from '@carbon/react/icons';
import {
    isHex
} from "../../../../util/network-device-util";
import "./_device-settings.scss";

const DeviceSettings = ({ deviceSettingsId, patchState, updateFunction, state }) => {
  
    const UPDATE_FUNCTION__LAYER = "layer";
    const UPDATE_FUNCTION__PORT_NO = "portNo";
    const UPDATE_FUNCTION__PCI_FUNCTION_ID = "pciFunctionId";
    const UPDATE_FUNCTION__USER_IDENTIFIER = "userIdentifier";

    const isPciFunctionIdValid = (pciFunctionIdValue) => {
        const userIdentifierValue = state?.userIdentifier?.value ?? "";

        if (
            userIdentifierValue.length > 0 &&
            typeof pciFunctionIdValue === "string" &&
            pciFunctionIdValue.length === 0
        ) {
            return true;
        }
        if (isHex(pciFunctionIdValue)) {
            return true;
        }
        return false;
    }

    const isUserIdentifierValid = (pciUserIdValue) => {
        const pciFunctionIdValue = state?.pciFunctionId?.value ?? "";

        if (
            pciFunctionIdValue.length > 0 &&
            typeof pciUserIdValue === "string" &&
            pciUserIdValue.length === 0
        ) {
            return true;
        }
        if (isHex(pciUserIdValue)) {
            return true;
        }
        return false;
    }

    const getContent = (value) => {
        return (
            <p>
              {value}
            </p>
        );
    }
    
    const getLabel = (label, buttonLabel, content) => {
        return (
            <>
            <ToggletipLabel>{label}</ToggletipLabel>
            <Toggletip className="misc-parameters_info-icon" align="right-bottom">
                <ToggletipButton label={buttonLabel}>
                <Information/>
                </ToggletipButton>
                <ToggletipContent>
                {content}
                </ToggletipContent>
            </Toggletip>
            </>
        );
    }

    const osaMarkup = (
        <Grid className="device-settings_grid" condensed>
          <Column sm={2} md={3} max={4}>
            <div className="device-settings_grid-column-left">
                <Toggle
                    defaultToggled
                    toggled={state.layer}
                    labelText={getLabel(
                        "Layer 2",
                        "Show information",
                        getContent("Select 1 for Layer 2 (ethernet) mode, or 0 for Layer 3 (IP) mode")
                    )}
                    labelA="0"
                    labelB="1"
                    id="layer2-toggle"
                    onToggle={(toggleState) => {
                        updateFunction(UPDATE_FUNCTION__LAYER, toggleState);
                    }}
                />
            </div>
          </Column>
          <Column sm={2} md={3} max={4}>
            <div className="device-settings_grid-column-right">
                <Toggle
                    toggled={state.portNo}
                    labelText={getLabel(
                        "Port number",
                        "Show information",
                        getContent("Network port to use (0 or 1) in case of networking cards with multiple ports.")
                    )}
                    labelA="0"
                    labelB="1"
                    id="portno-toggle"
                    onToggle={(toggleState) => {
                        updateFunction(UPDATE_FUNCTION__PORT_NO, toggleState);
                    }}
                />
            </div>
          </Column>
        </Grid>
    );

    const roceMarkup = (
        <Grid className="device-settings_grid" fullWidth>
          <Column sm={2} md={8} lg={16}>
            <div className="device-settings_grid-column-single">
                <TextInput
                    id="pci-function-input"
                    invalidText="A valid value is required"
                    invalid={state && state.pciFunctionId ? !state.pciFunctionId.valid : false}
                    labelText={getLabel(
                        "PCI function ID (FID)",
                        "Show information",
                        getContent("Function ID (FID) of the PCI network device in hexadecimal format.")
                    )}
                    placeholder="e.g. 0x0100"
                    value={state?.pciFunctionId?.value ?? ""}
                    onChange={(pciFunctionId) => {
                        const pciFunctionIdValue = pciFunctionId && pciFunctionId.target && pciFunctionId.target.value
                            ? pciFunctionId.target.value
                            : "";
                        updateFunction(UPDATE_FUNCTION__PCI_FUNCTION_ID, pciFunctionIdValue, true);
                    }}
                    onBlur={(pciFunctionId) => {
                        const pciFunctionIdValue = pciFunctionId && pciFunctionId.target && pciFunctionId.target.value
                            ? pciFunctionId.target.value
                            : "";
                        const pciFunctionIdIsValid = isPciFunctionIdValid(pciFunctionIdValue);
                        updateFunction(UPDATE_FUNCTION__PCI_FUNCTION_ID, pciFunctionIdValue, pciFunctionIdIsValid);
                    }}
                />
                <TextInput
                    id="user-identifier-input"
                    invalidText="A valid value is required"
                    invalid={state && state.userIdentifier ? !state.userIdentifier.valid : false}
                    labelText={getLabel(
                        "PCI User-defined identifier (UID)",
                        "Show information",
                        getContent("User-defined identifier (UID) of the PCI network device in hexadecimal format.")
                    )}
                    placeholder="e.g. 0x1234"
                    value={state?.userIdentifier?.value ?? ""}
                    onChange={(userIdentifier) => {
                        const userIdentifierValue = userIdentifier && userIdentifier.target && userIdentifier.target.value
                            ? userIdentifier.target.value
                            : "";
                        updateFunction(UPDATE_FUNCTION__USER_IDENTIFIER, userIdentifierValue, true);
                    }}
                    onBlur={(userIdentifier) => {
                        const userIdentifierValue = userIdentifier && userIdentifier.target && userIdentifier.target.value
                            ? userIdentifier.target.value
                            : "";
                        const userIdentifierIsValid = isUserIdentifierValid(userIdentifierValue);
                        updateFunction(UPDATE_FUNCTION__USER_IDENTIFIER, userIdentifierValue, userIdentifierIsValid);
                    }}
                />
            </div>
          </Column>
        </Grid>
    );

    if (deviceSettingsId === "network-device_osa-option") {
        return osaMarkup;
    } else if (deviceSettingsId === "network-device_roce-option") {
        return roceMarkup;
    }
    return (null);
}

DeviceSettings.propTypes = {
    deviceSettingsId: PropTypes.string.isRequired,
    patchState: PropTypes.func.isRequired,
    updateFunction: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired
  };

export default DeviceSettings;
