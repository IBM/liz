/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  TextInput,
  Toggle,
  Grid,
  Column,
  RadioButtonGroup,
  RadioButton,
} from "@carbon/react";
import {
  PORT_NUMBER_ZERO,
  PORT_NUMBER_ONE,
  UPDATE_FUNCTION__LAYER,
  UPDATE_FUNCTION__USE_MULTIPORT,
  UPDATE_FUNCTION__PORT_NO,
  UPDATE_FUNCTION__PCI_FUNCTION_ID,
  UPDATE_FUNCTION__USER_IDENTIFIER,
} from "../../../../util/constants";
import { isHex } from "../../../../util/network-device-util";
import "./_device-settings.scss";

const DeviceSettings = ({ deviceSettingsId, updateFunction, state }) => {
  const { t } = useTranslation();

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
  };

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
  };

  const getDefaultSelected = () => {
    if (+state.portNo === 0) {
      return PORT_NUMBER_ZERO;
    } else if (+state.portNo === 1) {
      return PORT_NUMBER_ONE;
    }

    return PORT_NUMBER_ZERO;
  };

  const osaMarkup = (
    <>
      <Grid className="device-settings_grid" condensed>
        <Column sm={4} md={5} max={6}>
          <div className="device-settings_grid-column-left">
            <Toggle
              defaultToggled
              toggled={state.layer}
              labelText={t("panel.networkDevice.layerTwoToggleTextLabel", {
                ns: "panels",
              })}
              labelA={t("panel.networkDevice.layerTwoToggleTextLabelA", {
                ns: "panels",
              })}
              labelB={t("panel.networkDevice.layerTwoToggleTextLabelB", {
                ns: "panels",
              })}
              id="layer2-toggle"
              onToggle={(toggleState) => {
                updateFunction(UPDATE_FUNCTION__LAYER, toggleState);
              }}
            />
          </div>
        </Column>
        <Column sm={4} md={5} max={6}>
          <div className="device-settings_grid-column-right">
            <Toggle
              toggled={state.useMultiPort}
              labelText={t("panel.networkDevice.multiPortToggleTextLabel", {
                ns: "panels",
              })}
              labelA={t("btnLabel.No", { ns: "common" })}
              labelB={t("btnLabel.Yes", { ns: "common" })}
              id="portno-toggle"
              onToggle={(toggleState) => {
                updateFunction(UPDATE_FUNCTION__USE_MULTIPORT, toggleState);
              }}
            />
          </div>
        </Column>
      </Grid>
      {state.useMultiPort && (
        <Grid className="device-settings_grid" condensed>
          <Column sm={8} md={10} max={12}>
            <RadioButtonGroup
              className="network-device_port-number-radiobutton-group"
              legendText={t("panel.networkDevice.portNumberToggleTextLabel", {
                ns: "panels",
              })}
              helperText={t("panel.networkDevice.portNumberToggleHelp", {
                ns: "panels",
              })}
              name="network-device_port-number-group"
              defaultSelected={getDefaultSelected()}
              onChange={(selectedItem) => {
                const portOneToggled = selectedItem === PORT_NUMBER_ONE;
                updateFunction(UPDATE_FUNCTION__PORT_NO, portOneToggled);
              }}
            >
              <RadioButton
                labelText="Port 0"
                value={PORT_NUMBER_ZERO}
                id="network-device_portno-zero-radio"
              />
              <RadioButton
                labelText="Port 1"
                value={PORT_NUMBER_ONE}
                id="network-device_portno-one-radio"
              />
            </RadioButtonGroup>
          </Column>
        </Grid>
      )}
    </>
  );

  const roceLabelHasOptionalTag = (forLabel, label, optionalLabel) => {
    const hasValue = state[forLabel]?.value?.length > 0;
    const allValuesArePresent =
      state?.pciFunctionId?.value?.length > 0 &&
      state?.userIdentifier?.value?.length > 0;

    if (hasValue && !allValuesArePresent) {
      return optionalLabel;
    }

    return label;
  };

  const roceMarkup = (
    <Grid className="device-settings_grid" fullWidth>
      <Column sm={2} md={8} lg={16}>
        <div className="device-settings_grid-column-single">
          <TextInput
            id="pci-function-input"
            invalidText={t("invalidTextLabel", { ns: "common" })}
            invalid={
              state && state.pciFunctionId ? !state.pciFunctionId.valid : false
            }
            labelText={roceLabelHasOptionalTag(
              "userIdentifier",
              t("panel.networkDevice.fidTextLabel", { ns: "panels" }),
              t("panel.networkDevice.fidTextLabelOptional", { ns: "panels" }),
            )}
            helperText={t("panel.networkDevice.fidHelp", { ns: "panels" })}
            placeholder={t("panel.networkDevice.fidPlaceholder", {
              ns: "panels",
            })}
            value={state?.pciFunctionId?.value ?? ""}
            onChange={(pciFunctionId) => {
              const pciFunctionIdValue =
                pciFunctionId &&
                pciFunctionId.target &&
                pciFunctionId.target.value
                  ? pciFunctionId.target.value
                  : "";
              updateFunction(
                UPDATE_FUNCTION__PCI_FUNCTION_ID,
                pciFunctionIdValue,
                true,
              );
            }}
            onBlur={(pciFunctionId) => {
              const pciFunctionIdValue =
                pciFunctionId &&
                pciFunctionId.target &&
                pciFunctionId.target.value
                  ? pciFunctionId.target.value
                  : "";
              const pciFunctionIdIsValid =
                isPciFunctionIdValid(pciFunctionIdValue);
              updateFunction(
                UPDATE_FUNCTION__PCI_FUNCTION_ID,
                pciFunctionIdValue,
                pciFunctionIdIsValid,
              );
            }}
          />
          <TextInput
            id="user-identifier-input"
            invalidText={t("invalidTextLabel", { ns: "common" })}
            invalid={
              state && state.userIdentifier
                ? !state.userIdentifier.valid
                : false
            }
            labelText={roceLabelHasOptionalTag(
              "pciFunctionId",
              t("panel.networkDevice.uidTextLabel", { ns: "panels" }),
              t("panel.networkDevice.uidTextLabelOptional", { ns: "panels" }),
            )}
            helperText={t("panel.networkDevice.uidHelp", { ns: "panels" })}
            placeholder={t("panel.networkDevice.uidPlaceholder", {
              ns: "panels",
            })}
            value={state?.userIdentifier?.value ?? ""}
            onChange={(userIdentifier) => {
              const userIdentifierValue =
                userIdentifier &&
                userIdentifier.target &&
                userIdentifier.target.value
                  ? userIdentifier.target.value
                  : "";
              updateFunction(
                UPDATE_FUNCTION__USER_IDENTIFIER,
                userIdentifierValue,
                true,
              );
            }}
            onBlur={(userIdentifier) => {
              const userIdentifierValue =
                userIdentifier &&
                userIdentifier.target &&
                userIdentifier.target.value
                  ? userIdentifier.target.value
                  : "";
              const userIdentifierIsValid =
                isUserIdentifierValid(userIdentifierValue);
              updateFunction(
                UPDATE_FUNCTION__USER_IDENTIFIER,
                userIdentifierValue,
                userIdentifierIsValid,
              );
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
  return null;
};

DeviceSettings.propTypes = {
  deviceSettingsId: PropTypes.string.isRequired,
  updateFunction: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
};

export default DeviceSettings;
