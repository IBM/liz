import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Toggle, TextInput, Grid, Column } from "@carbon/react";
import "./_installation-parameters.scss";

const InstallationParameters = (patchState, localStorageKey) => {
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      useSsh: false,
      useVnc: false,
      installationAddress: {
        value: "",
        valid: false
      },
      vncHost: "",
      vncPassword: "",
      sshHost: ""
    };

    if (initialState) {
      return initialState
    }
    return defaultState;
  }
  const [state, setState] = useState(getInitialState);

  const updateUseSsh = (flag) => {
    setState((prevState) => ({...prevState, useSsh: flag}));
  }

  const updateUseVnc = (flag) => {
    setState((prevState) => ({...prevState, useVnc: flag}));
  }

  const updateInstallationAddress = (address, valid) => {
    setState((prevState) => ({...prevState, installationAddress: { value: address, valid }}));
  }

  const updateVncPassword = (password) => {
    setState((prevState) => ({...prevState, vncPassword: password}));
  }

  const isInstallationAddressInputValid = (url) => {
    let installationAddressInputIsValid = false;

    const expression = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    if (url.match(regex)) {
      installationAddressInputIsValid = true;
    }

    return installationAddressInputIsValid;
  }

  const useSshToggled = state.useSsh;
  const useVncToggled = state.useVnc;

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  });

  return (
    <>
      <TextInput
        helperText="Helper text goes here"
        id="installation-address-input"
        invalid={state && state.installationAddress ? !state.installationAddress.valid : false}
        invalidText="A valid value is required"
        labelText="Installation address"
        placeholder="ex: ftp://user:password@ftpserver/iso/SLE-15-SP3-Full-s390x-GM-Media1/"
        className="installation-parameters_installation-address-input"
        onChange={(url) => {
          const urlValue = url && url.target ? url.target.value : "";
          const urlValueIsValid = isInstallationAddressInputValid(urlValue);
          updateInstallationAddress(urlValue, urlValueIsValid);
          
          if (urlValueIsValid) {
            patchState({
              installationParameters: {
                networkInstallationUrl: state.installationAddress.value,
                vnc: {
                  password: state.vncPassword,
                  enabled: useVncToggled
                },
                ssh: {
                  host: state.sshHost,
                  enabled: useSshToggled
                },
                localStorageKey
              }
            });
          }
        }}
      />
      <Grid className="" fullWidth>
        <Column sm={4}>
          <div className="installation-parameters_column-left">
            <Toggle
              labelText="VNC for installation"
              labelA="Disable"
              labelB="Enable"
              id="vnc-toggle"
              defaultToggled={useVncToggled}
              onToggle={() => {
                if (useVncToggled) {
                  updateUseVnc(false);
                } else {
                  updateUseVnc(true);
                }
                patchState({
                  installationParameters: {
                    networkInstallationUrl: state.installationAddress,
                    vnc: {
                      password: state.vncPassword,
                      enabled: useVncToggled
                    },
                    ssh: {
                      host: state.sshHost,
                      enabled: useSshToggled
                    },
                    localStorageKey
                  }
                });
              }}
            />
            {useVncToggled &&
              <TextInput
                helperText="Helper text goes here"
                id="vnc-password-input"
                invalidText="A valid value is required"
                labelText="VNC password"
                placeholder="VNC password here"
                onChange={(password) => {
                  updateVncPassword(password && password.target ? password.target.value : "");
                  patchState({
                    installationParameters: {
                      networkInstallationUrl: state.installationAddress,
                      vnc: {
                        password: state.vncPassword,
                        enabled: useVncToggled
                      },
                      ssh: {
                        host: state.sshHost,
                        enabled: useSshToggled
                      },
                      localStorageKey
                    }
                  });
                }}
              />
            }
          </div>
        </Column>
        <Column sm={4}>
          <div className="installation-parameters_column-right">
            <Toggle
              labelText="SSH for installation"
              labelA="Disable"
              labelB="Enable"
              id="ssh-toggle"
              defaultToggled={useSshToggled}
              onToggle={() => {
                if (useSshToggled) {
                  updateUseSsh(false);
                } else {
                  updateUseSsh(true);
                }
                patchState({
                  installationParameters: {
                    networkInstallationUrl: state.installationAddress,
                    vnc: {
                      password: state.vncPassword,
                      enabled: useVncToggled
                    },
                    ssh: {
                      host: state.sshHost,
                      enabled: useSshToggled
                    }
                  }
                });
              }}
            />
          </div>
        </Column>
      </Grid>
    </>    
  );
};

InstallationParameters.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default InstallationParameters;
