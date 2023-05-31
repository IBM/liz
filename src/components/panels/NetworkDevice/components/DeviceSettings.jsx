import React from "react";
import PropTypes from "prop-types";
import { RadioButtonGroup, RadioButton, TextInput, Toggle, Grid, Column } from "@carbon/react";
import "./_device-settings.scss";

const DeviceSettings = ({ deviceSettingsId }) => {

    const osaMarkup = (
        <Grid className="device-settings_grid" fullWidth>
          <Column sm={3}>
            <div className="device-settings_grid-column-left">
                <RadioButtonGroup
                    legendText="OSA interface"
                    name="radio-button-group"
                    defaultSelected="radio-1">
                    <RadioButton
                        labelText="qdio"
                        value="radio-1"
                        id="osa-iface-radio-1"
                    />
                    < RadioButton
                        labelText="option 2"
                        value="radio-2"
                        id="osa-iface-radio-2"
                    />
                </RadioButtonGroup>
                <Toggle
                    labelText="Layer2"
                    labelA="0"
                    labelB="1"
                    defaultToggled
                    id="layer2-toggle"
                />
            </div>
          </Column>
          <Column sm={3}>
            <div className="device-settings_grid-column-right">
                <TextInput
                    id="read-channel-input"
                    invalidText="A valid value is required"
                    labelText="OSA hw address"
                    placeholder="qdio"
                />
                <Toggle
                    labelText="Portno"
                    labelA="0"
                    labelB="1"
                    defaultToggled
                    id="portno-toggle"
                />
            </div>
          </Column>
        </Grid>
    );

    const roceMarkup = (
        <Grid className="device-settings_grid" fullWidth>
          <Column sm={4} md={6} lg={6}>
            <div className="device-settings_grid-column-single">
                <TextInput
                    id="pci-function-input"
                    invalidText="A valid value is required"
                    labelText="PCI function ID"
                    placeholder="e.g. 0x0100"
                />
                <TextInput
                    id="user-identifier-input"
                    invalidText="A valid value is required"
                    labelText="User identifier"
                    placeholder="e.g. 0x1234"
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
    deviceSettingsId: PropTypes.string.isRequired
  };

export default DeviceSettings;
