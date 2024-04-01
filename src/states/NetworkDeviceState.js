/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
  STATE_ORIGIN_DEFAULT,
} from "../util/local-storage-constants";
import {
  DEVICE_TYPE_OSA,
  DEFAULT_COMPUTED_STRING_OBJECT,
  DEFAULT_NUMBER_OBJECT,
  DEFAULT_STRING_OBJECT,
} from "../util/constants";

const createInitialState = () => {
  const initialState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE),
  );
  const defaultState = {
    selectedDeviceType: DEVICE_TYPE_OSA,
    readChannelId: DEFAULT_COMPUTED_STRING_OBJECT,
    writeChannelId: DEFAULT_COMPUTED_STRING_OBJECT,
    dataChannelId: DEFAULT_COMPUTED_STRING_OBJECT,
    layer: true,
    portNo: false,
    useMultiPort: false,
    pciFunctionId: DEFAULT_STRING_OBJECT,
    userIdentifier: DEFAULT_STRING_OBJECT,
    vlanId: DEFAULT_NUMBER_OBJECT,
    useVlan: false,
    origin: STATE_ORIGIN_DEFAULT,
  };

  if (initialState) {
    return initialState;
  }

  return defaultState;
};

export { createInitialState };
