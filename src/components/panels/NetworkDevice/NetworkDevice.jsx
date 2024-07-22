/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import {
    Layer,
    NumberInput,
    TextInput,
    Toggle,
    FlexGrid,
    Row,
    Column,
    RadioButtonGroup,
    RadioButton,
    ActionableNotification,
    InlineNotification,
} from "@carbon/react";
import {
    toChannelSegments,
    validateSegments,
    isShortFormat,
} from "../../../util/network-device-util";
import {
    DEVICE_TYPE_OSA,
    DEVICE_TYPE_ROCE,
    UPDATE_FUNCTION__SELECT_DEVICE_TYPE,
    UPDATE_FUNCTION__READ_CHANNEL_ID,
    UPDATE_FUNCTION__WRITE_CHANNEL_ID,
    UPDATE_FUNCTION__DATA_CHANNEL_ID,
    UPDATE_FUNCTION__LAYER,
    UPDATE_FUNCTION__USE_MULTIPORT,
    UPDATE_FUNCTION__PORT_NO,
    UPDATE_FUNCTION__PCI_FUNCTION_ID,
    UPDATE_FUNCTION__USER_IDENTIFIER,
    SLES_DISTRIBUTION_ID,
    UBUNTU_DISTRIBUTION_ID,
} from "../../../util/constants";
import {
    LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
    STATE_ORIGIN_USER,
    STATE_ORIGIN_STORAGE,
} from "../../../util/local-storage-constants";
import {
    ApplicationContext,
    NetworkDeviceContext,
    DownloadParamFileContext,
} from "../../../contexts";
import { updateIsDisabled as updateIsDisabledFromUtils } from "../../../util/panel-util";
import { resetParamFileTextAreaData } from "../../../uiUtil/panel-util";
import DeviceSettings from "./components/DeviceSettings";
import { setItem } from "../../../util/local-storage-util";
import "./_network-device.scss";

const NetworkDevice = forwardRef(function NetworkDevice(props, ref) {
    const {
        state: globalState,
        updateModified: globalUpdateModified,
        updateNextStep,
        updateIsDirty,
        updateIsDisabled,
    } = React.useContext(ApplicationContext);
    const { updateModified, updateParamFileContent } = React.useContext(
        DownloadParamFileContext
    );
    const {
        state,
        updateSelectedDeviceType,
        updateUseVlan,
        updateReadChannelId,
        updateWriteChannelId,
        updateDataChannelId,
        updateLayer,
        updateUseMultiPort,
        updatePortNo,
        updatePciFunctionId,
        updateUserIdentifier,
        updateVlanId,
    } = React.useContext(NetworkDeviceContext);
    const { t } = useTranslation();
    const publicRef = {
        persistState: () => {
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
                                    ? state.selectedDeviceType
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
                                    layer:
                                        typeof state.layer === "boolean"
                                            ? +state.layer
                                            : 1,
                                    portNumber:
                                        typeof state.useMultiPort ===
                                            "boolean" &&
                                        typeof state.portNo === "boolean"
                                            ? getPortNumber({
                                                  useMultiport:
                                                      state.useMultiPort,
                                                  portNumber: state.portNo,
                                              })
                                            : 0,
                                },
                                roce: {
                                    fid: state.pciFunctionId
                                        ? state.pciFunctionId.value
                                        : "",
                                    uid: state.userIdentifier
                                        ? state.userIdentifier.value
                                        : "",
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
                                    ? state.selectedDeviceType
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
                                    layer:
                                        typeof state.layer === "boolean"
                                            ? +state.layer
                                            : 1,
                                    portNumber:
                                        typeof state.useMultiPort ===
                                            "boolean" &&
                                        typeof state.portNo === "boolean"
                                            ? getPortNumber({
                                                  useMultiport:
                                                      state.useMultiPort,
                                                  portNumber: state.portNo,
                                              })
                                            : 0,
                                },
                                roce: {
                                    fid: state.pciFunctionId
                                        ? state.pciFunctionId.value
                                        : "",
                                    uid: state.userIdentifier
                                        ? state.userIdentifier.value
                                        : "",
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
                                deviceType: state?.selectedDeviceType ?? "",
                                osa: {
                                    readChannel:
                                        state?.readChannelId?.value ?? "",
                                    writeChannel:
                                        state?.writeChannelId?.value ?? "",
                                    dataChannel:
                                        state?.dataChannelId?.value ?? "",
                                    layer:
                                        typeof state.layer === "boolean"
                                            ? +state.layer
                                            : 1,
                                    portNumber:
                                        typeof state.useMultiPort ===
                                            "boolean" &&
                                        typeof state.portNo === "boolean"
                                            ? getPortNumber({
                                                  useMultiport:
                                                      state.useMultiPort,
                                                  portNumber: state.portNo,
                                              })
                                            : 0,
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

                updateNextStep(mergedSteps.steps);
                updateIsDirty(true);
                updateIsDisabled(updateIsDisabledFromUtils(mergedSteps.steps));
            });

            setItem(
                LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
                JSON.stringify({
                    ...state,
                    origin: STATE_ORIGIN_STORAGE,
                })
            );
        },
    };

    useEffect(publicRef.persistState, [state]);
    useImperativeHandle(ref, () => publicRef);

    const useVlanToggled = state?.useVlan ?? false;
    const selectedDeviceType = state.selectedDeviceType;
    const vlanIdIsValid = state?.vlanId?.valid;
    const vlanId = state?.vlanId?.value;
    const readChannelIdIsValid = state?.readChannelId?.valid;
    const readChannelId = state?.readChannelId?.value;
    const writeChannelIdIsValid = state?.writeChannelId?.valid;
    const writeChannelId = state?.writeChannelId?.value;
    const dataChannelIdIsValid = state?.dataChannelId?.valid;
    const dataChannelId = state?.dataChannelId?.value;
    const paramFileHasBeenModifiedFromState =
        globalState?.steps.downloadParamFile?.modified ?? false;
    const distributionName =
        globalState.steps.inputFileSelection.distributionName;
    const displayNoneUbuntuControl =
        distributionName !== UBUNTU_DISTRIBUTION_ID;
    const displayRoCEControls = distributionName !== SLES_DISTRIBUTION_ID;

    const updateFunction = (propertyName, propertyValue, propertyIsValid) => {
        if (propertyName === UPDATE_FUNCTION__SELECT_DEVICE_TYPE) {
            updateSelectedDeviceType(propertyValue);
        } else if (propertyName === UPDATE_FUNCTION__READ_CHANNEL_ID) {
            updateReadChannelId({
                value: propertyValue,
                valid: propertyIsValid,
            });
        } else if (propertyName === UPDATE_FUNCTION__WRITE_CHANNEL_ID) {
            updateWriteChannelId({
                value: propertyValue,
                valid: propertyIsValid,
            });
        } else if (propertyName === UPDATE_FUNCTION__DATA_CHANNEL_ID) {
            updateDataChannelId({
                value: propertyValue,
                valid: propertyIsValid,
            });
        } else if (propertyName === UPDATE_FUNCTION__LAYER) {
            updateLayer(propertyValue);
        } else if (propertyName === UPDATE_FUNCTION__USE_MULTIPORT) {
            updateUseMultiPort(propertyValue);
        } else if (propertyName === UPDATE_FUNCTION__PORT_NO) {
            updatePortNo(propertyValue);
        } else if (propertyName === UPDATE_FUNCTION__PCI_FUNCTION_ID) {
            updatePciFunctionId({
                value: propertyValue,
                valid: propertyIsValid,
            });
        } else if (propertyName === UPDATE_FUNCTION__USER_IDENTIFIER) {
            updateUserIdentifier({
                value: propertyValue,
                valid: propertyIsValid,
            });
        }
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

    const isUseMultiPortValid = () => {
        if (state.useMultiPort && typeof state.useMultiPort === "boolean") {
            return true;
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
        if (
            state.layer &&
            typeof +state.layer === "number" &&
            +state.layer >= 0
        ) {
            return true;
        }
        return false;
    };

    const areChannelIdsForUbuntuValid = () => {
        if (!state.readChannelId) {
            return false;
        }
        return state.readChannelId.valid;
    };

    const areChannelIdsValid = () => {
        if (distributionName === UBUNTU_DISTRIBUTION_ID) {
            return areChannelIdsForUbuntuValid();
        } else if (
            !state.readChannelId ||
            !state.writeChannelId ||
            !state.dataChannelId
        ) {
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
            (isUseMultiPortValid() || true) &&
            (isPortNumberValid() || true) &&
            (isLayerValid() || true)
        );
    };

    const areRoCeDeviceSettingsValid = () => {
        if (!displayRoCEControls) {
            return true;
        } else if (!state.pciFunctionId || !state.userIdentifier) {
            return false;
        }
        return state.pciFunctionId.valid && state.userIdentifier.valid;
    };

    const areDeviceSettingsValid = () => {
        if (typeof state.selectedDeviceType === "string") {
            return state.selectedDeviceType === DEVICE_TYPE_OSA
                ? areOsaDeviceSettingValid()
                : areRoCeDeviceSettingsValid();
        }
        return false;
    };

    const isValid = () => {
        if (state.vlanId) {
            return (
                areDeviceSettingsValid() && state.vlanId && state.vlanId.valid
            );
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
        if (distributionName === UBUNTU_DISTRIBUTION_ID) {
            return isReadChannelIdComplete();
        }
        return (
            isReadChannelIdComplete() &&
            isWriteChannelIdComplete() &&
            isDataChannelIdComplete()
        );
    };

    const isUseMultiPortComplete = () => {
        return isUseMultiPortValid() || true;
    };

    const isPortNumberComplete = () => {
        return isPortNumberValid() || true;
    };

    const isLayerComplete = () => {
        return isLayerValid() || true;
    };

    const areOsaDeviceSettingComplete = () => {
        return (
            areChannelIdsComplete() &&
            isUseMultiPortComplete() &&
            isPortNumberComplete() &&
            isLayerComplete()
        );
    };

    const isPciFunctionIdComplete = () => {
        if (!displayRoCEControls) {
            return true;
        }
        return (
            typeof state.pciFunctionId === "object" &&
            typeof state.pciFunctionId.value === "string" &&
            state.pciFunctionId.value.length > 0
        );
    };

    const isUserIdentifierComplete = () => {
        if (!displayRoCEControls) {
            return true;
        }
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
        if (typeof state.selectedDeviceType === "string") {
            return state.selectedDeviceType === DEVICE_TYPE_OSA
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

    const getPortNumber = ({ useMultiport, portNumber }) => {
        if (useMultiport && portNumber) {
            return 1;
        }

        return 0;
    };

    const gridContentsMarkupRowOne = (
        <div className="network-device_column-left">
            <RadioButtonGroup
                readOnly={paramFileHasBeenModifiedFromState}
                className="network-device_device-type-radiobutton-group"
                legendText={t("panel.networkDevice.deviceTypeTextLabel", {
                    ns: "panels",
                })}
                helperText={t(
                    displayRoCEControls
                        ? "panel.networkDevice.deviceTypeHelp"
                        : "panel.networkDevice.deviceTypeHelpNoRoCE",
                    {
                        ns: "panels",
                    }
                )}
                name="network-device_device-type-group"
                valueSelected={selectedDeviceType ?? DEVICE_TYPE_OSA}
                onChange={(selectedItem) => {
                    if (paramFileHasBeenModifiedFromState) return;

                    updateSelectedDeviceType(selectedItem);
                }}
                onFocus={() => {
                    document
                        .getElementById("helpPanelContents_networkDevice_para1")
                        ?.classList?.add(
                            "help-panel__network-device__content__active"
                        );
                    document
                        .getElementById("helpPanelContents_networkDevice_para2")
                        ?.classList?.add(
                            "help-panel__network-device__content__active"
                        );
                    document
                        .getElementById("helpPanelContents_networkDevice_para3")
                        ?.classList?.add(
                            "help-panel__network-device__content__active"
                        );
                }}
                onBlur={() => {
                    document
                        .getElementById("helpPanelContents_networkDevice_para1")
                        ?.classList?.remove(
                            "help-panel__network-device__content__active"
                        );
                    document
                        .getElementById("helpPanelContents_networkDevice_para2")
                        ?.classList?.remove(
                            "help-panel__network-device__content__active"
                        );
                    document
                        .getElementById("helpPanelContents_networkDevice_para3")
                        ?.classList?.remove(
                            "help-panel__network-device__content__active"
                        );
                }}
            >
                <RadioButton
                    labelText="OSA"
                    value={DEVICE_TYPE_OSA}
                    id="network-device_osa-radio"
                />
                {displayRoCEControls && (
                    <RadioButton
                        labelText="RoCE"
                        value={DEVICE_TYPE_ROCE}
                        id="network-device_roce-radio"
                    />
                )}
            </RadioButtonGroup>
        </div>
    );

    const vlanToggleId = "network-device_vlan-id-input";
    const gridContentsMarkupRowTwoColumnOne = (
        <div className="network-device_column-left">
            <DeviceSettings
                deviceSettingsId={selectedDeviceType}
                updateFunction={updateFunction}
                state={state}
                readOnly={paramFileHasBeenModifiedFromState}
                displayRoCEControls={displayRoCEControls}
            />
            <Toggle
                readOnly={paramFileHasBeenModifiedFromState}
                labelText={t("panel.networkDevice.vlanToggleTextLabel", {
                    ns: "panels",
                })}
                labelA={t("btnLabel.No", { ns: "common" })}
                labelB={t("btnLabel.Yes", { ns: "common" })}
                id="network-device_vlan-toggle"
                className="network-device_vlan-toggle"
                toggled={useVlanToggled}
                onToggle={() => {
                    if (paramFileHasBeenModifiedFromState) return;

                    if (useVlanToggled) {
                        updateUseVlan(false);
                    } else {
                        updateUseVlan(true);
                    }
                }}
                onFocus={() => {
                    document
                        .getElementById("helpPanelContents_networkDevice_para7")
                        ?.classList?.add(
                            "help-panel__network-device__content__active"
                        );
                }}
                onBlur={() => {
                    document
                        .getElementById("helpPanelContents_networkDevice_para7")
                        ?.classList?.remove(
                            "help-panel__network-device__content__active"
                        );
                }}
            />
            {useVlanToggled && (
                <NumberInput
                    allowEmpty
                    min={1}
                    max={4094}
                    readOnly={paramFileHasBeenModifiedFromState}
                    id={vlanToggleId}
                    invalidText={t("invalidTextLabel", { ns: "common" })}
                    invalid={!vlanIdIsValid}
                    label={t("panel.networkDevice.vlanIdTextLabel", {
                        ns: "panels",
                    })}
                    helperText={t("panel.networkDevice.vlanIdHelp", {
                        ns: "panels",
                    })}
                    placeholder={t("panel.networkDevice.vlanIdPlaceholder", {
                        ns: "panels",
                    })}
                    value={vlanId}
                    translateWithId={(id) => t(id, { ns: "common" })}
                    onChange={(event, { value, direction }) => {
                        if (paramFileHasBeenModifiedFromState) return;

                        const vlanIdValue = value;
                        updateVlanId({
                            value: vlanIdValue,
                            valid: true,
                        });
                    }}
                    onBlur={(vlanId) => {
                        if (paramFileHasBeenModifiedFromState) return;

                        const vlanIdValue =
                            vlanId && vlanId.target && vlanId.target.value
                                ? vlanId.target.value
                                : "";
                        const vlanIdIsValid = isVlanIdValid(vlanIdValue);

                        if (!vlanIdIsValid) {
                            updateVlanId({
                                value: vlanIdValue,
                                valid: vlanIdIsValid,
                            });
                        }

                        document
                            .getElementById(
                                "helpPanelContents_networkDevice_para7"
                            )
                            ?.classList?.remove(
                                "help-panel__network-device__content__active"
                            );
                    }}
                    onFocus={() => {
                        document
                            .getElementById(
                                "helpPanelContents_networkDevice_para7"
                            )
                            ?.classList?.add(
                                "help-panel__network-device__content__active"
                            );
                    }}
                />
            )}
        </div>
    );

    const gridContentsMarkupRowTwoColumnTwo = (
        <div className="network-device_column-right">
            {state.selectedDeviceType &&
            state.selectedDeviceType === DEVICE_TYPE_OSA ? (
                <>
                    <TextInput
                        readOnly={paramFileHasBeenModifiedFromState}
                        helperText={t("panel.networkDevice.readChannelHelp", {
                            ns: "panels",
                        })}
                        id="network-device_read-channel-input"
                        key="network-device_read-channel-input"
                        invalidText={t("invalidTextLabel", { ns: "common" })}
                        invalid={!readChannelIdIsValid}
                        maxLength={16}
                        labelText={t(
                            "panel.networkDevice.readChannelTextLabel",
                            {
                                ns: "panels",
                            }
                        )}
                        placeholder={t(
                            "panel.networkDevice.readChannelPlaceholder",
                            {
                                ns: "panels",
                            }
                        )}
                        value={readChannelId}
                        onChange={(readChannelId) => {
                            if (paramFileHasBeenModifiedFromState) return;

                            const readChannelIdValue =
                                readChannelId?.target?.value ?? "";
                            const computedReadChannelIdValue =
                                toChannelSegments(
                                    readChannelIdValue.toLowerCase()
                                ).join(".");
                            updateReadChannelId({
                                value: readChannelIdValue,
                                computed: computedReadChannelIdValue,
                                valid: true,
                            });
                        }}
                        onBlur={(readChannelId) => {
                            if (paramFileHasBeenModifiedFromState) return;

                            const readChannelIdValue =
                                readChannelId?.target?.value ?? "";
                            const computedReadChannelIdValue =
                                toChannelSegments(
                                    readChannelIdValue.toLowerCase()
                                ).join(".");
                            const readChannelIdIsValid =
                                isReadChannelIdValid(readChannelIdValue);

                            if (!readChannelIdIsValid) {
                                updateReadChannelId({
                                    value: readChannelIdValue,
                                    computed: computedReadChannelIdValue,
                                    valid: readChannelIdIsValid,
                                });
                            }

                            document
                                .getElementById(
                                    "helpPanelContents_networkDevice_para4"
                                )
                                ?.classList?.remove(
                                    "help-panel__network-device__content__active"
                                );
                        }}
                        onFocus={() => {
                            document
                                .getElementById(
                                    "helpPanelContents_networkDevice_para4"
                                )
                                ?.classList?.add(
                                    "help-panel__network-device__content__active"
                                );
                        }}
                    />
                    {displayNoneUbuntuControl && (
                        <>
                            <TextInput
                                readOnly={paramFileHasBeenModifiedFromState}
                                helperText={t(
                                    "panel.networkDevice.writeChannelHelp",
                                    {
                                        ns: "panels",
                                    }
                                )}
                                id="network-device_write-channel-input"
                                key="network-device_write-channel-input"
                                invalidText={t("invalidTextLabel", {
                                    ns: "common",
                                })}
                                invalid={!writeChannelIdIsValid}
                                maxLength={16}
                                labelText={t(
                                    "panel.networkDevice.writeChannelTextLabel",
                                    {
                                        ns: "panels",
                                    }
                                )}
                                placeholder={t(
                                    "panel.networkDevice.writeChannelPlaceholder",
                                    {
                                        ns: "panels",
                                    }
                                )}
                                value={writeChannelId}
                                onChange={(writeChannelId) => {
                                    if (paramFileHasBeenModifiedFromState)
                                        return;

                                    const writeChannelIdValue =
                                        writeChannelId?.target?.value ?? "";
                                    const computedWriteChannelIdValue =
                                        toChannelSegments(
                                            writeChannelIdValue.toLowerCase()
                                        ).join(".");
                                    updateWriteChannelId({
                                        value: writeChannelIdValue,
                                        computed: computedWriteChannelIdValue,
                                        valid: true,
                                    });
                                }}
                                onBlur={(writeChannelId) => {
                                    if (paramFileHasBeenModifiedFromState)
                                        return;

                                    const writeChannelIdValue =
                                        writeChannelId?.target?.value ?? "";
                                    const computedWriteChannelIdValue =
                                        toChannelSegments(
                                            writeChannelIdValue.toLowerCase()
                                        ).join(".");
                                    const writeChannelIdIsValid =
                                        isWriteChannelIdValid(
                                            writeChannelIdValue
                                        );

                                    if (!writeChannelIdIsValid) {
                                        updateWriteChannelId({
                                            value: writeChannelIdValue,
                                            computed:
                                                computedWriteChannelIdValue,
                                            valid: writeChannelIdIsValid,
                                        });
                                    }

                                    document
                                        .getElementById(
                                            "helpPanelContents_networkDevice_para4"
                                        )
                                        ?.classList?.remove(
                                            "help-panel__network-device__content__active"
                                        );
                                }}
                                onFocus={() => {
                                    document
                                        .getElementById(
                                            "helpPanelContents_networkDevice_para4"
                                        )
                                        ?.classList?.add(
                                            "help-panel__network-device__content__active"
                                        );
                                }}
                            />
                            <TextInput
                                readOnly={paramFileHasBeenModifiedFromState}
                                helperText={t(
                                    "panel.networkDevice.dataChannelHelp",
                                    {
                                        ns: "panels",
                                    }
                                )}
                                id="network-device_data-channel-input"
                                key="network-device_data-channel-input"
                                invalidText={t("invalidTextLabel", {
                                    ns: "common",
                                })}
                                invalid={!dataChannelIdIsValid}
                                maxLength={16}
                                labelText={t(
                                    "panel.networkDevice.dataChannelTextLabel",
                                    {
                                        ns: "panels",
                                    }
                                )}
                                placeholder={t(
                                    "panel.networkDevice.dataChannelPlaceholder",
                                    {
                                        ns: "panels",
                                    }
                                )}
                                value={dataChannelId}
                                onChange={(dataChannelId) => {
                                    if (paramFileHasBeenModifiedFromState)
                                        return;

                                    const dataChannelIdValue =
                                        dataChannelId?.target?.value ?? "";
                                    const computedDataChannelIdValue =
                                        toChannelSegments(
                                            dataChannelIdValue.toLowerCase()
                                        ).join(".");
                                    updateDataChannelId({
                                        value: dataChannelIdValue,
                                        computed: computedDataChannelIdValue,
                                        valid: true,
                                    });
                                }}
                                onBlur={(dataChannelId) => {
                                    if (paramFileHasBeenModifiedFromState)
                                        return;

                                    const dataChannelIdValue =
                                        dataChannelId?.target?.value ?? "";
                                    const computedDataChannelIdValue =
                                        toChannelSegments(
                                            dataChannelIdValue.toLowerCase()
                                        ).join(".");
                                    const dataChannelIdIsValid =
                                        isDataChannelIdValid(
                                            dataChannelIdValue
                                        );

                                    if (!dataChannelIdIsValid) {
                                        updateDataChannelId({
                                            value: dataChannelIdValue,
                                            computed:
                                                computedDataChannelIdValue,
                                            valid: dataChannelIdIsValid,
                                        });
                                    }

                                    document
                                        .getElementById(
                                            "helpPanelContents_networkDevice_para4"
                                        )
                                        ?.classList?.remove(
                                            "help-panel__network-device__content__active"
                                        );
                                }}
                                onFocus={() => {
                                    document
                                        .getElementById(
                                            "helpPanelContents_networkDevice_para4"
                                        )
                                        ?.classList?.add(
                                            "help-panel__network-device__content__active"
                                        );
                                }}
                            />
                        </>
                    )}
                </>
            ) : null}
        </div>
    );

    const parmfileHasBeenModifiedNotificationMarkup = (
        <ActionableNotification
            hideCloseButton
            inline
            lowContrast
            className="network-device_parmfile-purge-banner"
            actionButtonLabel={t("btnLabel.Reset", { ns: "common" })}
            aria-label="closes notification"
            kind="info"
            onActionButtonClick={() => {
                resetParamFileTextAreaData({
                    updateParamFileContent,
                    globalUpdateModified,
                    updateModified,
                    state: globalState,
                });
            }}
            onClose={function noRefCheck() {}}
            onCloseButtonClick={function noRefCheck() {}}
            statusIconDescription="notification"
            subtitle={t("panel.parmFileHasBeenModifiedNotificationSubtitle", {
                ns: "common",
            })}
            title={t("modalHeading.discardParamFileModificationsPrompt")}
        />
    );

    const roceHelperMarkup = (
        <InlineNotification
            hideCloseButton
            statusIconDescription="notification"
            subtitle={t("panel.networkDevice.roceHelperNotificationSubtitle", {
                ns: "panels",
            })}
            title={t("panel.networkDevice.roceHelperNotificationTitle", {
                ns: "panels",
            })}
            kind="info"
            className="network-device_roce-helper-banner"
        />
    );

    return (
        <Layer className="network-device__layer">
            <FlexGrid className="network-device__grid">
                <Row>
                    <Column>
                        {paramFileHasBeenModifiedFromState &&
                            parmfileHasBeenModifiedNotificationMarkup}
                        {!displayRoCEControls && roceHelperMarkup}
                    </Column>
                </Row>
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
});

export default NetworkDevice;
