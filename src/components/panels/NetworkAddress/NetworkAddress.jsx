import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { RadioButtonGroup, RadioButton, TextInput, Grid, Column } from "@carbon/react";
import "./_network-address.scss";

const NetworkAddress = (patchState, localStorageKey) => {
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      netmask: "",
      cidr: "",
      binary: "",
      addressType: ""
    };

    if (initialState) {
      return initialState
    }
    return defaultState;
  }
  const [state, setState] = useState(getInitialState);

  const updateNetmask = (netmask) => {
    setState(Object.assign(state, { netmask }));
  }

  const updateCidr = (cidr) => {
    setState(Object.assign(state, { cidr }));
  }

  const updateBinary = (binary) => {
    setState(Object.assign(state, { binary }));
  }

  const updateAddressType = (addressType) => {
    setState(Object.assign(state, { addressType }));
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
    const mask = [];
    let i;
    let n;

    if (cidr) {
      for(i=0; i<4; i++) {
        n = Math.min(cidr, 8);
        mask.push(256 - Math.pow(2, 8-n));
        cidr -= n;
      }
    }
    return mask.join('.');
  }

  const netmaskToBinary = (netmask) => {
    let binary;

    if (netmask) {
      const parts = netmask.split(".");

      const newParts = [];
      parts.forEach(part => {
        const dec2bin = parseInt(part).toString(2);
        newParts.push(dec2bin);
      })
      
      binary = newParts.join(".");
    }
    return binary;
  }

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state))
  }, [localStorageKey, state]);

  return (
    <Grid className="" fullWidth>
      <Column sm={2} md={3} lg={5}>
        <div className="network-address_column-left">
          <RadioButtonGroup
            legendText="Internet protocol version"
            name="network-address_ip-version-group"
            defaultSelected="radio-ipv4"
            onChange={(selected) => {
              updateAddressType(selected);
            }}>
            <RadioButton
              labelText="IPv4"
              value="radio-ipv4"
              id="network-address_ipv4-radio"
            />
            <RadioButton
              labelText="IPv6"
              value="radio-ipv6"
              id="network-address_ipv6-radio"
            />
          </RadioButtonGroup>
          {state.addressType === "radio-ipv4" &&
            <>
              <TextInput
                id="network-address_ipv4-input"
                invalidText="A valid value is required"
                labelText="IPv4 address"
                placeholder="192.168.178.22"
              />
              <TextInput
                id="network-address_ipv4-prefix"
                invalidText="A valid value is required"
                labelText="IPv4 prefix"
                placeholder="32"
                value={state.cidr}
                onChange={(localCidr) => {
                  const localCidrValue = localCidr && localCidr.target && localCidr.target.value
                    ? localCidr.target.value
                    : "";
                  const parsed = cidrToNetmask(localCidrValue);

                  if (parsed) {
                    updateCidr(localCidrValue);
                    updateNetmask(parsed);
                    updateBinary(netmaskToBinary(parsed));
                  }
                }}
              />
              <TextInput
                id="network-address_ipv4-netmask"
                invalidText="A valid value is required"
                labelText="IPv4 netmask"
                placeholder="255.255.128.0"
                value={state.netmask}
                onChange={(localNetmask) => {
                  const localNetmaskValue = localNetmask && localNetmask.target && localNetmask.target.value
                    ? localNetmask.target.value
                    : "";
                  const parsed = netmaskToCidr(localNetmaskValue);

                  if (parsed) {
                    updateNetmask(localNetmaskValue);
                    updateCidr(parsed);
                    updateBinary(netmaskToBinary(localNetmaskValue));
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
                invalidText="A valid value is required"
                labelText="IPv6 address"
                placeholder="2001:0db8:85a3:0:0:8a2e:370:7334"
              />
              <TextInput
                id="network-address_ipv6-prefix"
                invalidText="A valid value is required"
                labelText="IPv6 prefix"
                placeholder="128"
              />
            </>
          }
        </div>
      </Column>
      <Column sm={2} md={3} lg={5}>
        <div className="network-address_column-right">
          <TextInput
            id="network-address_gateway-input"
            invalidText="A valid value is required"
            labelText="Gateway IP address"
            placeholder="192.168.178.1"
          />
          <TextInput
            id="network-address_nameserver-input"
            invalidText="A valid value is required"
            labelText="Nameserver IP address"
            placeholder="192.168.178.2"
          />
        </div>
      </Column>
    </Grid>
  );
};

NetworkAddress.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default NetworkAddress;
