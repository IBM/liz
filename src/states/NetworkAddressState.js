/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
  ADDRESS_TYPE_IPV4,
  STATE_ORIGIN_DEFAULT,
  DEFAULT_COMPUTED_NUMBER_OBJECT,
  DEFAULT_COMPUTED_STRING_OBJECT,
  DEFAULT_NUMBER_OBJECT,
  DEFAULT_STRING_OBJECT,
} from "../util/constants";

const createInitialState = () => {
  const initialState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS),
  );
  const defaultState = {
    ipv4: {
      netmask: DEFAULT_COMPUTED_STRING_OBJECT,
      ipv4Cidr: DEFAULT_COMPUTED_NUMBER_OBJECT,
      binary: "",
      ipv4Address: DEFAULT_STRING_OBJECT,
      gatewayIpAddress: DEFAULT_STRING_OBJECT,
      nameserverIpAddress: DEFAULT_STRING_OBJECT,
      hostName: DEFAULT_STRING_OBJECT,
    },
    ipv6: {
      ipv6Cidr: DEFAULT_NUMBER_OBJECT,
      ipv6Address: DEFAULT_STRING_OBJECT,
      gatewayIpAddress: DEFAULT_STRING_OBJECT,
      nameserverIpAddress: DEFAULT_STRING_OBJECT,
      hostName: DEFAULT_STRING_OBJECT,
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
