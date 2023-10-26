/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Layer, Dropdown, TextInput, ToggletipLabel, Toggletip, ToggletipButton, ToggletipContent, FlexGrid, Row, Column } from "@carbon/react";
import { Information } from '@carbon/react/icons';
import {
  toChannelSegments,
  validateSegments,
  isShortFormat
} from "../../../util/network-device-util";
import DeviceSettings from "./components/DeviceSettings";
import "./_network-device.scss";

const NetworkDevice = (patchState, localStorageKey) => {
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      selectedDeviceType: {},
      readChannelId: {
        value: "",
        computed: "",
        valid: false
      },
      writeChannelId: {
        value: "",
        computed: "",
        valid: false
      },
      dataChannelId: {
        value: "",
        computed: "",
        valid: false
      },
      layer: true,
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

  const DEVICE_TYPE_OSA = "network-device_osa-option";
  // const DEVICE_TYPE_ROCE = "network-device_roce-option";

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

  const updateReadChannelId = (readChannelId, computedReadChannelId, valid) => {
    setState((prevState) => ({...prevState, readChannelId: { value: readChannelId, computed: computedReadChannelId, valid }}));
  }

  const updateWriteChannelId = (writeChannelId, computedWriteChannelId, valid) => {
    setState((prevState) => ({...prevState, writeChannelId: { value: writeChannelId, computed: computedWriteChannelId, valid }}));
  }

  const updateDataChannelId = (dataChannelId, computedDataChannelId, valid) => {
    setState((prevState) => ({...prevState, dataChannelId: { value: dataChannelId, computed: computedDataChannelId, valid }}));
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
    } else if (segments.length === 0) {
      return isShortFormat(readChannelIdValue);
    }
    return false;
  }

  const isWriteChannelIdValid = (writeChannelIdValue) => {
    const segments = toChannelSegments(writeChannelIdValue);
    if (segments.length === 3) {
      return validateSegments(segments);
    } else if (segments.length === 0) {
      return isShortFormat(writeChannelIdValue);
    }
    return false;
  }

  const isDataChannelIdValid = (dataChannelIdValue) => {
    const segments = toChannelSegments(dataChannelIdValue);
    if (segments.length === 3) {
      return validateSegments(segments);
    } else if (segments.length === 0) {
      return isShortFormat(dataChannelIdValue);
    }
    return false;
  }

  const isVlanIdValid = (vlanId) => {
    const isInteger = typeof vlanId === "string"
      ? Number.isInteger(parseInt(vlanId))
      : Number.isInteger(vlanId);
    if (isInteger) {
      const decimal = Math.trunc(vlanId);
      return decimal > 0 && decimal <= 4094;
    }
    // VLAN ID is optional, if it is a zero length string
    // mark it as a valid value.
    if (typeof vlanId === "string" && vlanId.length === 0) {
      return true;
    }
    return false;
  }

  const isPortNumberValid = () => {
    if (
      state.portNo &&
      typeof +state.portNo === "number" &&
      +state.portNo >= 0
    ) {
      return true;
    }
    return false;
  }

  const isLayerValid = () => {
    if (
      state.layer &&
      typeof +state.layer === "number" &&
      +state.layer >= 0
    ) {
      return true;
    }
    return false;
  }

  const areChannelIdsValid = () => {
    if (
      !state.readChannelId ||
      !state.writeChannelId ||
      !state.dataChannelId
    ) {
      return false;
    }
    return state.readChannelId.valid &&
      state.writeChannelId.valid &&
      state.dataChannelId.valid;
  }

  const areOsaDeviceSettingValid = () => {
    return areChannelIdsValid() &&
    (isPortNumberValid() || true) &&
    (isLayerValid() || true);
  }

  const areRoCeDeviceSettingsValid = () => {
    if (
      !state.pciFunctionId ||
      !state.userIdentifier
    ) {
      return false;
    }
    return state.pciFunctionId.valid &&
      state.userIdentifier.valid;
  }

  const areDeviceSettingsValid = () => {
    if (typeof state.selectedDeviceType === "object" && state.selectedDeviceType.id) {
      return state.selectedDeviceType.id === DEVICE_TYPE_OSA
      ? areOsaDeviceSettingValid()
      : areRoCeDeviceSettingsValid();
    }
    return false;
  }

  const isValid = () => {
    if (state.vlanId) {
      return areDeviceSettingsValid() &&
        state.vlanId &&
        state.vlanId.valid;
    }
  
    return areDeviceSettingsValid();
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

  const isReadChannelIdComplete = () => {
    return typeof state.readChannelId === "object" &&
      typeof state.readChannelId.value === "string" &&
      state.readChannelId.value.length > 0;
  }

  const isWriteChannelIdComplete = () => {
    return typeof state.writeChannelId === "object" &&
      typeof state.writeChannelId.value === "string" &&
      state.writeChannelId.value.length > 0;    
  }

  const isDataChannelIdComplete = () => {
    return typeof state.dataChannelId === "object" &&
      typeof state.dataChannelId.value === "string" &&
      state.dataChannelId.value.length > 0;
  }

  const areChannelIdsComplete = () => {
    return isReadChannelIdComplete() &&
      isWriteChannelIdComplete() &&
      isDataChannelIdComplete();
  }

  const isPortNumberComplete = () => {
    return isPortNumberValid() || true;
  }

  const isLayerComplete = () => {
    return isLayerValid() || true;
  }

  const areOsaDeviceSettingComplete = () => {
    return areChannelIdsComplete() &&
      isPortNumberComplete() &&
      isLayerComplete();
  }

  const isPciFunctionIdComplete = () => {
    return typeof state.pciFunctionId === "object" &&
      typeof state.pciFunctionId.value === "string" &&
      state.pciFunctionId.value.length > 0;
  }

  const isUserIdentifierComplete = () => {
    return typeof state.userIdentifier === "object" &&
      typeof state.userIdentifier.value === "string" &&
      state.userIdentifier.value.length > 0;
  }

  const areRoCeDeviceSettingComplete = () => {
    return isPciFunctionIdComplete() &&
    isUserIdentifierComplete();
  }

  const isVlanIdComplete = () => {
    if (state.vlanId) {
      // for string values other than those with
      // zero length explicitely check for the length.
      return typeof state.vlanId === "object" &&
        typeof state.vlanId.value === "string"
    }

    // vlanId is optional and thus it could have
    // a zero length.
    return true;
  }

  const areDeviceSettingsComplete = () => {
    if (typeof state.selectedDeviceType === "object" && state.selectedDeviceType.id) {
      return state.selectedDeviceType.id === DEVICE_TYPE_OSA
      ? areOsaDeviceSettingComplete()
      : areRoCeDeviceSettingComplete();
    }
    return false;
  }

  const isComplete = () => {
    return areDeviceSettingsComplete() &&
      isVlanIdComplete();
  }

  const isCompleteAndValid = (callback) => {
    let localIsComplete = false;
    let localIsValid = false;
  
    if (
      isComplete()
    ) {
      localIsComplete = true;
      localIsValid = isValid();
    }

    if (localIsComplete && localIsValid) {
      return callback(null, {
        isComplete: localIsComplete,
        isValid: localIsValid
      });
    }

    return callback(new Error('Form data is incomplete or invalid'), {
      isComplete: localIsComplete,
      isValid: localIsValid
    });
  }

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
    isCompleteAndValid((error, isCompleteAndValid) => {
      if (!error) {
        patchState({
          steps: {
            networkDevice: {
              deviceType: state.selectedDeviceType ? state.selectedDeviceType.id : "",
              osa: {
                readChannel: state.readChannelId ? state.readChannelId.value : "",
                writeChannel: state.writeChannelId ? state.writeChannelId.value : "",
                dataChannel: state.dataChannelId ? state.dataChannelId.value : "",
                layer: typeof state.layer === "boolean" ? +state.layer : 1,
                portNumber: typeof state.portNo === "boolean" ? +state.portNo : 0,
              },
              roce: {
                fid: state.pciFunctionId ? state.pciFunctionId.value : "",
                uid: state.userIdentifier ? state.userIdentifier.value: ""
              },
              vlanId: state.vlanId ? state.vlanId.value : "",
              complete: true,
              invalid: false,
              localStorageKey
            }
          }
        });
      } else if (isCompleteAndValid.isComplete) {
        patchState({
          steps: {
            networkDevice: {
              deviceType: state.selectedDeviceType ? state.selectedDeviceType.id : "",
              osa: {
                readChannel: state.readChannelId ? state.readChannelId.value : "",
                writeChannel: state.writeChannelId ? state.writeChannelId.value : "",
                dataChannel: state.dataChannelId ? state.dataChannelId.value : "",
                layer: typeof state.layer === "boolean" ? +state.layer : 1,
                portNumber: typeof state.portNo === "boolean" ? +state.portNo : 0,
              },
              roce: {
                fid: state.pciFunctionId ? state.pciFunctionId.value : "",
                uid: state.userIdentifier ? state.userIdentifier.value: ""
              },
              vlanId: state.vlanId ? state.vlanId.value : "",
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
              localStorageKey
            }
          }
        });
      } else {
        patchState({
          steps: {
            networkDevice: {
              deviceType: state?.selectedDeviceType?.id ?? "",
              osa: {
                readChannel: state?.readChannelId?.value ?? "",
                writeChannel: state?.writeChannelId?.value ?? "",
                dataChannel: state?.dataChannelId?.value ?? "",
                layer: typeof state.layer === "boolean" ? +state.layer : 1,
                portNumber: typeof state.portNo === "boolean" ? +state.portNo : 0,
              },
              roce: {
                fid: state?.pciFunctionId?.value ?? "",
                uid: state?.userIdentifier?.value ?? ""
              },
              vlanId: state?.vlanId?.value ?? "",
              disabled: false,
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
              localStorageKey
            }
          }
        });
      }
    });
  }, [state]);

  const gridContentsMarkupRowOne = (
    <div className="network-device_column-left">
      <Dropdown
        className="network-device_device-type-dropdown"
        titleText={getLabel(
          "Device type",
          "Show information",
          getContent("OSA (Open Systems Adapter) or RoCE (PCI RDMA over Converged Ethernet)")
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
        }}
        selectedItem={state.selectedDeviceType}
      />
    </div>
  );

  const gridContentsMarkupRowTwoColumnOne = (
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
          getContent("Enter a VLAN ID between 1 and 4094, or leave empty for no VLAN ID.")
        )}
        placeholder="ex: 88"
        value={state.vlanId ? state.vlanId.value : ""}
        onChange={(vlanId) => {
          const vlanIdValue = vlanId && vlanId.target && vlanId.target.value
            ? vlanId.target.value
            : "";
          updateVlanId(vlanIdValue, true);
        }}
        onBlur={(vlanId) => {
          const vlanIdValue = vlanId && vlanId.target && vlanId.target.value
            ? vlanId.target.value
            : "";
          const vlanIdIsValid = isVlanIdValid(vlanIdValue);
          updateVlanId(vlanIdValue, vlanIdIsValid);
        }}
      />
    </div>
  );

  const gridContentsMarkupRowTwoColumnTwo = (
    <div className="network-device_column-right">
      {state.selectedDeviceType && state.selectedDeviceType.id === "network-device_osa-option"
        ?
        (
          <>
            <TextInput
              helperText=""
              id="network-device_read-channel-input"
              invalidText="A valid value is required"
              invalid={state && state.readChannelId ? !state.readChannelId.valid : false}
              labelText={getLabel(
                "Read channel",
                "Show information",
                getContent("Device bus-ID of the OSA read channel in the format x.y.zzzz.")
              )}
              placeholder="ex: 0.0.bdf0"
              value={state.readChannelId ? state.readChannelId.value : ""}
              onChange={(readChannelId) => {
                const readChannelIdValue = readChannelId?.target?.value ?? "";
                const computedReadChannelIdValue = toChannelSegments(readChannelIdValue.toLowerCase()).join(".");
                updateReadChannelId(readChannelIdValue, computedReadChannelIdValue, true);
              }}
              onBlur={(readChannelId) => {
                const readChannelIdValue = readChannelId?.target?.value ?? "";
                const computedReadChannelIdValue = toChannelSegments(readChannelIdValue.toLowerCase()).join(".");
                const readChannelIdIsValid = isReadChannelIdValid(readChannelIdValue);
                updateReadChannelId(
                  readChannelIdValue,
                  computedReadChannelIdValue,
                  readChannelIdIsValid
                );
              }}
            />
            <TextInput
              readOnly
              helperText=""
              id="network-device_computed-read-channel-input"
              labelText={getLabel(
                "Read channel (computed)",
                "Show information",
                getContent("Sanitized device bus-ID of the OSA read channel.")
              )}
              placeholder="ex: 0.0.bdf0"
              value={state.readChannelId ? state.readChannelId.computed : ""}
            />
            <TextInput
              helperText=""
              id="network-device_write-channel-input"
              invalidText="A valid value is required"
              invalid={state && state.writeChannelId ? !state.writeChannelId.valid : false}
              labelText={getLabel(
                "Write channel",
                "Show information",
                getContent("Device bus-ID of the OSA write channel in the format x.y.zzzz.")
              )}
              placeholder="ex: 0.0.bdf1"
              value={state.writeChannelId ? state.writeChannelId.value : ""}
              onChange={(writeChannelId) => {
                const writeChannelIdValue = writeChannelId?.target?.value ?? "";
                const computedWriteChannelIdValue = toChannelSegments(writeChannelIdValue.toLowerCase()).join(".");
                updateWriteChannelId(writeChannelIdValue, computedWriteChannelIdValue, true);
              }}
              onBlur={(writeChannelId) => {
                const writeChannelIdValue = writeChannelId?.target?.value ?? "";
                const computedWriteChannelIdValue = toChannelSegments(writeChannelIdValue.toLowerCase()).join(".");
                const writeChannelIdIsValid = isWriteChannelIdValid(writeChannelIdValue);
                updateWriteChannelId(
                  writeChannelIdValue,
                  computedWriteChannelIdValue,
                  writeChannelIdIsValid
                );
              }}
            />
            <TextInput
              readOnly
              helperText=""
              id="network-device_computed-write-channel-input"
              labelText={getLabel(
                "Write channel (computed)",
                "Show information",
                getContent("Sanitized device bus-ID of the OSA write channel.")
              )}
              placeholder="ex: 0.0.bdf1"
              value={state.writeChannelId ? state.writeChannelId.computed : ""}
            />
            <TextInput
              helperText=""
              id="network-device_data-channel-input"
              invalidText="A valid value is required"
              invalid={state && state.dataChannelId ? !state.dataChannelId.valid : false}
              labelText={getLabel(
                "Data channel",
                "Show information",
                getContent("Device bus-ID of the OSA data channel in the format x.y.zzzz.")
              )}
              placeholder="ex: 0.0.bdf2"
              value={state.dataChannelId ? state.dataChannelId.value : ""}
              onChange={(dataChannelId) => {
                const dataChannelIdValue = dataChannelId?.target?.value ?? "";
                const computedDataChannelIdValue = toChannelSegments(dataChannelIdValue.toLowerCase()).join(".");
                updateDataChannelId(dataChannelIdValue, computedDataChannelIdValue, true);
              }}
              onBlur={(dataChannelId) => {
                const dataChannelIdValue = dataChannelId?.target?.value ?? "";
                const computedDataChannelIdValue = toChannelSegments(dataChannelIdValue.toLowerCase()).join(".");
                const dataChannelIdIsValid = isDataChannelIdValid(dataChannelIdValue);
                updateDataChannelId(
                  dataChannelIdValue,
                  computedDataChannelIdValue,
                  dataChannelIdIsValid
                );
              }}
            />
            <TextInput
              readOnly
              helperText=""
              id="network-device_computed-data-channel-input"
              labelText={getLabel(
                "Data channel (computed)",
                "Show information",
                getContent("Sanitized device bus-ID of the OSA data channel.")
              )}
              placeholder="ex: 0.0.bdf2"
              value={state.dataChannelId ? state.dataChannelId.computed : ""}
            />
          </>
        )
        :
        (null) 
      }
    </div>
  );

  return (
    <Layer>
      <FlexGrid className="network-device__grid">
        <Row>
          <Column>
            {gridContentsMarkupRowOne}
          </Column>
        </Row>
        <Row>
          <Column>
            {gridContentsMarkupRowTwoColumnOne}
          </Column>
          <Column>
            {gridContentsMarkupRowTwoColumnTwo}
          </Column>
        </Row>
      </FlexGrid>
    </Layer>
  );
};

NetworkDevice.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default NetworkDevice;
