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
  ToggletipLabel,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  Grid,
  Column,
} from "@carbon/react";
import { Information } from "@carbon/react/icons";
import { isHex } from "../../../../util/network-device-util";
import "./_device-settings.scss";

const DeviceSettings = ({
  deviceSettingsId,
  patchState,
  updateFunction,
  state,
}) => {
  const UPDATE_FUNCTION__LAYER = "layer";
  const UPDATE_FUNCTION__PORT_NO = "portNo";
  const UPDATE_FUNCTION__PCI_FUNCTION_ID = "pciFunctionId";
  const UPDATE_FUNCTION__USER_IDENTIFIER = "userIdentifier";

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

  const getContent = (value) => {
    return <p>{value}</p>;
  };

  const getLabel = (label, buttonLabel, content) => {
    return (
      <>
        <ToggletipLabel>{label}</ToggletipLabel>
        <Toggletip className="misc-parameters_info-icon" align="right-bottom">
          <ToggletipButton label={buttonLabel}>
            <Information />
          </ToggletipButton>
          <ToggletipContent>{content}</ToggletipContent>
        </Toggletip>
      </>
    );
  };

  const osaMarkup = (
    <Grid className="device-settings_grid" condensed>
      <Column sm={4} md={5} max={6}>
        <div className="device-settings_grid-column-left">
          <Toggle
            defaultToggled
            toggled={state.layer}
            labelText={getLabel(
              t("panel.networkDevice.layerTwoToggleTextLabel"),
              t("showInformationLabel", { ns: "common" }),
              getContent(t("panel.networkDevice.layerTwoToggleHelp")),
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
      <Column sm={4} md={5} max={6}>
        <div className="device-settings_grid-column-right">
          <Toggle
            toggled={state.portNo}
            labelText={getLabel(
              t("panel.networkDevice.portNumberToggleTextLabel"),
              t("showInformationLabel", { ns: "common" }),
              getContent(t("panel.networkDevice.portNumberToggleHelp")),
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

  const roceLabelHasOptionalTag = (forLabel, label, optionalLabel) => {
    const hasValue = state[forLabel]?.value?.length > 0 ?? false;
    const allValuesArePresent =
      (state?.pciFunctionId?.value?.length > 0 ?? false) &&
      (state?.userIdentifier?.value?.length > 0 ?? false);

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
            labelText={getLabel(
              roceLabelHasOptionalTag(
                "userIdentifier",
                t("panel.networkDevice.fidTextLabel"),
                t("panel.networkDevice.fidTextLabelOptional"),
              ),
              t("showInformationLabel", { ns: "common" }),
              getContent(t("panel.networkDevice.fidHelp")),
            )}
            placeholder={t("panel.networkDevice.fidPlaceholder")}
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
            labelText={getLabel(
              roceLabelHasOptionalTag(
                "pciFunctionId",
                t("panel.networkDevice.uidTextLabel"),
                t("panel.networkDevice.uidTextLabelOptional"),
              ),
              t("showInformationLabel", { ns: "common" }),
              getContent(t("panel.networkDevice.uidHelp")),
            )}
            placeholder={t("panel.networkDevice.uidPlaceholder")}
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
  patchState: PropTypes.func.isRequired,
  updateFunction: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
};

export default DeviceSettings;
