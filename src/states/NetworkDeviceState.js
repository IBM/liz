/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  DEVICE_TYPE_LIST,
  LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
  STATE_ORIGIN_DEFAULT,
} from "../util/constants";

const createInitialState = () => {
  const initialState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE),
  );
  const defaultState = {
    selectedDeviceType: DEVICE_TYPE_LIST[0],
    readChannelId: {
      value: "",
      computed: "",
      valid: true,
    },
    writeChannelId: {
      value: "",
      computed: "",
      valid: true,
    },
    dataChannelId: {
      value: "",
      computed: "",
      valid: true,
    },
    layer: true,
    portNo: false,
    pciFunctionId: {
      value: "",
      valid: true,
    },
    userIdentifier: {
      value: "",
      valid: true,
    },
    vlanId: {
      value: 1,
      valid: true,
    },
    useVlan: false,
    origin: STATE_ORIGIN_DEFAULT,
  };

  if (initialState) {
    return initialState;
  }

  return defaultState;
};

export { createInitialState };
