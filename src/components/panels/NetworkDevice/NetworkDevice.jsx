/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Layer, Dropdown, TextInput, ToggletipLabel, Toggletip, ToggletipButton, ToggletipContent, Grid, Column } from "@carbon/react";
import { Information } from '@carbon/react/icons';
import {
  toChannelSegments,
  validateSegments
} from "../common";
import DeviceSettings from "./components/DeviceSettings";
import "./_network-device.scss";

const NetworkDevice = (patchState, localStorageKey) => {
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      selectedDeviceType: {},
      readChannelId: {
        value: "",
        valid: false
      },
      writeChannelId: {
        value: "",
        valid: false
      },
      dataChannelId: {
        value: "",
        valid: false
      },
      layer: false,
      portNo: false,
      pciFunctionId: {
        value: "",
        valid: false
      },
      userIdentifier: {
        value: "",
        valid: false
      },
      vlanId: {
        value: "",
        valid: false
      }
    };

    if (initialState) {
      return initialState
    }
    return defaultState;
  }
  const [state, setState] = useState(getInitialState);

  const UPDATE_FUNCTION__SELECT_DEVICE_TYPE = "selectedDeviceType";
  const UPDATE_FUNCTION__READ_CHANNEL_ID = "readChannelId";
  const UPDATE_FUNCTION__WRITE_CHANNEL_ID = "writeChannelId";
  const UPDATE_FUNCTION__DATA_CHANNEL_ID = "dataChannelId";

  const UPDATE_FUNCTION__LAYER = "layer";
  const UPDATE_FUNCTION__PORT_NO = "portNo";
  const UPDATE_FUNCTION__PCI_FUNCTION_ID = "pciFunctionId";
  const UPDATE_FUNCTION__USER_IDENTIFIER = "userIdentifier";

  const updateFunction = (propertyName, propertyValue, propertyIsValid) => {
    if (propertyName === UPDATE_FUNCTION__SELECT_DEVICE_TYPE) {
      updateSelectedDeviceType(propertyValue);
    } else if (propertyName === UPDATE_FUNCTION__READ_CHANNEL_ID) {
      updateReadChannelId(propertyValue, propertyIsValid);
    } else if (propertyName === UPDATE_FUNCTION__WRITE_CHANNEL_ID) {
      updateWriteChannelId(propertyValue, propertyIsValid);
    } else if (propertyName === UPDATE_FUNCTION__DATA_CHANNEL_ID) {
      updateDataChannelId(propertyValue, propertyIsValid);
    } else if (propertyName === UPDATE_FUNCTION__LAYER) {
      updateLayer(propertyValue);
    } else if (propertyName === UPDATE_FUNCTION__PORT_NO) {
      updatePortNo(propertyValue);
    } else if (propertyName === UPDATE_FUNCTION__PCI_FUNCTION_ID) {
      updatePciFunctionId(propertyValue, propertyIsValid);
    } else if (propertyName === UPDATE_FUNCTION__USER_IDENTIFIER) {
      updateUserIdentifier(propertyValue, propertyIsValid);
    }
  } 

  const updateSelectedDeviceType = (selectedDeviceType) => {
    setState((prevState) => ({...prevState, selectedDeviceType}));
  }

  const updateReadChannelId = (readChannelId, valid) => {
    setState((prevState) => ({...prevState, readChannelId: { value: readChannelId, valid }}));
  }

  const updateWriteChannelId = (writeChannelId, valid) => {
    setState((prevState) => ({...prevState, writeChannelId: { value: writeChannelId, valid }}));
  }

  const updateDataChannelId = (dataChannelId, valid) => {
    setState((prevState) => ({...prevState, dataChannelId: { value: dataChannelId, valid }}));
  }

  const updateLayer = (layer) => {
    setState((prevState) => ({...prevState, layer}));
  }

  const updatePortNo = (portNo) => {
    setState((prevState) => ({...prevState, portNo}));
  }

  const updatePciFunctionId = (pciFunctionId, valid) => {
    setState((prevState) => ({...prevState, pciFunctionId: { value: pciFunctionId, valid }}));
  }

  const updateUserIdentifier = (userIdentifier, valid) => {
    setState((prevState) => ({...prevState, userIdentifier: { value: userIdentifier, valid }}));
  }

  const updateVlanId = (vlanId, valid) => {
    setState((prevState) => ({...prevState, vlanId: { value: vlanId, valid }}));
  }

  const isReadChannelIdValid = (readChannelIdValue) => {
    const segments = toChannelSegments(readChannelIdValue);
    if (segments.length === 3) {
      return validateSegments(segments);
    }
    return false;
  }

  const isWriteChannelIdValid = (writeChannelIdValue) => {
    const segments = toChannelSegments(writeChannelIdValue);
    if (segments.length === 3) {
      return validateSegments(segments);
    }
    return false;
  }

  const isDataChannelIdValid = (dataChannelIdValue) => {
    const segments = toChannelSegments(dataChannelIdValue);
    if (segments.length === 3) {
      return validateSegments(segments);
    }
    return false;
  }

  const isVlanIdValid = (vlanId) => {
    const isInteger = typeof vlanId === "string"
      ? Number.isInteger(parseInt(vlanId))
      : Number.isInteger(vlanId);
    if (isInteger) {
      const decimal = Math.trunc(vlanId);
      return decimal <= 4094;
    }
    return false;
  }

  const deviceTypeList = [
    {
      id: "network-device_osa-option",
      label: "OSA",
    },
    {
      id: "network-device_roce-option",
      label: "RoCE",
    }
  ];

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

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  });

  return (
    <Layer>
      <Grid className="network-device__horizontal-grid" fullWidth>
        <Column sm={4} md={12} lg={12}>
          <div className="network-device_column-left">
            <Dropdown
              className="network-device_device-type-dropdown"
              titleText={getLabel(
                "Device type",
                "Show information",
                content
              )}
              aria-label="Select a device type"
              id="network-device_device-type-selection"
              items={deviceTypeList}
              label="Select a device type"
              helperText=""
              size="md"
              warn={false}
              invalid={false}
              disabled={false}
              onChange={({ selectedItem }) => {
                updateSelectedDeviceType(selectedItem);
                patchState({
                });
              }}
              selectedItem={state.selectedDeviceType}
            />
          </div>
        </Column>
      </Grid>
      <Grid className="network-device__vertical-grid" fullWidth>
        <Column sm={4} md={6} lg={6}>
          <div className="network-device_column-left">
            <DeviceSettings
              deviceSettingsId={state.selectedDeviceType ? state.selectedDeviceType.id : ""}
              updateFunction={updateFunction}
              patchState={patchState}
              state={state}
            />
            <TextInput
              helperText=""
              id="network-device_vlan-id-input"
              invalidText="A valid value is required"
              invalid={state && state.vlanId ? !state.vlanId.valid : false}
              labelText={getLabel(
                "VLAN ID (optional)",
                "Show information",
                content
              )}
              placeholder="ex: 88"
              onBlur={(vlanId) => {
                const vlanIdValue = vlanId && vlanId.target && vlanId.target.value
                  ? vlanId.target.value
                  : "";
                const vlanIdIsValid = isVlanIdValid(vlanIdValue);
                updateVlanId(vlanIdValue, vlanIdIsValid);

                if (vlanIdIsValid) {
                  patchState({
                  });
                } else {
                  patchState({
                    networkDevice: {
                      invalid: true,
                      complete: true
                    }
                  });
                }
              }}
            />
          </div>
        </Column>
        <Column sm={4} md={6} lg={6}>
          <div className="network-device_column-right">
            {state.selectedDeviceType && state.selectedDeviceType.id === "network-device_osa-option"
              ?
              (
                <>
                  <TextInput
                    helperText="Helper text goes here"
                    id="network-device_read-channel-input"
                    invalidText="A valid value is required"
                    invalid={state && state.readChannelId ? !state.readChannelId.valid : false}
                    labelText={getLabel(
                      "Read channel",
                      "Show information",
                      content
                    )}
                    placeholder="ex: 0.0.bdf0"
                    value={state.readChannelId ? state.readChannelId.value : ""}
                    onBlur={(readChannelId) => {
                      const readChannelIdValue = readChannelId && readChannelId.target && readChannelId.target.value
                        ? readChannelId.target.value
                        : "";
                      const readChannelIdIsValid = isReadChannelIdValid(readChannelIdValue);
                      updateReadChannelId(readChannelIdValue, false);

                      if (readChannelIdIsValid) {
                        patchState({
                        });
                      } else {
                        patchState({
                          networkDevice: {
                            invalid: true,
                            complete: true
                          }
                        });
                      }
                    }}
                  />
                  <TextInput
                    helperText="Helper text goes here"
                    id="network-device_write-channel-input"
                    invalidText="A valid value is required"
                    invalid={state && state.writeChannelId ? !state.writeChannelId.valid : false}
                    labelText={getLabel(
                      "Write channel",
                      "Show information",
                      content
                    )}
                    placeholder="ex: 0.0.bdf1"
                    value={state.writeChannelId ? state.writeChannelId.value : ""}
                    onBlur={(writeChannelId) => {
                      const writeChannelIdValue = writeChannelId && writeChannelId.target && writeChannelId.target.value
                        ? writeChannelId.target.value
                        : "";
                      const writeChannelIdIsValid = isWriteChannelIdValid(writeChannelIdValue);
                      updateWriteChannelId(writeChannelIdValue, false);

                      if (writeChannelIdIsValid) {
                        patchState({
                        });
                      } else {
                        patchState({
                          networkDevice: {
                            invalid: true,
                            complete: true
                          }
                        });
                      }
                    }}

                  />
                  <TextInput
                    helperText="Helper text goes here"
                    id="network-device_data-channel-input"
                    invalidText="A valid value is required"
                    invalid={state && state.dataChannelId ? !state.dataChannelId.valid : false}
                    labelText={getLabel(
                      "Data channel",
                      "Show information",
                      content
                    )}
                    placeholder="ex: 0.0.bdf2"
                    value={state.dataChannelId ? state.dataChannelId.value : ""}
                    onBlur={(dataChannelId) => {
                      const dataChannelIdValue = dataChannelId && dataChannelId.target && dataChannelId.target.value
                        ? dataChannelId.target.value
                        : "";
                      const dataChannelIdIsValid = isDataChannelIdValid(dataChannelIdValue);
                      updateDataChannelId(dataChannelIdValue, false);

                      if (dataChannelIdIsValid) {
                        patchState({
                        });
                      } else {
                        patchState({
                          networkDevice: {
                            invalid: true,
                            complete: true
                          }
                        });
                      }
                    }}
                  />
                </>
              )
              :
              (null) 
            }
          </div>
        </Column>
      </Grid>
    </Layer>
  );
};

NetworkDevice.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default NetworkDevice;
