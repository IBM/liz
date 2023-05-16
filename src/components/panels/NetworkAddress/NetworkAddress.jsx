import React from "react";
import { RadioButtonGroup, RadioButton, TextInput, Grid, Column } from "@carbon/react";
import "./_network-address.scss";

const NetworkAddress = () => {
  return (
    <Grid className="" fullWidth>
      <Column sm={4}>
        <div className="">
          <TextInput
            helperText=""
            id="hostname-input"
            invalidText="A valid value is required"
            labelText="Host name"
            placeholder="ex: linux.domain.com"
          />
          <div className="">
            <TextInput
              helperText=""
              id="broadcast-input1"
              invalidText="A valid value is required"
              labelText=""
              placeholder="10"
            />
            <span className="">.</span>
            <TextInput
              helperText=""
              id="broadcast-input2"
              invalidText="A valid value is required"
              labelText=""
              placeholder="0"
            />
            <span className="">.</span>
            <TextInput
              helperText=""
              id="broadcast-input3"
              invalidText="A valid value is required"
              labelText=""
              placeholder="0"
            />
            <span className="">.</span>
            <TextInput
              helperText=""
              id="broadcast-input4"
              invalidText="A valid value is required"
              labelText=""
              placeholder="255"
            />
          </div>
          <div className="">
            <TextInput
              helperText=""
              id="ns-input1"
              invalidText="A valid value is required"
              labelText=""
              placeholder="10"
            />
            <span className="">.</span>
            <TextInput
              helperText=""
              id="ns-input2"
              invalidText="A valid value is required"
              labelText=""
              placeholder="0"
            />
            <span className="">.</span>
            <TextInput
              helperText=""
              id="ns-input3"
              invalidText="A valid value is required"
              labelText=""
              placeholder="0"
            />
            <span className="">.</span>
            <TextInput
              helperText=""
              id="ns-input4"
              invalidText="A valid value is required"
              labelText=""
              placeholder="255"
            />
          </div>
        </div>
      </Column>
      <Column sm={4}>
        <div className="">
          <RadioButtonGroup
            legendText="Host IP"
            name="radio-button-group"
            defaultSelected="radio-1">
            <RadioButton
              labelText="Single"
              value="radio-1"
              id="hostip-range-radio-1"
            />
            < RadioButton
              labelText="Range"
              value="radio-2"
              id="hostip-range-radio-2"
            />
          </RadioButtonGroup>
          <div className="">
          <TextInput
              helperText=""
              id="hostip-range-input1"
              invalidText="A valid value is required"
              labelText=""
              placeholder="00.0.0.000"
            />
            <span className="">-</span>
            <TextInput
              helperText=""
              id="hostip-range-input2"
              invalidText="A valid value is required"
              labelText=""
              placeholder="00.0.0.000"
            />
          </div>
          <div className="">
            <TextInput
              helperText=""
              id="gateway-input1"
              invalidText="A valid value is required"
              labelText=""
              placeholder="10"
            />
            <span className="">.</span>
            <TextInput
              helperText=""
              id="gateway-input2"
              invalidText="A valid value is required"
              labelText=""
              placeholder="0"
            />
            <span className="">.</span>
            <TextInput
              helperText=""
              id="gateway-input3"
              invalidText="A valid value is required"
              labelText=""
              placeholder="0"
            />
            <span className="">.</span>
            <TextInput
              helperText=""
              id="gateway-input4"
              invalidText="A valid value is required"
              labelText=""
              placeholder="255"
            />
          </div>
          <div className="">
            <TextInput
              helperText=""
              id="netmask-input1"
              invalidText="A valid value is required"
              labelText=""
              placeholder="10"
            />
            <span className="">.</span>
            <TextInput
              helperText=""
              id="netmask-input2"
              invalidText="A valid value is required"
              labelText=""
              placeholder="0"
            />
            <span className="">.</span>
            <TextInput
              helperText=""
              id="netmask-input3"
              invalidText="A valid value is required"
              labelText=""
              placeholder="0"
            />
            <span className="">.</span>
            <TextInput
              helperText=""
              id="netmask-input4"
              invalidText="A valid value is required"
              labelText=""
              placeholder="255"
            />
          </div>
        </div>
      </Column>
    </Grid>
  );
};

export default NetworkAddress;
