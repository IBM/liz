import React from "react";
import { RadioButtonGroup, RadioButton, TextInput, Grid, Column } from "@carbon/react";
import "./_network-address.scss";

const NetworkAddress = () => {
  return (
    <Grid className="" fullWidth>
      <Column sm={2} md={3} lg={4}>
        <div className="network-address_column-left">
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
              id="broadcast-address-input"
              invalidText="A valid value is required"
              labelText="Broadcast"
              placeholder="10.0.0.255"
            />
          </div>
          <div className="">
            <TextInput
              helperText=""
              id="ns-address-input"
              invalidText="A valid value is required"
              labelText="Name server"
              placeholder="10.0.0.255"
            />
          </div>
        </div>
      </Column>
      <Column sm={4} md={6} lg={8}>
        <div className="network-address_column-right">
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
          <div className="network-address_hostip-range">
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
              id="gateway-address-input"
              invalidText="A valid value is required"
              labelText="Gateway"
              placeholder="10.0.0.255"
            />
          </div>
          <div className="">
            <TextInput
              helperText=""
              id="netmask-input"
              invalidText="A valid value is required"
              labelText="Net mask"
              placeholder="10.0.0.255"
            />
          </div>
        </div>
      </Column>
    </Grid>
  );
};

export default NetworkAddress;
