import React, { useState } from "react";
import PropTypes from "prop-types";
import { Toggle, TextInput, Grid, Column } from "@carbon/react";
import "./_installation-parameters.scss";

const InstallationParameters = (patchState) => {
  const [state, setState] = useState({
    useSsh: false,
    useVnc: false,
    installationAddress: "",
    vncHost: "",
    vncPassword: "",
    sshHost: ""
  });

  const updateUseSsh = (flag) => {
    setState({ ...state, useSsh: flag });
  }

  const updateUseVnc = (flag) => {
    setState({ ...state, useVnc: flag });
  }

  const updateInstallationAddress = (address) => {
    setState({ ...state, installationAddress: address });
  }

  const updateVncHost = (host) => {
    setState({ ...state, vncHost: host });
  }

  const updateVncPassword = (password) => {
    setState({ ...state, vncPassword: password });
  }

  const updateSshHost = (host) => {
    setState({ ...state, sshHost: host });
  }

  return (
    <>
      <TextInput
        helperText="Helper text goes here"
        id="installation-address-input"
        invalidText="A valid value is required"
        labelText="Installation address"
        placeholder="ex: ftp://user:password@ftpserver/iso/SLE-15-SP3-Full-s390x-GM-Media1/"
        className="installation-parameters_installation-address-input"
        onChange={(url) => {
          updateInstallationAddress(url && url.target ? url.target.value : "");
          patchState({
            installationParameters: {
              networkInstallationUrl: state.installationAddress,
              vnc: {
                host: state.vncHost,
                password: state.vncPassword
              },
              ssh: {
                host: state.sshHost
              }
            }
          });
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
              defaultToggled={state.useVnc}
              onToggle={() => {
                if (state.useVnc) {
                  updateUseVnc(false);
                }
                updateUseVnc(true);
              }}
            />
            {state.useVnc &&
              <>
                <TextInput
                  helperText="Helper text goes here"
                  id="vnc-host-input"
                  invalidText="A valid value is required"
                  labelText="VNC host"
                  placeholder="ex: 10.0.0.1"
                  onChange={(host) => {
                    updateVncHost(host && host.target ? host.target.value : "");
                    patchState({
                      installationParameters: {
                        networkInstallationUrl: state.installationAddress,
                        vnc: {
                          host: state.vncHost,
                          password: state.vncPassword
                        },
                        ssh: {
                          host: state.sshHost
                        }
                      }
                    });
                  }}
                />
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
                          host: state.vncHost,
                          password: state.vncPassword
                        },
                        ssh: {
                          host: state.sshHost
                        }
                      }
                    });
                  }}
                />
              </>
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
              defaultToggled={state.useSsh}
              onToggle={() => {
                if (state.useSsh) {
                  updateUseSsh(false);
                }
                updateUseSsh(true);
              }}
            />
            {state.useSsh &&
              <TextInput
                helperText="Helper text goes here"
                id="ssh-host-input"
                invalidText="A valid value is required"
                labelText="SSH host"
                placeholder="ex: 10.0.0.1"
                onChange={(host) => {
                  updateSshHost(host && host.target ? host.target.value : "");
                  patchState({
                    installationParameters: {
                      networkInstallationUrl: state.installationAddress,
                      vnc: {
                        host: state.vncHost,
                        password: state.vncPassword
                      },
                      ssh: {
                        host: state.sshHost
                      }
                    }
                  });
                }}
              />
            }
          </div>
        </Column>
      </Grid>
    </>    
  );
};

InstallationParameters.propTypes = {
  patchState: PropTypes.func.isRequired
};

export default InstallationParameters;
