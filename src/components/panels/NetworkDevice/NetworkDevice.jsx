import React from "react";
import { Dropdown, TextInput, Grid, Column } from "@carbon/react";
import DeviceSettings from "./components/DeviceSettings";
import "./_network-device.scss";

const NetworkDevice = () => {
  const deviceTypeList = [
    {
      id: "option-1",
      label: "Option 1",
    },
    {
      id: "option-2",
      label: "Option 2",
    },
    {
      id: "option-3",
      label: "Option 3",
    },
    {
      id: "option-4",
      label: "Option 4",
    },
  ];
  return (
    <Grid className="" fullWidth>
      <Column sm={4} md={6} lg={6}>
        <div className="network-device_column-left">
          <Dropdown
            titleText="Device type"
            ariaLabel="Select a device type"
            id="device-type-selection"
            items={deviceTypeList}
            label="Select a device type"
            helperText="Helper text goes here"
            size="md"
            warn={false}
            invalid={false}
            disabled={false}
          />
          <DeviceSettings />
        </div>
      </Column>
      <Column sm={4} md={6} lg={6}>
        <div className="network-device_column-right">
          <TextInput
            helperText="Helper text goes here"
            id="read-channel-input"
            invalidText="A valid value is required"
            labelText="Read channel"
            placeholder="ex: 0.0.bdf0"
          />
          <TextInput
            helperText="Helper text goes here"
            id="write-channel-input"
            invalidText="A valid value is required"
            labelText="Write channel"
            placeholder="ex: 0.0.bdf1"
          />
          <TextInput
            helperText="Helper text goes here"
            id="data-channel-input"
            invalidText="A valid value is required"
            labelText="Data channel"
            placeholder="ex: 0.0.bdf2"
          />
        </div>
      </Column>
    </Grid>
  );
};

export default NetworkDevice;
