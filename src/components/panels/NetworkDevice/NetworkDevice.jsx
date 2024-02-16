/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Layer,
  Dropdown,
  NumberInput,
  TextInput,
  Toggle,
  FlexGrid,
  Row,
  Column,
} from "@carbon/react";
import { getLabel, getContent } from "../../../uiUtil/help-util";
import {
  toChannelSegments,
  validateSegments,
  isShortFormat,
} from "../../../util/network-device-util";
import {
  DEVICE_TYPE_LIST,
  DEVICE_TYPE_OSA,
  UPDATE_FUNCTION__SELECT_DEVICE_TYPE,
  UPDATE_FUNCTION__READ_CHANNEL_ID,
  UPDATE_FUNCTION__WRITE_CHANNEL_ID,
  UPDATE_FUNCTION__DATA_CHANNEL_ID,
  UPDATE_FUNCTION__LAYER,
  UPDATE_FUNCTION__PORT_NO,
  UPDATE_FUNCTION__PCI_FUNCTION_ID,
  UPDATE_FUNCTION__USER_IDENTIFIER,
  ACTION_UPDATE_NETWORK_DEVICE_TYPE,
  ACTION_UPDATE_NETWORK_DEVICE_USE_VLAN,
  ACTION_UPDATE_NETWORK_DEVICE_READ_CHANNEL_ID,
  ACTION_UPDATE_NETWORK_DEVICE_WRITE_CHANNEL_ID,
  ACTION_UPDATE_NETWORK_DEVICE_DATA_CHANNEL_ID,
  ACTION_UPDATE_NETWORK_DEVICE_LAYER,
  ACTION_UPDATE_NETWORK_DEVICE_PORT_NO,
  ACTION_UPDATE_NETWORK_DEVICE_PCI_FUNCTION_ID,
  ACTION_UPDATE_NETWORK_DEVICE_USER_IDENTIFIER,
  ACTION_UPDATE_NETWORK_DEVICE_VLAN_ID,
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_DISABLED,
  LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
} from "../../../util/constants";
import { ApplicationContext } from "../../../App";
import { updateIsDisabled } from "../../../util/panel-utils";
import DeviceSettings from "./components/DeviceSettings";
import "./_network-device.scss";

const NetworkDevice = ({ state, dispatch }) => {
  const { t } = useTranslation();
  const { state: globalState, dispatch: globalDispatch } =
    React.useContext(ApplicationContext);

  const useVlanToggled = state.useVlan;
  const selectedDeviceType = state.selectedDeviceType;
  const vlanIdIsValid = state?.vlanId?.valid;
  const vlanId = state?.vlanId?.value;
  const readChannelIdIsValid = state?.readChannelId?.valid;
  const readChannelId = state?.readChannelId?.value;
  const writeChannelIdIsValid = state?.writeChannelId?.valid;
  const writeChannelId = state?.writeChannelId?.value;
  const dataChannelIdIsValid = state?.dataChannelId?.valid;
  const dataChannelId = state?.dataChannelId?.value;

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
  };

  const updateSelectedDeviceType = (selectedDeviceType) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_TYPE,
      nextSelectedDeviceType: selectedDeviceType,
    });
  };

  const updateUseVlan = (flag) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_USE_VLAN,
      nextUseVlan: flag,
    });
  };

  const updateReadChannelId = (readChannelId, computedReadChannelId, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_READ_CHANNEL_ID,
      nextReadChannelId: {
        value: readChannelId,
        computed: computedReadChannelId,
        valid,
      },
    });
  };

  const updateWriteChannelId = (
    writeChannelId,
    computedWriteChannelId,
    valid,
  ) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_WRITE_CHANNEL_ID,
      nextWriteChannelId: {
        value: writeChannelId,
        computed: computedWriteChannelId,
        valid,
      },
    });
  };

  const updateDataChannelId = (dataChannelId, computedDataChannelId, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_DATA_CHANNEL_ID,
      nextDataChannelId: {
        value: dataChannelId,
        computed: computedDataChannelId,
        valid,
      },
    });
  };

  const updateLayer = (layer) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_LAYER,
      nextLayer: layer,
    });
  };

  const updatePortNo = (portNo) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_PORT_NO,
      nextPortNo: portNo,
    });
  };

  const updatePciFunctionId = (pciFunctionId, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_PCI_FUNCTION_ID,
      nextPciFunctionId: {
        value: pciFunctionId,
        valid,
      },
    });
  };

  const updateUserIdentifier = (userIdentifier, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_USER_IDENTIFIER,
      nextUserIdentifier: {
        value: userIdentifier,
        valid,
      },
    });
  };

  const updateVlanId = (vlanId, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_VLAN_ID,
      nextVlanId: { value: vlanId, valid },
    });
  };

  const isReadChannelIdValid = (readChannelIdValue) => {
    const segments = toChannelSegments(readChannelIdValue);
    if (segments.length === 3) {
      return validateSegments(segments);
    } else if (segments.length === 0) {
      return isShortFormat(readChannelIdValue);
    }
    return false;
  };

  const isWriteChannelIdValid = (writeChannelIdValue) => {
    const segments = toChannelSegments(writeChannelIdValue);
    if (segments.length === 3) {
      return validateSegments(segments);
    } else if (segments.length === 0) {
      return isShortFormat(writeChannelIdValue);
    }
    return false;
  };

  const isDataChannelIdValid = (dataChannelIdValue) => {
    const segments = toChannelSegments(dataChannelIdValue);
    if (segments.length === 3) {
      return validateSegments(segments);
    } else if (segments.length === 0) {
      return isShortFormat(dataChannelIdValue);
    }
    return false;
  };

  const isVlanIdValid = (vlanId) => {
    // do not validate if vlan support is not toggled
    if (!state.useVlan) {
      return true;
    }

    const isInteger =
      typeof vlanId === "string"
        ? Number.isInteger(parseInt(vlanId))
        : Number.isInteger(vlanId);
    if (isInteger) {
      const decimal = Math.trunc(vlanId);
      return decimal > 0 && decimal <= 4094;
    }
    return false;
  };

  const isPortNumberValid = () => {
    if (
      state.portNo &&
      typeof +state.portNo === "number" &&
      +state.portNo >= 0
    ) {
      return true;
    }
    return false;
  };

  const isLayerValid = () => {
    if (state.layer && typeof +state.layer === "number" && +state.layer >= 0) {
      return true;
    }
    return false;
  };

  const areChannelIdsValid = () => {
    if (!state.readChannelId || !state.writeChannelId || !state.dataChannelId) {
      return false;
    }
    return (
      state.readChannelId.valid &&
      state.writeChannelId.valid &&
      state.dataChannelId.valid
    );
  };

  const areOsaDeviceSettingValid = () => {
    return (
      areChannelIdsValid() &&
      (isPortNumberValid() || true) &&
      (isLayerValid() || true)
    );
  };

  const areRoCeDeviceSettingsValid = () => {
    if (!state.pciFunctionId || !state.userIdentifier) {
      return false;
    }
    return state.pciFunctionId.valid && state.userIdentifier.valid;
  };

  const areDeviceSettingsValid = () => {
    if (
      typeof state.selectedDeviceType === "object" &&
      state.selectedDeviceType.id
    ) {
      return state.selectedDeviceType.id === DEVICE_TYPE_OSA
        ? areOsaDeviceSettingValid()
        : areRoCeDeviceSettingsValid();
    }
    return false;
  };

  const isValid = () => {
    if (state.vlanId) {
      return areDeviceSettingsValid() && state.vlanId && state.vlanId.valid;
    }

    return areDeviceSettingsValid();
  };

  const isReadChannelIdComplete = () => {
    return (
      typeof state.readChannelId === "object" &&
      typeof state.readChannelId.value === "string" &&
      state.readChannelId.value.length > 0
    );
  };

  const isWriteChannelIdComplete = () => {
    return (
      typeof state.writeChannelId === "object" &&
      typeof state.writeChannelId.value === "string" &&
      state.writeChannelId.value.length > 0
    );
  };

  const isDataChannelIdComplete = () => {
    return (
      typeof state.dataChannelId === "object" &&
      typeof state.dataChannelId.value === "string" &&
      state.dataChannelId.value.length > 0
    );
  };

  const areChannelIdsComplete = () => {
    return (
      isReadChannelIdComplete() &&
      isWriteChannelIdComplete() &&
      isDataChannelIdComplete()
    );
  };

  const isPortNumberComplete = () => {
    return isPortNumberValid() || true;
  };

  const isLayerComplete = () => {
    return isLayerValid() || true;
  };

  const areOsaDeviceSettingComplete = () => {
    return (
      areChannelIdsComplete() && isPortNumberComplete() && isLayerComplete()
    );
  };

  const isPciFunctionIdComplete = () => {
    return (
      typeof state.pciFunctionId === "object" &&
      typeof state.pciFunctionId.value === "string" &&
      state.pciFunctionId.value.length > 0
    );
  };

  const isUserIdentifierComplete = () => {
    return (
      typeof state.userIdentifier === "object" &&
      typeof state.userIdentifier.value === "string" &&
      state.userIdentifier.value.length > 0
    );
  };

  const areRoCeDeviceSettingComplete = () => {
    return isPciFunctionIdComplete() || isUserIdentifierComplete();
  };

  const isVlanIdComplete = () => {
    // do not validate if vlan support is not toggled
    if (!state.useVlan) {
      return true;
    }

    if (state.vlanId) {
      // for string values other than those with
      // zero length explicitely check for the length.
      return (
        typeof state.vlanId === "object" &&
        (typeof state.vlanId.value === "number" ||
          typeof state.vlanId.value === "string")
      );
    }

    return false;
  };

  const areDeviceSettingsComplete = () => {
    if (
      typeof state.selectedDeviceType === "object" &&
      state.selectedDeviceType.id
    ) {
      return state.selectedDeviceType.id === DEVICE_TYPE_OSA
        ? areOsaDeviceSettingComplete()
        : areRoCeDeviceSettingComplete();
    }
    return false;
  };

  const isComplete = () => {
    return areDeviceSettingsComplete() && isVlanIdComplete();
  };

  const isCompleteAndValid = (callback) => {
    let localIsComplete = false;
    let localIsValid = false;

    if (isComplete()) {
      localIsComplete = true;
      localIsValid = isValid();
    }

    if (localIsComplete && localIsValid) {
      return callback(null, {
        isComplete: localIsComplete,
        isValid: localIsValid,
      });
    }

    return callback(new Error("Form data is incomplete or invalid"), {
      isComplete: localIsComplete,
      isValid: localIsValid,
    });
  };

  useEffect(() => {
    let mergedSteps = {};

    isCompleteAndValid((error, isCompleteAndValid) => {
      if (!error) {
        mergedSteps = {
          ...globalState,
          steps: {
            ...globalState.steps,
            networkDevice: {
              ...globalState.steps.networkDevice,
              deviceType: state.selectedDeviceType
                ? state.selectedDeviceType.id
                : "",
              osa: {
                readChannel: state.readChannelId
                  ? state.readChannelId.value
                  : "",
                writeChannel: state.writeChannelId
                  ? state.writeChannelId.value
                  : "",
                dataChannel: state.dataChannelId
                  ? state.dataChannelId.value
                  : "",
                layer: typeof state.layer === "boolean" ? +state.layer : 1,
                portNumber:
                  typeof state.portNo === "boolean" ? +state.portNo : 0,
              },
              roce: {
                fid: state.pciFunctionId ? state.pciFunctionId.value : "",
                uid: state.userIdentifier ? state.userIdentifier.value : "",
              },
              vlan: {
                id: state.vlanId ? +state.vlanId.value : 1,
                enabled: state.useVlan,
              },
              complete: true,
              invalid: false,
              origin: STATE_ORIGIN_USER,
            },
          },
        };
      } else if (isCompleteAndValid.isComplete) {
        mergedSteps = {
          ...globalState,
          steps: {
            ...globalState.steps,
            networkDevice: {
              ...globalState.steps.networkDevice,
              deviceType: state.selectedDeviceType
                ? state.selectedDeviceType.id
                : "",
              osa: {
                readChannel: state.readChannelId
                  ? state.readChannelId.value
                  : "",
                writeChannel: state.writeChannelId
                  ? state.writeChannelId.value
                  : "",
                dataChannel: state.dataChannelId
                  ? state.dataChannelId.value
                  : "",
                layer: typeof state.layer === "boolean" ? +state.layer : 1,
                portNumber:
                  typeof state.portNo === "boolean" ? +state.portNo : 0,
              },
              roce: {
                fid: state.pciFunctionId ? state.pciFunctionId.value : "",
                uid: state.userIdentifier ? state.userIdentifier.value : "",
              },
              vlan: {
                id: state.vlanId ? +state.vlanId.value : 1,
                enabled: state.useVlan || false,
              },
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
              origin: STATE_ORIGIN_USER,
            },
          },
        };
      } else {
        mergedSteps = {
          ...globalState,
          steps: {
            ...globalState.steps,
            networkDevice: {
              ...globalState.steps.networkDevice,
              deviceType: state?.selectedDeviceType?.id ?? "",
              osa: {
                readChannel: state?.readChannelId?.value ?? "",
                writeChannel: state?.writeChannelId?.value ?? "",
                dataChannel: state?.dataChannelId?.value ?? "",
                layer: typeof state.layer === "boolean" ? +state.layer : 1,
                portNumber:
                  typeof state.portNo === "boolean" ? +state.portNo : 0,
              },
              roce: {
                fid: state?.pciFunctionId?.value ?? "",
                uid: state?.userIdentifier?.value ?? "",
              },
              vlan: {
                id: state.vlanId ? +state.vlanId.value : 1,
                enabled: state.useVlan || false,
              },
              disabled: false,
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
              origin: STATE_ORIGIN_USER,
            },
          },
        };
      }

      globalDispatch({
        type: ACTION_UPDATE_APP_STEPS,
        nextSteps: mergedSteps.steps,
      });
      globalDispatch({
        type: ACTION_UPDATE_APP_IS_DIRTY,
        nextIsDirty: true,
      });
      globalDispatch({
        type: ACTION_UPDATE_APP_IS_DISABLED,
        nextSteps: updateIsDisabled(mergedSteps.steps),
      });
    });

    localStorage.setItem(
      LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
      JSON.stringify({
        ...state,
        origin: STATE_ORIGIN_STORAGE,
      }),
    );
  }, [state]);

  const gridContentsMarkupRowOne = (
    <div className="network-device_column-left">
      <Dropdown
        className="network-device_device-type-dropdown"
        titleText={getLabel(
          t("panel.networkDevice.deviceTypeTextLabel", { ns: "panels" }),
          t("showInformationLabel", { ns: "common" }),
          getContent(t("panel.networkDevice.deviceTypeHelp", { ns: "panels" })),
        )}
        aria-label={t("panel.networkDevice.deviceTypeLabel", { ns: "panels" })}
        id="network-device_device-type-selection"
        items={DEVICE_TYPE_LIST}
        label={t("panel.networkDevice.deviceTypeLabel", { ns: "panels" })}
        helperText=""
        size="md"
        warn={false}
        invalid={false}
        disabled={false}
        onChange={({ selectedItem }) => {
          updateSelectedDeviceType(selectedItem);
        }}
        selectedItem={selectedDeviceType}
      />
    </div>
  );

  const gridContentsMarkupRowTwoColumnOne = (
    <div className="network-device_column-left">
      <DeviceSettings
        deviceSettingsId={selectedDeviceType ? selectedDeviceType.id : ""}
        updateFunction={updateFunction}
        state={state}
      />
      <Toggle
        labelText={getLabel(
          t("panel.networkDevice.vlanToggleTextLabel", { ns: "panels" }),
          t("showInformationLabel", { ns: "common" }),
          getContent(t("panel.networkDevice.vlanToggleHelp", { ns: "panels" })),
        )}
        labelA={t("toggle.disableLabel", { ns: "common" })}
        labelB={t("toggle.enableLabel", { ns: "common" })}
        id="network-device_vlan-toggle"
        className="network-device_vlan-toggle"
        defaultToggled={useVlanToggled}
        onToggle={() => {
          if (useVlanToggled) {
            updateUseVlan(false);
          } else {
            updateUseVlan(true);
          }
        }}
      />
      {useVlanToggled && (
        <NumberInput
          allowEmpty
          min={1}
          max={4094}
          helperText=""
          id="network-device_vlan-id-input"
          invalidText={t("invalidTextLabel", { ns: "common" })}
          invalid={!vlanIdIsValid}
          label={getLabel(
            t("panel.networkDevice.vlanIdTextLabel", { ns: "panels" }),
            t("showInformationLabel", { ns: "common" }),
            getContent(t("panel.networkDevice.vlanIdHelp", { ns: "panels" })),
          )}
          placeholder={t("panel.networkDevice.vlanIdPlaceholder", {
            ns: "panels",
          })}
          value={vlanId}
          translateWithId={(id) => t(id, { ns: "common" })}
          onChange={(event, { value, direction }) => {
            const vlanIdValue = value;
            updateVlanId(vlanIdValue, true);
          }}
          onBlur={(vlanId) => {
            const vlanIdValue =
              vlanId && vlanId.target && vlanId.target.value
                ? vlanId.target.value
                : "";
            const vlanIdIsValid = isVlanIdValid(vlanIdValue);
            updateVlanId(vlanIdValue, vlanIdIsValid);
          }}
        />
      )}
    </div>
  );

  const gridContentsMarkupRowTwoColumnTwo = (
    <div className="network-device_column-right">
      {state.selectedDeviceType &&
      state.selectedDeviceType.id === "network-device_osa-option" ? (
        <>
          <TextInput
            helperText=""
            id="network-device_read-channel-input"
            invalidText={t("invalidTextLabel", { ns: "common" })}
            invalid={!readChannelIdIsValid}
            labelText={getLabel(
              t("panel.networkDevice.readChannelTextLabel", { ns: "panels" }),
              t("showInformationLabel", { ns: "common" }),
              getContent(
                t("panel.networkDevice.readChannelHelp", { ns: "panels" }),
              ),
            )}
            placeholder={t("panel.networkDevice.readChannelPlaceholder", {
              ns: "panels",
            })}
            value={readChannelId}
            onChange={(readChannelId) => {
              const readChannelIdValue = readChannelId?.target?.value ?? "";
              const computedReadChannelIdValue = toChannelSegments(
                readChannelIdValue.toLowerCase(),
              ).join(".");
              updateReadChannelId(
                readChannelIdValue,
                computedReadChannelIdValue,
                true,
              );
            }}
            onBlur={(readChannelId) => {
              const readChannelIdValue = readChannelId?.target?.value ?? "";
              const computedReadChannelIdValue = toChannelSegments(
                readChannelIdValue.toLowerCase(),
              ).join(".");
              const readChannelIdIsValid =
                isReadChannelIdValid(readChannelIdValue);
              updateReadChannelId(
                readChannelIdValue,
                computedReadChannelIdValue,
                readChannelIdIsValid,
              );
            }}
          />
          <TextInput
            helperText=""
            id="network-device_write-channel-input"
            invalidText={t("invalidTextLabel", { ns: "common" })}
            invalid={!writeChannelIdIsValid}
            labelText={getLabel(
              t("panel.networkDevice.writeChannelTextLabel", { ns: "panels" }),
              t("showInformationLabel", { ns: "common" }),
              getContent(
                t("panel.networkDevice.writeChannelHelp", { ns: "panels" }),
              ),
            )}
            placeholder={t("panel.networkDevice.writeChannelPlaceholder", {
              ns: "panels",
            })}
            value={writeChannelId}
            onChange={(writeChannelId) => {
              const writeChannelIdValue = writeChannelId?.target?.value ?? "";
              const computedWriteChannelIdValue = toChannelSegments(
                writeChannelIdValue.toLowerCase(),
              ).join(".");
              updateWriteChannelId(
                writeChannelIdValue,
                computedWriteChannelIdValue,
                true,
              );
            }}
            onBlur={(writeChannelId) => {
              const writeChannelIdValue = writeChannelId?.target?.value ?? "";
              const computedWriteChannelIdValue = toChannelSegments(
                writeChannelIdValue.toLowerCase(),
              ).join(".");
              const writeChannelIdIsValid =
                isWriteChannelIdValid(writeChannelIdValue);
              updateWriteChannelId(
                writeChannelIdValue,
                computedWriteChannelIdValue,
                writeChannelIdIsValid,
              );
            }}
          />
          <TextInput
            helperText=""
            id="network-device_data-channel-input"
            invalidText={t("invalidTextLabel", { ns: "common" })}
            invalid={!dataChannelIdIsValid}
            labelText={getLabel(
              t("panel.networkDevice.dataChannelTextLabel", { ns: "panels" }),
              t("showInformationLabel", { ns: "common" }),
              getContent(
                t("panel.networkDevice.dataChannelHelp", { ns: "panels" }),
              ),
            )}
            placeholder={t("panel.networkDevice.dataChannelPlaceholder", {
              ns: "panels",
            })}
            value={dataChannelId}
            onChange={(dataChannelId) => {
              const dataChannelIdValue = dataChannelId?.target?.value ?? "";
              const computedDataChannelIdValue = toChannelSegments(
                dataChannelIdValue.toLowerCase(),
              ).join(".");
              updateDataChannelId(
                dataChannelIdValue,
                computedDataChannelIdValue,
                true,
              );
            }}
            onBlur={(dataChannelId) => {
              const dataChannelIdValue = dataChannelId?.target?.value ?? "";
              const computedDataChannelIdValue = toChannelSegments(
                dataChannelIdValue.toLowerCase(),
              ).join(".");
              const dataChannelIdIsValid =
                isDataChannelIdValid(dataChannelIdValue);
              updateDataChannelId(
                dataChannelIdValue,
                computedDataChannelIdValue,
                dataChannelIdIsValid,
              );
            }}
          />
        </>
      ) : null}
    </div>
  );

  return (
    <Layer>
      <FlexGrid className="network-device__grid">
        <Row>
          <Column>{gridContentsMarkupRowOne}</Column>
        </Row>
        <Row>
          <Column>{gridContentsMarkupRowTwoColumnOne}</Column>
          <Column>{gridContentsMarkupRowTwoColumnTwo}</Column>
        </Row>
      </FlexGrid>
    </Layer>
  );
};

NetworkDevice.propTypes = {
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.shape({
    selectedDeviceType: PropTypes.object.isRequired,
    readChannelId: PropTypes.object.isRequired,
    writeChannelId: PropTypes.object.isRequired,
    dataChannelId: PropTypes.object.isRequired,
    layer: PropTypes.bool.isRequired,
    portNo: PropTypes.bool.isRequired,
    pciFunctionId: PropTypes.object.isRequired,
    userIdentifier: PropTypes.object.isRequired,
    vlanId: PropTypes.object.isRequired,
    useVlan: PropTypes.bool.isRequired,
  }).isRequired,
};

export default NetworkDevice;
