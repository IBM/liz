/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { TextInput, Toggle, ToggletipLabel, Toggletip, ToggletipButton, ToggletipContent, Grid, Column } from "@carbon/react";
import { Information } from '@carbon/react/icons';
import "./_device-settings.scss";

const DeviceSettings = ({ deviceSettingsId, patchState, updateFunction, state }) => {
  
    const UPDATE_FUNCTION__LAYER = "layer";
    const UPDATE_FUNCTION__PORT_NO = "portNo";
    const UPDATE_FUNCTION__PCI_FUNCTION_ID = "pciFunctionId";
    const UPDATE_FUNCTION__USER_IDENTIFIER = "userIdentifier";

    const isPciFunctionIdValid = () => {
        return false;
    }

    const isUserIdentifierValid = () => {
        return false;
    }

    const content = (
        <p>
          Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed
          do eiusmod tempor incididunt ut fsil labore et dolore magna
          aliqua.
        </p>
    );
    
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
        <Grid className="device-settings_grid" fullWidth>
          <Column sm={3}>
            <div className="device-settings_grid-column-left">
                <Toggle
                    labelText="Layer2"
                    labelA="0"
                    labelB="1"
                    defaultToggled
                    id="layer2-toggle"
                    onToggle={(toggleState) => {
                        updateFunction(UPDATE_FUNCTION__LAYER, toggleState);
                        patchState({
                            steps: {
                                networkDevice: {
                                    deviceType: deviceSettingsId,
                                    osa: {
                                      readChannel: state.readChannelId ? state.readChannelId.value : "",
                                      writeChannel: state.writeChannelId ? state.writeChannelId.value : "",
                                      dataChannel: state.dataChannelId ? state.dataChannelId.value : "",
                                      portNumber: 0,
                                      layer: 0,
                                    },
                                    roce: {
                                      fid: state.pciFunctionId ? state.pciFunctionId.value : "",
                                      uid: state.userIdentifier ? state.userIdentifier.value : ""
                                    },
                                    vlanId: "",
                                    complete: false,
                                    invalid: false,
                                    localStorageKey: "com.ibm.systems.linux.z.networkDevice"
                                }
                            }
                        });
                    }}
                />
            </div>
          </Column>
          <Column sm={3}>
            <div className="device-settings_grid-column-right">
                <Toggle
                    labelText="Portno"
                    labelA="0"
                    labelB="1"
                    defaultToggled
                    id="portno-toggle"
                    onToggle={(toggleState) => {
                        updateFunction(UPDATE_FUNCTION__PORT_NO, toggleState);
                        patchState({
                        });
                    }}
                />
            </div>
          </Column>
        </Grid>
    );

    const roceMarkup = (
        <Grid className="device-settings_grid" fullWidth>
          <Column sm={2} md={4} lg={6}>
            <div className="device-settings_grid-column-single">
                <TextInput
                    id="pci-function-input"
                    invalidText="A valid value is required"
                    invalid={state && state.pciFunctionId ? !state.pciFunctionId.valid : false}
                    labelText={getLabel(
                        "PCI function ID (FID)",
                        "Show information",
                        content
                    )}
                    placeholder="e.g. 0x0100"
                    value={state.pciFunctionId ? state.pciFunctionId.value : ""}
                    onBlur={(pciFunctionId) => {
                        const pciFunctionIdValue = pciFunctionId && pciFunctionId.target && pciFunctionId.target.value
                            ? pciFunctionId.target.value
                            : "";
                        const pciFunctionIdIsValid = isPciFunctionIdValid(pciFunctionIdValue);
                        updateFunction(UPDATE_FUNCTION__PCI_FUNCTION_ID, pciFunctionIdValue, false);

                        if (pciFunctionIdIsValid) {
                            patchState({
                            });
                        } else {
                            patchState({
                                steps: {
                                    networkDevice: {
                                        invalid: true,
                                        complete: true
                                    }
                                }
                            });
                        }
                    }}
                />
                <TextInput
                    id="user-identifier-input"
                    invalidText="A valid value is required"
                    invalid={state && state.userIdentifier ? !state.userIdentifier.valid : false}
                    labelText={getLabel(
                        "User identifier (UID)",
                        "Show information",
                        content
                    )}
                    placeholder="e.g. 0x1234"
                    value={state.userIdentifier ? state.userIdentifier.value : ""}
                    onBlur={(userIdentifier) => {
                        const userIdentifierValue = userIdentifier && userIdentifier.target && userIdentifier.target.value
                            ? userIdentifier.target.value
                            : "";
                        const userIdentifierIsValid = isUserIdentifierValid(userIdentifierValue);
                        updateFunction(UPDATE_FUNCTION__USER_IDENTIFIER, userIdentifierValue, false);

                        if (userIdentifierIsValid) {
                            patchState({
                            });
                        } else {
                            patchState({
                                steps: {
                                    networkDevice: {
                                        invalid: true,
                                        complete: true
                                    }
                                }
                            });
                        }
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
