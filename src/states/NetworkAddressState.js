/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
  ADDRESS_TYPE_IPV4,
  STATE_ORIGIN_DEFAULT,
} from "../util/constants";

const createInitialState = () => {
  const initialState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS),
  );
  const defaultState = {
    ipv4: {
      netmask: {
        value: "",
        valid: true,
        computed: false,
      },
      ipv4Cidr: {
        value: "",
        valid: true,
        computed: false,
      },
      binary: "",
      ipv4Address: {
        value: "",
        valid: true,
      },
      gatewayIpAddress: {
        value: "",
        valid: true,
      },
      nameserverIpAddress: {
        value: "",
        valid: true,
      },
      hostName: {
        value: "",
        valid: true,
      },
    },
    ipv6: {
      ipv6Cidr: {
        value: "",
        valid: true,
      },
      ipv6Address: {
        value: "",
        valid: true,
      },
      gatewayIpAddress: {
        value: "",
        valid: true,
      },
      nameserverIpAddress: {
        value: "",
        valid: true,
      },
      hostName: {
        value: "",
        valid: true,
      },
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
