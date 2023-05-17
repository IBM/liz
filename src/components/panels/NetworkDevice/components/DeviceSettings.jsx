import React from "react";
import { RadioButtonGroup, RadioButton, TextInput, Toggle, Grid, Column } from "@carbon/react";
import "./_device-settings.scss";

const DeviceSettings = () => {
    return (
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
}

export default DeviceSettings;
