/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Layer, RadioButtonGroup, RadioButton, ToggletipLabel, Toggletip, ToggletipButton, ToggletipContent, TextInput, Grid, Column } from "@carbon/react";
import { Information } from '@carbon/react/icons';
import "./_network-address.scss";

const ADDRESS_TYPE_IPV4 = "radio-ipv4";
const ADDRESS_TYPE_IPV6 = "radio-ipv6";

const NetworkAddress = (patchState, localStorageKey) => {
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      netmask: {
        value: "",
        valid: false
      },
      ipv4Cidr: {
        value: "",
        valid: false
      },
      ipv6Cidr: {
        value: "",
        valid: false
      },
      binary: "",
      addressType: ADDRESS_TYPE_IPV4,
      ipv4Address: {
        value: "",
        valid: false
      },
      ipv6Address: {
        value: "",
        valid: false
      },
      gatewayIpAddress: {
        value: "",
        valid: false
      },
      nameserverIpAddress: {
        value: "",
        valid: false
      }
    };

    if (initialState) {
      return initialState
    }
    return defaultState;
  }
  const [state, setState] = useState(getInitialState);

  const updateNetmask = (netmask, valid) => {
    setState((prevState) => ({...prevState, netmask: { value: netmask, valid }}));
  }

  const updateIpv4Cidr = (ipv4Cidr, valid) => {
    setState((prevState) => ({...prevState, ipv4Cidr: { value: ipv4Cidr, valid }}));
  }

  const updateIpv6Cidr = (ipv6Cidr, valid) => {
    setState((prevState) => ({...prevState, ipv6Cidr: { value: ipv6Cidr, valid }}));
  }

  const updateBinary = (binary) => {
    setState((prevState) => ({...prevState, binary}));
  }

  const updateAddressType = (addressType) => {
    setState((prevState) => ({...prevState, addressType}));
  }

  const updateIpv4Address = (ipv4Address, valid) => {
    setState((prevState) => ({...prevState, ipv4Address: { value: ipv4Address, valid }}));
  }

  const updateIpv6Address = (ipv6Address, valid) => {
    setState((prevState) => ({...prevState, ipv6Address: { value: ipv6Address, valid }}));
  }

  const updateGatewayAddress = (gatewayIpAddress, valid) => {
    setState((prevState) => ({...prevState, gatewayIpAddress: { value: gatewayIpAddress, valid }}));
  }

  const updateNameserverAddress = (nameserverIpAddress, valid) => {
    setState((prevState) => ({...prevState, nameserverIpAddress: { value: nameserverIpAddress, valid }}));
  }

  const isCidr = (addressType, cidr) => {
    const isInteger = typeof cidr === "string"
      ? Number.isInteger(parseInt(cidr))
      : Number.isInteger(cidr);
    if (addressType === ADDRESS_TYPE_IPV4 && isInteger) {
      const decimal = Math.trunc(cidr);
      return decimal <= 32;
    } else if (addressType === ADDRESS_TYPE_IPV6 && isInteger) {
      const decimal = Math.trunc(cidr);
      return decimal <= 128;
    }
    return false;
  } 

  const netmaskToCidr = (netmask) => {
    let cidr = 0;

    if (netmask) {
      const maskNodes = netmask.match(/(\d+)/g);

      for(const i in maskNodes)
      {
        cidr += (((maskNodes[i] >>> 0).toString(2)).match(/1/g) || []).length;
      }
    }
    return cidr;
  }

  const cidrToNetmask = (cidr) => {
    const isInteger = typeof cidr === "string" ? Number.isInteger(parseInt(cidr)) : Number.isInteger(cidr);
    const mask = [];
    let i;
    let n;

    if (isInteger && cidr) {
      for(i=0; i<4; i++) {
        n = Math.min(cidr, 8);
        mask.push(256 - Math.pow(2, 8-n));
        cidr -= n;
      }
    }
    return mask.join('.');
  }

  const pad = (value, width, padchar) => {
    while (value.length < width) {
      value += padchar;
    }
    return value;
  }

  const netmaskToBinary = (netmask) => {
    let binary;

    if (netmask) {
      const parts = netmask.split(".");

      const newParts = [];
      parts.forEach(part => {
        const dec2bin = parseInt(part).toString(2);
        newParts.push(pad(dec2bin, 8, "0"));
      })
      
      binary = newParts.join(".");
    }
    return binary;
  }

  const isIpv4NetworkAddressValid = (ipv4Address) => {
    const match = ipv4Address.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    return match != null &&
      match[1] <= 255 &&
      match[2] <= 255 &&
      match[3] <= 255 &&
      match[4] <= 255;
  }

  const isIpv6NetworkAddressValid = (ipv6Address) => {
    const regexExp = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi;
    return regexExp.test(ipv6Address);
  }

  const isV4AddressComplete = () => {
    if (
      !state.ipv4Cidr ||
      !state.gatewayIpAddress ||
      !state.nameserverIpAddress
    ) {
      return false;
    }
    return state.ipv4Cidr.valid &&
      state.netmask.valid &&
      state.ipv4Address.valid &&
      state.gatewayIpAddress.valid &&
      state.nameserverIpAddress.valid;
  }

  const isV6AddressComplete = () => {
    if (
      !state.ipv6Cidr ||
      !state.gatewayIpAddress ||
      !state.nameserverIpAddress
    ) {
      return false;
    }
    return state.ipv6Cidr.valid &&
      state.ipv4Address.valid &&
      state.gatewayIpAddress.valid &&
      state.nameserverIpAddress.valid;
  }

  const isIpAddressValid = () => {
    return state.addressType === ADDRESS_TYPE_IPV4
      ? isV4AddressComplete()
      : isV6AddressComplete();
  }

  const isComplete = () => {
    return state.addressType &&
      isIpAddressValid();
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

  const PLACEHOLDER_GATEWAY_ADDRESS_IPV4 = "192.168.178.1";
  const PLACEHOLDER_GATEWAY_ADDRESS_IPV6 = "0000:0000:0000:0000:0000:ffff:c0a8:b201";
  const PLACEHOLDER_NAMESERVER_ADDRESS_IPV4 = "192.168.178.20";
  const PLACEHOLDER_NAMESERVER_ADDRESS_IPV6 = "0000:0000:0000:0000:0000:ffff:c0a8:b214";

  useEffect(() => () => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  });

  return (
    <Layer>
      <Grid className="network-address__horizontal-grid" fullWidth>
        <Column sm={2} md={6} lg={10}>
          <div className="network-address_column-left">
            <RadioButtonGroup
              className="network-address_ip-version-group"
              legendText="Internet protocol version"
              name="network-address_ip-version-group"
              defaultSelected={state.addressType}
              onChange={(selected) => {
                updateAddressType(selected);
              }}>
              <RadioButton
                labelText="IPv4"
                value={ADDRESS_TYPE_IPV4}
                id="network-address_ipv4-radio"
              />
              <RadioButton
                labelText="IPv6"
                value={ADDRESS_TYPE_IPV6}
                id="network-address_ipv6-radio"
              />
            </RadioButtonGroup>
          </div>
        </Column>
      </Grid>
      <Grid className="network-address__vertical-grid" fullWidth>
        <Column sm={2} md={3} lg={5}>
          <div className="network-address_column-left">
            {state.addressType === ADDRESS_TYPE_IPV4 &&
              <>
                <TextInput
                  id="network-address_ipv4-input"
                  invalidText="A valid value is required"
                  invalid={state && state.ipv4Address ? !state.ipv4Address.valid : false}
                  labelText={getLabel(
                    "IPv4 address",
                    "Show information",
                    content
                  )}
                  placeholder="192.168.178.22"
                  value={state.ipv4Address ? state.ipv4Address.value : ""}
                  onChange={(localAddress) => {
                    const localAddressValue = localAddress && localAddress.target && localAddress.target.value
                      ? localAddress.target.value
                      : "";
                    const localAddressValueIsValid = isIpv4NetworkAddressValid(localAddressValue);
                    updateIpv4Address(localAddressValue, localAddressValueIsValid);

                    if (localAddressValueIsValid) {
                      patchState({
                        steps: {
                          networkAddress: {
                            addressType: state.addressType,
                            ipv4: {
                              cidr: state.ipv4Cidr ? state.ipv4Cidr.value : "",
                              binary: state.binary,
                              netmask: state.netmask ? state.netmask.value : "",
                              address: state.ipv4Address ? state.ipv4Address.value : ""
                            },
                            ipv6: {
                              cidr: state.ipv6Cidr ? state.ipv6Cidr.value : "",
                              address: state.ipv6Address ? state.ipv6Address.value : ""
                            },
                            gatewayIpAddress: state.gatewayIpAddress ? state.gatewayIpAddress.value : "",
                            nameserverIpAddress: state.nameserverIpAddress ? state.nameserverIpAddress.value : "",
                            complete: isComplete() || false,
                            localStorageKey: "com.ibm.systems.linux.z.networkAddress"
                          }
                        }
                      });
                    } else {
                      patchState({
                        steps: {
                          networkAddress: {
                            invalid: true,
                            complete: true
                          }
                        }
                      });
                    }
                  }}
                />
                <TextInput
                  id="network-address_ipv4-prefix"
                  invalid={state && state.ipv4Cidr ? !state.ipv4Cidr.valid : false}
                  invalidText="A valid value is required"
                  labelText={getLabel(
                    "IPv4 prefix",
                    "Show information",
                    content
                  )}
                  placeholder="32"
                  value={state.ipv4Cidr ? state.ipv4Cidr.value : ""}
                  onChange={(localCidr) => {
                    const localCidrValue = localCidr && localCidr.target && localCidr.target.value
                      ? localCidr.target.value
                      : "";
                    const parsed = cidrToNetmask(localCidrValue);
                    const localCidrValueIsValid = isCidr(ADDRESS_TYPE_IPV4, localCidrValue);

                    updateIpv4Cidr(localCidrValue, localCidrValueIsValid);

                    if (localCidrValueIsValid && parsed) {
                      updateNetmask(parsed, true);
                      updateBinary(netmaskToBinary(parsed));
                      patchState({
                        steps: {
                          networkAddress: {
                            addressType: state.addressType,
                            ipv4: {
                              cidr: state.ipv4Cidr ? state.ipv4Cidr.value : "",
                              binary: state.binary,
                              netmask: state.netmask ? state.netmask.value : "",
                              address: state.ipv4Address ? state.ipv4Address.value : ""
                            },
                            ipv6: {
                              cidr: state.ipv6Cidr ? state.ipv6Cidr.value : "",
                              address: state.ipv6Address ? state.ipv6Address.value : ""
                            },
                            gatewayIpAddress: state.gatewayIpAddress ? state.gatewayIpAddress.value : "",
                            nameserverIpAddress: state.nameserverIpAddres ? state.nameserverIpAddress.value : "",
                            complete: isComplete() || false,
                            localStorageKey: "com.ibm.systems.linux.z.networkAddress"
                          }
                        }
                      });
                    } else {
                      patchState({
                        steps: {
                          networkAddress: {
                            invalid: true,
                            complete: true
                          }
                        }
                      });
                    }
                  }}
                />
                <TextInput
                  id="network-address_ipv4-netmask"
                  invalid={state && state.netmask ? !state.netmask.valid : false}
                  invalidText="A valid value is required"
                  labelText={getLabel(
                    "IPv4 netmask",
                    "Show information",
                    content
                  )}
                  placeholder="255.255.128.0"
                  value={state.netmask ? state.netmask.value : ""}
                  onChange={(localNetmask) => {
                    const localNetmaskValue = localNetmask && localNetmask.target && localNetmask.target.value
                      ? localNetmask.target.value
                      : "";
                    const parsed = netmaskToCidr(localNetmaskValue);
                    const localNetmaskValueIsValid = isIpv4NetworkAddressValid(localNetmaskValue);

                    updateNetmask(localNetmaskValue, localNetmaskValueIsValid);

                    if (localNetmaskValueIsValid && parsed) {
                      updateIpv4Cidr(parsed, true);
                      updateBinary(netmaskToBinary(localNetmaskValue));
                      patchState({
                        steps: {
                          networkAddress: {
                            addressType: state.addressType,
                            ipv4: {
                              cidr: state.ipv4Cidr ? state.ipv4Cidr.value : "",
                              binary: state.binary,
                              netmask: state.netmask ? state.netmask.value : "",
                              address: state.ipv4Address ? state.ipv4Address.value : ""
                            },
                            ipv6: {
                              cidr: state.ipv6Cidr ? state.ipv6Cidr.value : "",
                              address: state.ipv6Address ? state.ipv6Address.value : ""
                            },
                            gatewayIpAddress: state.gatewayIpAddress ? state.gatewayIpAddress.value : "",
                            nameserverIpAddress: state.nameserverIpAddress ? state.nameserverIpAddress.value : "",
                            complete: isComplete() || false,
                            localStorageKey: "com.ibm.systems.linux.z.networkAddress"
                          }
                        }
                      });
                    } else {
                      patchState({
                        steps: {
                          networkAddress: {
                            invalid: true,
                            complete: true
                          }
                        }
                      });
                    }
                  }}
                />
                <TextInput
                  readOnly
                  id="network-address_ipv4-binary"
                  invalidText="A valid value is required"
                  labelText="IPv4 binary representation"
                  placeholder="11111111.11111111.10000000.00000000"
                  value={state.binary}
                />
              </>
            }
            {state.addressType === "radio-ipv6" &&
              <>
                <TextInput
                  id="network-address_ipv6-input"
                  invalid={state && state.ipv6Address ? !state.ipv6Address.valid : false}
                  invalidText="A valid value is required"
                  labelText={getLabel(
                    "IPv6 address",
                    "Show information",
                    content
                  )}
                  placeholder="2001:0db8:85a3:0:0:8a2e:370:7334"
                  value={state.ipv6Address ? state.ipv6Address.value : ""}
                  onChange={(localAddress) => {
                    const localAddressValue = localAddress && localAddress.target && localAddress.target.value
                      ? localAddress.target.value
                      : "";
                    const localAddressValueIsValid = isIpv6NetworkAddressValid(localAddressValue);
                    updateIpv6Address(localAddressValue, localAddressValueIsValid);

                    if (localAddressValueIsValid) {
                      patchState({
                        steps: {
                          networkAddress: {
                            addressType: state.addressType,
                            ipv4: {
                              cidr: state.ipv4Cidr ? state.ipv4Cidr.value : "",
                              binary: state.binary,
                              netmask: state.netmask ? state.netmask.value : "",
                              address: state.ipv4Address ? state.ipv4Address.value : ""
                            },
                            ipv6: {
                              cidr: state.ipv6Cidr ? state.ipv6Cidr.value : "",
                              address: state.ipv6Address ? state.ipv6Address.value : ""
                            },
                            gatewayIpAddress: state.gatewayIpAddress ? state.gatewayIpAddress.value : "",
                            nameserverIpAddress: state.nameserverIpAddress ? state.nameserverIpAddress.value : "",
                            complete: isComplete() || false,
                            localStorageKey: "com.ibm.systems.linux.z.networkAddress"
                          }
                        }
                      });
                    } else {
                      patchState({
                        steps: {
                          networkAddress: {
                            invalid: true,
                            complete: true
                          }
                        }
                      });
                    }
                  }}
                />
                <TextInput
                  id="network-address_ipv6-prefix"
                  invalid={state && state.ipv6Cidr ? !state.ipv6Cidr.valid : false}
                  invalidText="A valid value is required"
                  labelText={getLabel(
                    "IPv6 prefix",
                    "Show information",
                    content
                  )}
                  placeholder="128"
                  value={state.ipv6Cidr ? state.ipv6Cidr.value : ""}
                  onChange={(localCidr) => {
                    const localCidrValue = localCidr && localCidr.target && localCidr.target.value
                      ? localCidr.target.value
                      : "";
                    const localCidrValueIsValid = isCidr(ADDRESS_TYPE_IPV6, localCidrValue);

                    updateIpv6Cidr(localCidrValue, localCidrValueIsValid);

                    if (localCidrValueIsValid) {
                      patchState({
                        steps: {
                          networkAddress: {
                            addressType: state.addressType,
                            ipv4: {
                              cidr: state.ipv4Cidr ? state.ipv4Cidr.value : "",
                              binary: state.binary,
                              netmask: state.netmask ? state.netmask.value : "",
                              address: state.ipv4Address ? state.ipv4Address.value : ""
                            },
                            ipv6: {
                              cidr: state.ipv6Cidr ? state.ipv6Cidr.value : "",
                              address: state.ipv6Address ? state.ipv6Address.value : ""
                            },
                            gatewayIpAddress: state.gatewayIpAddress ? state.gatewayIpAddress.value : "",
                            nameserverIpAddress: state.nameserverIpAddress ? state.nameserverIpAddress.value : "",
                            complete: isComplete() || false,
                            localStorageKey: "com.ibm.systems.linux.z.networkAddress"
                          }
                        }
                      });
                    } else {
                      patchState({
                        steps: {
                          networkAddress: {
                            invalid: true,
                            complete: true
                          }
                        }
                      });
                    }
                  }}
                />
              </>
            }
          </div>
        </Column>
        <Column sm={2} md={3} lg={5}>
          <div className="network-address_column-right">
            <TextInput
              id="network-address_gateway-input"
              invalid={state && state.gatewayIpAddress ? !state.gatewayIpAddress.valid : false}
              invalidText="A valid value is required"
              labelText={getLabel(
                "Gateway IP address",
                "Show information",
                content
              )}
              placeholder={state.addressType === ADDRESS_TYPE_IPV4 ? PLACEHOLDER_GATEWAY_ADDRESS_IPV4 : PLACEHOLDER_GATEWAY_ADDRESS_IPV6}
              value={state.gatewayIpAddress ? state.gatewayIpAddress.value : ""}
              onChange={(localGatewayIpAddress) => {
                const localGatewayIpAddressValue = localGatewayIpAddress && localGatewayIpAddress.target && localGatewayIpAddress.target.value
                  ? localGatewayIpAddress.target.value
                  : "";
                const localGatewayIpAddressValueIsValid = state.addressType === ADDRESS_TYPE_IPV4
                  ? isIpv4NetworkAddressValid(localGatewayIpAddressValue)
                  : isIpv6NetworkAddressValid(localGatewayIpAddressValue);
                updateGatewayAddress(localGatewayIpAddressValue, localGatewayIpAddressValueIsValid);

                if (localGatewayIpAddressValueIsValid) {
                  patchState({
                    steps: {
                      networkAddress: {
                        addressType: state.addressType,
                        ipv4: {
                          cidr: state.ipv4Cidr ? state.ipv4Cidr.value : "",
                          binary: state.binary,
                          netmask: state.netmask ? state.netmask.value : "",
                          address: state.ipv4Address ? state.ipv4Address.value : ""
                        },
                        ipv6: {
                          cidr: state.ipv6Cidr ? state.ipv6Cidr.value : "",
                          address: state.ipv6Address ? state.ipv6Address.value : ""
                        },
                        gatewayIpAddress: state.gatewayIpAddress ? state.gatewayIpAddress.value : "",
                        nameserverIpAddress: state.nameserverIpAddress ? state.nameserverIpAddress.value : "",
                        complete: isComplete() || false,
                        localStorageKey: "com.ibm.systems.linux.z.networkAddress"
                      }
                    }
                  });
                } else {
                  patchState({
                    steps: {
                      networkAddress: {
                        invalid: true,
                        complete: true
                      }
                    }
                  });
                }
              }}
            />
            <TextInput
              id="network-address_nameserver-input"
              invalid={state && state.nameserverIpAddress ? !state.nameserverIpAddress.valid : false}
              invalidText="A valid value is required"
              labelText={getLabel(
                "Nameserver IP address",
                "Show information",
                content
              )}
              placeholder={state.addressType === ADDRESS_TYPE_IPV4 ? PLACEHOLDER_NAMESERVER_ADDRESS_IPV4 : PLACEHOLDER_NAMESERVER_ADDRESS_IPV6}
              value={state.nameserverIpAddress ? state.nameserverIpAddress.value : ""}
              onChange={(localNameserverIpAddress) => {
                const localNameserverIpAddressValue = localNameserverIpAddress && localNameserverIpAddress.target && localNameserverIpAddress.target.value
                  ? localNameserverIpAddress.target.value
                  : "";
                const localNameserverIpAddressValueIsValid = state.addressType === ADDRESS_TYPE_IPV4
                  ? isIpv4NetworkAddressValid(localNameserverIpAddressValue)
                  : isIpv6NetworkAddressValid(localNameserverIpAddressValue);
                updateNameserverAddress(localNameserverIpAddressValue, localNameserverIpAddressValueIsValid);

                if (localNameserverIpAddressValueIsValid) {
                  patchState({
                    steps: {
                      networkAddress: {
                        addressType: state.addressType,
                        ipv4: {
                          cidr: state.ipv4Cidr ? state.ipv4Cidr.value : "",
                          binary: state.binary,
                          netmask: state.netmask ? state.netmask.value : "",
                          address: state.ipv4Address ? state.ipv4Address.value : ""
                        },
                        ipv6: {
                          cidr: state.ipv6Cidr ? state.ipv6Cidr.value : "",
                          address: state.ipv6Address ? state.ipv6Address.value : ""
                        },
                        gatewayIpAddress: state.gatewayIpAddress ? state.gatewayIpAddress.value : "",
                        nameserverIpAddress: state.nameserverIpAddress ? state.nameserverIpAddress.value : "",
                        complete: isComplete() || false,
                        localStorageKey: "com.ibm.systems.linux.z.networkAddress"
                      }
                    }
                  });
                } else {
                  patchState({
                    steps: {
                      networkAddress: {
                        invalid: true,
                        complete: true
                      }
                    }
                  });
                }
              }}
            />
          </div>
        </Column>
      </Grid>
    </Layer>
  );
};

NetworkAddress.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default NetworkAddress;
