/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Layer, Toggle, ToggletipLabel, Toggletip, ToggletipButton, ToggletipContent, TextInput, Grid, Column } from "@carbon/react";
import { Information } from '@carbon/react/icons';
import "./_installation-parameters.scss";

const SUPPORTED_PROTOCOLS = [
  "http",
  "https",
  "ftp"
];

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
      const urlParts = url.split("://");
      if (SUPPORTED_PROTOCOLS.indexOf(urlParts[0]) >= 0) {
        installationAddressInputIsValid = true;
      }
    }

    return installationAddressInputIsValid;
  }

  const content = (
    <p>
      Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed
      do eiusmod tempor incididunt ut fsil labore et dolore magna
      aliqua.
    </p>
  );

  const getLabel = (label, buttonLabel, content) => {
    return (
        <>
        <ToggletipLabel>{label}</ToggletipLabel>
        <Toggletip className="misc-parameters_info-icon" align="right-bottom">
            <ToggletipButton label={buttonLabel}>
            <Information/>
            </ToggletipButton>
            <ToggletipContent>
            {content}
            </ToggletipContent>
        </Toggletip>
        </>
    );
  }

  const useSshToggled = state.useSsh;
  const useVncToggled = state.useVnc;

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
    patchState({
      steps: {
        installationParameters: {
          complete: true,
          disabled: true,
          invalid: false
        }
      }
    });
  }, []);

  return (
    <Layer>
      <Grid className="installation-parameters__grid" fullWidth>
        <Column max={10}>
          <TextInput
            helperText=""
            id="installation-address-input"
            invalid={state && state.installationAddress ? !state.installationAddress.valid : false}
            invalidText="A valid value is required"
            labelText={getLabel(
              "Installation address",
              "Show information",
              content
            )}
            placeholder="ex: ftp://user:password@ftpserver/iso/SLE-15-SP3-Full-s390x-GM-Media1/"
            className="installation-parameters_installation-address-input"
            defaultValue={state.installationAddress ? state.installationAddress.value : ""}
            value={state.installationAddress ? state.installationAddress.value : ""}
            onChange={(url) => {
              const urlValue = url && url.target ? url.target.value : "";
              const urlValueIsValid = isInstallationAddressInputValid(urlValue);
              updateInstallationAddress(urlValue, urlValueIsValid);
            }}
            onBlur={(url) => {
              const urlValue = url && url.target ? url.target.value : "";
              const urlValueIsValid = isInstallationAddressInputValid(urlValue);
            
              if (urlValueIsValid) {
                patchState({
                  steps: {
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
                  }
                });
              }
            }}
          />
        </Column>
      </Grid>
      <Grid className="installation-parameters__grid" fullWidth>
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
                  steps: {
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
                  }
                });
              }}
            />
            {useVncToggled &&
              <TextInput
                helperText=""
                id="vnc-password-input"
                invalidText="A valid value is required"
                labelText={getLabel(
                  "VNC password",
                  "Show information",
                  content
                )}
                placeholder="VNC password here"
                defaultValue={state.vncPassword ? state.vncPassword : ""}
                value={state.vncPassword ? state.vncPassword : ""}
                onChange={(password) => {
                  updateVncPassword(password && password.target ? password.target.value : "");
                }}
                onBlur={(password) => {
                  updateVncPassword(password && password.target ? password.target.value : "");
                  patchState({
                    steps: {
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
                  steps: {
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
                  }
                });
              }}
            />
          </div>
        </Column>
      </Grid>
    </Layer>    
  );
};

InstallationParameters.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default InstallationParameters;
