import React from "react";
import { RadioButtonGroup, RadioButton, TextInput, Toggle, Grid, Column } from "@carbon/react";
import "./_device-settings.scss";

const DeviceSettings = () => {
    return (
        <Grid className="" fullWidth>
          <Column sm={4}>
            <div className="">
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
                    toggled={true}
                />
            </div>
          </Column>
          <Column sm={4}>
            <div className="">
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
                    toggled={false}
                />
            </div>
          </Column>
        </Grid>
      );
}

export default DeviceSettings;
