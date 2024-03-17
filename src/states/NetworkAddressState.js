/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
  ADDRESS_TYPE_IPV4,
  STATE_ORIGIN_DEFAULT,
  DEFAULT_STRING_OBJECT,
} from "../util/constants";

const createInitialState = () => {
  const initialState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS),
  );
  const defaultState = {
    ipv4: {
      netmask: {
        value: "255.255.255.0",
        valid: true,
        computed: false,
      },
      ipv4Cidr: {
        value: 24,
        valid: true,
        computed: false,
      },
      binary: "11111111.11111111.11111111.00000000",
      ipv4Address: DEFAULT_STRING_OBJECT,
      gatewayIpAddress: DEFAULT_STRING_OBJECT,
      nameserverIpAddress: DEFAULT_STRING_OBJECT,
      hostName: DEFAULT_STRING_OBJECT,
      domainSearchPath: DEFAULT_STRING_OBJECT,
    },
    ipv6: {
      ipv6Cidr: {
        value: 32,
        valid: true,
      },
      ipv6Address: DEFAULT_STRING_OBJECT,
      gatewayIpAddress: DEFAULT_STRING_OBJECT,
      nameserverIpAddress: DEFAULT_STRING_OBJECT,
      hostName: DEFAULT_STRING_OBJECT,
      domainSearchPath: DEFAULT_STRING_OBJECT,
    },
    addressType: ADDRESS_TYPE_IPV4,
    origin: STATE_ORIGIN_DEFAULT,
  };

  if (initialState) {
    return initialState;
  }

  return defaultState;
};

export { createInitialState };
