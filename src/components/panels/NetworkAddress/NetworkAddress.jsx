/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Layer, RadioButtonGroup, RadioButton, ToggletipLabel, Toggletip, ToggletipButton, ToggletipContent, TextInput, FlexGrid, Row, Column } from "@carbon/react";
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
      },
      hostName: {
        value: "",
        valid: false
      },
      domainSearchPath: {
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

  const updateHostName = (hostName, valid) => {
    setState((prevState) => ({...prevState, hostName: { value: hostName, valid }}));
  }

  const updateDomainSearchPath = (domainSearchPath, valid) => {
    setState((prevState) => ({...prevState, domainSearchPath: { value: domainSearchPath, valid }}));
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

  const domainNameHasValidLabels = (domainName) => {
    let hasValidLabels = false;

    if (
      domainName &&
      typeof domainName === "string" &&
      domainName.length > 0
    ) {
      const labels = domainName.split(".");

      for (let i = 0; i < labels.length; i++) {
        if (labels[i].length <= 63) {
          hasValidLabels = true;
        } else {
          hasValidLabels = false;
          // we don't need to continue if there's one invalid label.
          return;
        }
      }
    }

    return hasValidLabels;
  }

  const isDomainNameValid = (domainName) => {
    // the domain name for hostName and domainSearchPath is optional,
    // if it is a zero length string mark it as a valid value.
    if (typeof domainName === "string" && domainName.length === 0) {
      return true;
    }

    return domainName &&
      typeof domainName === "string" &&
      domainName.length <= 253 &&
      domainNameHasValidLabels(domainName) &&
      /^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i.test(domainName);
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

  const isV4AddressValid = () => {
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

  const isV6AddressValid = () => {
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
      ? isV4AddressValid()
      : isV6AddressValid();
  }

  const isGatewayIpAddressValid = () => {
    const gatewayIpAddressValueIsValid = state.addressType === ADDRESS_TYPE_IPV4
      ? isIpv4NetworkAddressValid(state.gatewayIpAddress.value)
      : isIpv6NetworkAddressValid(state.gatewayIpAddress.value);
    return gatewayIpAddressValueIsValid;
  }

  const isNameserverIpAddressValid = () => {
    const nameserverIpAddressValueIsValid = state.addressType === ADDRESS_TYPE_IPV4
      ? isIpv4NetworkAddressValid(state.nameserverIpAddress.value)
      : isIpv6NetworkAddressValid(state.nameserverIpAddress.value);
    return nameserverIpAddressValueIsValid;
  }

  const isHostNameValid = () => {
    if (state.hostName) {
      return state.hostName.valid;
    }
    // return true since hostName is optional
    return true;
  }

  const isDomainSearchPathValid = () => {
    if (state.domainSearchPath) {
      return state.domainSearchPath.valid;
    }
    // return true since domainSearchPath is optional
    return true;
  }

  const isValid = () => {
    return isIpAddressValid() &&
      isGatewayIpAddressValid() &&
      isNameserverIpAddressValid() &&
      isHostNameValid() &&
      isDomainSearchPathValid();
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

  const isIpv4AddressComplete = () => {
    return typeof state.ipv4Address === "object" &&
      typeof state.ipv4Address.value === "string" &&
      state.ipv4Address.value.length > 0;
  }

  const isIpv4CidrComplete = () => {
    return typeof state.ipv4Cidr === "object" &&
      (
        typeof state.ipv4Cidr.value === "number" ||
        typeof state.ipv4Cidr.value === "string"
      ) &&
      state.ipv4Cidr.value > 0;
  }

  const isIpv4NetmaskComplete = () => {
    return typeof state.netmask === "object" &&
      typeof state.netmask.value === "string" &&
      state.netmask.value.length > 0;
  }

  const isIpv4DataComplete = () => {
    return state.addressType === ADDRESS_TYPE_IPV4 &&
      isIpv4AddressComplete() &&
      isIpv4CidrComplete() &&
      isIpv4NetmaskComplete();
  }

  const isIpv6AddressComplete = () => {
    return typeof state.ipv6Address === "object" &&
      typeof state.ipv6Address.value === "string" &&
      state.ipv6Address.value.length > 0;
  }

  const isIpv6CidrComplete = () => {
    return typeof state.ipv6Cidr === "object" &&
      (
        typeof state.ipv6Cidr.value === "number" ||
        typeof state.ipv6Cidr.value === "string"
      ) &&
      state.ipv6Cidr.value > 0;
  }

  const isIpv6DataComplete = () => {
    return state.addressType === ADDRESS_TYPE_IPV6 &&
      isIpv6AddressComplete() &&
      isIpv6CidrComplete();
  }

  const isIpDataComplete = () => {
    return isIpv4DataComplete() || isIpv6DataComplete();
  }

  const isGatewayIpAddressComplete = () => {
    return typeof state.gatewayIpAddress === "object" &&
      typeof state.gatewayIpAddress.value === "string" &&
      state.gatewayIpAddress.value.length > 0;
  }

  const isNameserverIpAddressComplete = () => {
    return typeof state.nameserverIpAddress === "object" &&
      typeof state.nameserverIpAddress.value === "string" &&
      state.nameserverIpAddress.value.length > 0;
  }

  const isHostNameComplete = () => {
    if (state.hostName) {
      return typeof state.hostName === "object" &&
        typeof state.hostName.value === "string"
    }
    // return true since hostName is optional
    return true;
  }

  const isDomainSearchPathComplete = () => {
    if (state.domainSearchPath) {
      return typeof state.domainSearchPath === "object" &&
        typeof state.domainSearchPath.value === "string"
    }
    // return true since domainSearchPath is optional
    return true;
  }

  const isComplete = () => {
    return isIpDataComplete() &&
      isGatewayIpAddressComplete() &&
      isNameserverIpAddressComplete() &&
      isHostNameComplete() &&
      isDomainSearchPathComplete();
  }

  const isCompleteAndValid = (callback) => {
    let localIsComplete = false;
    let localIsValid = false;
  
    if (
      isComplete()
    ) {
      localIsComplete = true;
      localIsValid = isValid();
    }

    if (localIsComplete && localIsValid) {
      return callback(null, {
        isComplete: localIsComplete,
        isValid: localIsValid
      });
    }

    return callback(new Error('Form data is incomplete or invalid'), {
      isComplete: localIsComplete,
      isValid: localIsValid
    });
  }

  useEffect(() => () => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));

    isCompleteAndValid((error, isCompleteAndValid) => {
      if (!error) {
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
              hostName: state.hostName ? state.hostName.value : "",
              domainSearchPath: state.domainSearchPath ? state.domainSearchPath.value : "",
              complete: true,
              invalid: false,
              localStorageKey
            }
          }
        });
      } else if (isCompleteAndValid.isComplete) {
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
              hostName: state.hostName ? state.hostName.value : "",
              domainSearchPath: state.domainSearchPath ? state.domainSearchPath.value : "",
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
              localStorageKey
            }
          }
        });
      } else {
        patchState({
          steps: {
            networkAddress: {
              addressType: state.addressType,
              ipv4: {
                cidr: state?.ipv4Cidr?.value ?? "",
                binary: state?.binary ?? "",
                netmask: state?.netmask?.value ?? "",
                address: state?.ipv4Address?.value ?? ""
              },
              ipv6: {
                cidr: state?.ipv6Cidr?.value ?? "",
                address: state?.ipv6Address?.value ?? ""
              },
              gatewayIpAddress: state?.gatewayIpAddress?.value ?? "",
              nameserverIpAddress: state?.nameserverIpAddress?.value ?? "",
              hostName: state?.hostName?.value ?? "",
              domainSearchPath: state?.domainSearchPath?.value ?? "",
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
              localStorageKey
            }
          }
        });
      }
    });
  }, [state]);

  const getIpv4Markup = () => {
    return (
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
          defaultValue={state.ipv4Address ? state.ipv4Address.value : ""}
          value={state.ipv4Address ? state.ipv4Address.value : ""}
          onChange={(localAddress) => {
            const localAddressValue = localAddress && localAddress.target && localAddress.target.value
              ? localAddress.target.value
              : "";
            // while editing we don't update the validity but set it to true
            // cause we don't want to have the form validation logic kick in.
            updateIpv4Address(localAddressValue, true);
          }}
          onBlur={(localAddress) => {
            const localAddressValue = localAddress && localAddress.target && localAddress.target.value
              ? localAddress.target.value
              : "";
            const localAddressValueIsValid = isIpv4NetworkAddressValid(localAddressValue);
            updateIpv4Address(localAddressValue, localAddressValueIsValid);
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
          defaultValue={state.ipv4Cidr ? state.ipv4Cidr.value : ""}
          value={state.ipv4Cidr ? state.ipv4Cidr.value : ""}
          onChange={(localCidr) => {
            const localCidrValue = localCidr && localCidr.target && localCidr.target.value
              ? localCidr.target.value
              : "";
            // while editing we don't update the validity but set it to true
            // cause we don't want to have the form validation logic kick in.
            updateIpv4Cidr(localCidrValue, true);
          }}
          onBlur={(localCidr) => {
            const localCidrValue = localCidr && localCidr.target && localCidr.target.value
              ? localCidr.target.value
              : "";
            const parsed = cidrToNetmask(localCidrValue);
            const localCidrValueIsValid = isCidr(ADDRESS_TYPE_IPV4, localCidrValue);

            updateIpv4Cidr(localCidrValue, localCidrValueIsValid);

            if (localCidrValueIsValid && parsed) {
              updateNetmask(parsed, true);
              updateBinary(netmaskToBinary(parsed));
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
          defaultValue={state.netmask ? state.netmask.value : ""}
          value={state.netmask ? state.netmask.value : ""}
          onChange={(localNetmask) => {
            const localNetmaskValue = localNetmask && localNetmask.target && localNetmask.target.value
              ? localNetmask.target.value
              : "";
            // while editing we don't update the validity but set it to true
            // cause we don't want to have the form validation logic kick in.
            updateNetmask(localNetmaskValue, true);
          }}
          onBlur={(localNetmask) => {
            const localNetmaskValue = localNetmask && localNetmask.target && localNetmask.target.value
              ? localNetmask.target.value
              : "";
            const parsed = netmaskToCidr(localNetmaskValue);
            const localNetmaskValueIsValid = isIpv4NetworkAddressValid(localNetmaskValue);

            updateNetmask(localNetmaskValue, localNetmaskValueIsValid);

            if (localNetmaskValueIsValid && parsed) {
              updateIpv4Cidr(parsed, true);
              updateBinary(netmaskToBinary(localNetmaskValue));
            }
          }}
        />
        <TextInput
          readOnly
          id="network-address_ipv4-binary"
          invalidText="A valid value is required"
          labelText="IPv4 binary representation (computed)"
          placeholder="11111111.11111111.10000000.00000000"
          value={state.binary}
        />
      </>
    );
  }

  const getIpv6Markup = () => {
    return (
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
          defaultValue={state.ipv6Address ? state.ipv6Address.value : ""}
          value={state.ipv6Address ? state.ipv6Address.value : ""}
          onChange={(localAddress) => {
            const localAddressValue = localAddress && localAddress.target && localAddress.target.value
              ? localAddress.target.value
              : "";
            // while editing we don't update the validity but set it to true
            // cause we don't want to have the form validation logic kick in.
            updateIpv6Address(localAddressValue, true);
          }}
          onBlur={(localAddress) => {
            const localAddressValue = localAddress && localAddress.target && localAddress.target.value
              ? localAddress.target.value
              : "";
            const localAddressValueIsValid = isIpv6NetworkAddressValid(localAddressValue);
            updateIpv6Address(localAddressValue, localAddressValueIsValid);
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
          defaultValue={state.ipv6Cidr ? state.ipv6Cidr.value : ""}
          value={state.ipv6Cidr ? state.ipv6Cidr.value : ""}
          onChange={(localCidr) => {
            const localCidrValue = localCidr && localCidr.target && localCidr.target.value
              ? localCidr.target.value
              : "";
            // while editing we don't update the validity but set it to true
            // cause we don't want to have the form validation logic kick in.
            updateIpv6Cidr(localCidrValue, true);
          }}
          onBlur={(localCidr) => {
            const localCidrValue = localCidr && localCidr.target && localCidr.target.value
              ? localCidr.target.value
              : "";
            const localCidrValueIsValid = isCidr(ADDRESS_TYPE_IPV6, localCidrValue);

            updateIpv6Cidr(localCidrValue, localCidrValueIsValid);
          }}
        />
      </>
    );
  }

  const gridContentsMarkupRowOne = (
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
  );

  const gridContentsMarkupRowTwoColumnOne = (
    <div className="network-address_column-left">
      {state.addressType && state.addressType === ADDRESS_TYPE_IPV4 && getIpv4Markup()}
      {state.addressType && state.addressType === "radio-ipv6" && getIpv6Markup()}
    </div>
  );

  const gridContentsMarkupRowTwoColumnTwo = (
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
        defaultValue={state.gatewayIpAddress ? state.gatewayIpAddress.value : ""}
        value={state.gatewayIpAddress ? state.gatewayIpAddress.value : ""}
        onChange={(localGatewayIpAddress) => {
          const localGatewayIpAddressValue = localGatewayIpAddress && localGatewayIpAddress.target && localGatewayIpAddress.target.value
            ? localGatewayIpAddress.target.value
            : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateGatewayAddress(localGatewayIpAddressValue, true);
        }}
        onBlur={(localGatewayIpAddress) => {
          const localGatewayIpAddressValue = localGatewayIpAddress && localGatewayIpAddress.target && localGatewayIpAddress.target.value
            ? localGatewayIpAddress.target.value
            : "";
          const localGatewayIpAddressValueIsValid = state.addressType === ADDRESS_TYPE_IPV4
            ? isIpv4NetworkAddressValid(localGatewayIpAddressValue)
            : isIpv6NetworkAddressValid(localGatewayIpAddressValue);
          updateGatewayAddress(localGatewayIpAddressValue, localGatewayIpAddressValueIsValid);
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
        defaultValue={state.nameserverIpAddress ? state.nameserverIpAddress.value : ""}
        value={state.nameserverIpAddress ? state.nameserverIpAddress.value : ""}
        onChange={(localNameserverIpAddress) => {
          const localNameserverIpAddressValue = localNameserverIpAddress && localNameserverIpAddress.target && localNameserverIpAddress.target.value
            ? localNameserverIpAddress.target.value
            : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateNameserverAddress(localNameserverIpAddressValue, true);
        }}
        onBlur={(localNameserverIpAddress) => {
          const localNameserverIpAddressValue = localNameserverIpAddress && localNameserverIpAddress.target && localNameserverIpAddress.target.value
            ? localNameserverIpAddress.target.value
            : "";
          const localNameserverIpAddressValueIsValid = state.addressType === ADDRESS_TYPE_IPV4
            ? isIpv4NetworkAddressValid(localNameserverIpAddressValue)
            : isIpv6NetworkAddressValid(localNameserverIpAddressValue);
          updateNameserverAddress(localNameserverIpAddressValue, localNameserverIpAddressValueIsValid);
        }}
      />
      <TextInput
        id="network-address_hostname-input"
        invalid={state && state.hostName ? !state.hostName.valid : false}
        invalidText="A valid value is required"
        labelText={getLabel(
          "Host name (optional)",
          "Show information",
          content
        )}
        placeholder="ex: linux.domain.com"
        defaultValue={state.hostName ? state.hostName.value : ""}
        value={state.hostName ? state.hostName.value : ""}
        onChange={(localHostName) => {
          const localHostNameValue = localHostName && localHostName.target && localHostName.target.value
            ? localHostName.target.value
            : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateHostName(localHostNameValue, true);
        }}
        onBlur={(localHostName) => {
          const localHostNameValue = localHostName && localHostName.target && localHostName.target.value
            ? localHostName.target.value
            : "";
          const localHostNameValueIsValid = isDomainNameValid(localHostNameValue);
          updateHostName(localHostNameValue, localHostNameValueIsValid);
        }}
      />
      <TextInput
        id="network-address_domain-search-path-input"
        invalid={state && state.domainSearchPath ? !state.domainSearchPath.valid : false}
        invalidText="A valid value is required"
        labelText={getLabel(
          "Domain search (optional)",
          "Show information",
          content
        )}
        placeholder="ex: domain.com"
        defaultValue={state.domainSearchPath ? state.domainSearchPath.value : ""}
        value={state.domainSearchPath ? state.domainSearchPath.value : ""}
        onChange={(localDomainSearchPath) => {
          const localDomainSearchPathValue = localDomainSearchPath && localDomainSearchPath.target && localDomainSearchPath.target.value
            ? localDomainSearchPath.target.value
            : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateDomainSearchPath(localDomainSearchPathValue, true);
        }}
        onBlur={(localDomainSearchPath) => {
          const localDomainSearchPathValue = localDomainSearchPath && localDomainSearchPath.target && localDomainSearchPath.target.value
            ? localDomainSearchPath.target.value
            : "";
          const localDomainSearchPathValueIsValid = isDomainNameValid(localDomainSearchPathValue);
          updateDomainSearchPath(localDomainSearchPathValue, localDomainSearchPathValueIsValid);
        }}
      />
    </div>
  );

  return (
    <Layer>
      <FlexGrid className="network-address__grid">
        <Row>
          <Column>
            {gridContentsMarkupRowOne}
          </Column>
        </Row>
        <Row>
          <Column>
            {gridContentsMarkupRowTwoColumnOne}
          </Column>
          <Column>
            {gridContentsMarkupRowTwoColumnTwo}
          </Column>
        </Row>
      </FlexGrid>
    </Layer>
  );
};

NetworkAddress.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default NetworkAddress;
