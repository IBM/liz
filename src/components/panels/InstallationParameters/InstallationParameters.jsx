import React from "react";
import { Toggle, TextInput, Grid, Column } from "@carbon/react";
import "./_installation-parameters.scss";

const InstallationParameters = () => {
  return (
    <>
      <TextInput
        helperText="Helper text goes here"
        id="installation-address-input"
        invalidText="A valid value is required"
        labelText="Installation address"
        placeholder="ex: ftp://user:password@ftpserver/iso/SLE-15-SP3-Full-s390x-GM-Media1/"
        className="installation-parameters_installation-address-input"
      />
      <Grid className="" fullWidth>
        <Column sm={4}>
          <div className="installation-parameters_column-left">
            <Toggle
              labelText="VNC for installation"
              labelA="Disable"
              labelB="Enable"
              defaultToggled
              id="vnc-toggle"
              onToggle={() => {
                return null;
              }}
            />
            <TextInput
              helperText="Helper text goes here"
              id="vnc-host-input"
              invalidText="A valid value is required"
              labelText="VNC host"
              placeholder="ex: 10.0.0.1"
            />
            <TextInput
              helperText="Helper text goes here"
              id="vnc-password-input"
              invalidText="A valid value is required"
              labelText="VNC password"
              placeholder="VNC password here"
            />
          </div>
        </Column>
        <Column sm={4}>
          <div className="installation-parameters_column-right">
            <Toggle
              labelText="SSH for installation"
              labelA="Disable"
              labelB="Enable"
              defaultToggled
              id="ssh-toggle"
              onToggle={() => {
                return null;
              }}
            />
            <TextInput
              helperText="Helper text goes here"
              id="ssh-host-input"
              invalidText="A valid value is required"
              labelText="SSH host"
              placeholder="ex: 10.0.0.1"
            />
          </div>
        </Column>
      </Grid>
    </>    
  );
};

export default InstallationParameters;
