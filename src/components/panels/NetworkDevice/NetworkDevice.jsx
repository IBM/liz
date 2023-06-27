import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dropdown, TextInput, Grid, Column } from "@carbon/react";
import DeviceSettings from "./components/DeviceSettings";
import "./_network-device.scss";

const NetworkDevice = (patchState, localStorageKey) => {
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      selectedDeviceType: {}
    };

    if (initialState) {
      return initialState
    }
    return defaultState;
  }
  const [state, setState] = useState(getInitialState);

  const updateSelectedDeviceType = (selectedDeviceType) => {
    setState((prevState) => ({...prevState, selectedDeviceType}));
  }

  const deviceTypeList = [
    {
      id: "network-device_osa-option",
      label: "OSA",
    },
    {
      id: "network-device_roce-option",
      label: "RoCE",
    }
  ];

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  });

  return (
    <Grid className="" fullWidth>
      <Column sm={4} md={6} lg={6}>
        <div className="network-device_column-left">
          <Dropdown
            titleText="Device type"
            ariaLabel="Select a device type"
            id="network-device_device-type-selection"
            items={deviceTypeList}
            label="Select a device type"
            helperText="Helper text goes here"
            size="md"
            warn={false}
            invalid={false}
            disabled={false}
            onChange={({ selectedItem }) => updateSelectedDeviceType(selectedItem)}
            selectedItem={state.selectedDeviceType}
          />
          <DeviceSettings deviceSettingsId={state.selectedDeviceType ? state.selectedDeviceType.id : ""} />
        </div>
      </Column>
      <Column sm={4} md={6} lg={6}>
        <div className="network-device_column-right">
          {state.selectedDeviceType && state.selectedDeviceType.id === "network-device_osa-option"
            ?
            (
              <>
                <TextInput
                  helperText="Helper text goes here"
                  id="network-device_read-channel-input"
                  invalidText="A valid value is required"
                  labelText="Read channel"
                  placeholder="ex: 0.0.bdf0"
                />
                <TextInput
                  helperText="Helper text goes here"
                  id="network-device_write-channel-input"
                  invalidText="A valid value is required"
                  labelText="Write channel"
                  placeholder="ex: 0.0.bdf1"
                />
                <TextInput
                  helperText="Helper text goes here"
                  id="network-device_data-channel-input"
                  invalidText="A valid value is required"
                  labelText="Data channel"
                  placeholder="ex: 0.0.bdf2"
                />
              </>
            )
            :
            (null) 
          }
        </div>
      </Column>
    </Grid>
  );
};

NetworkDevice.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default NetworkDevice;
