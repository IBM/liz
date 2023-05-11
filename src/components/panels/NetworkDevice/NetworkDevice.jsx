import React from "react";
import { Dropdown, TextInput, Grid, Column } from "@carbon/react";
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
      <Column sm={4}>
        <div className="">
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
        </div>
      </Column>
      <Column sm={4}>
        <div className="">
          <TextInput
            helperText="Helper text goes here"
            id="read-channel-input"
            invalidText="A valid value is required"
            labelText="Read channel"
            placeholder="ex: 0.0.bdf0"
          />
        </div>
      </Column>
    </Grid>
  );
};

export default NetworkDevice;
