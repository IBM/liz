/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  ACTION_UPDATE_NETWORK_DEVICE_TYPE,
  ACTION_UPDATE_NETWORK_DEVICE_USE_VLAN,
  ACTION_UPDATE_NETWORK_DEVICE_READ_CHANNEL_ID,
  ACTION_UPDATE_NETWORK_DEVICE_WRITE_CHANNEL_ID,
  ACTION_UPDATE_NETWORK_DEVICE_DATA_CHANNEL_ID,
  ACTION_UPDATE_NETWORK_DEVICE_LAYER,
  ACTION_UPDATE_NETWORK_DEVICE_USE_MULTIPORT,
  ACTION_UPDATE_NETWORK_DEVICE_PORT_NO,
  ACTION_UPDATE_NETWORK_DEVICE_PCI_FUNCTION_ID,
  ACTION_UPDATE_NETWORK_DEVICE_USER_IDENTIFIER,
  ACTION_UPDATE_NETWORK_DEVICE_VLAN_ID,
  ACTION_RESET_TO_INITIAL_STATE,
} from "../util/constants";

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_RESET_TO_INITIAL_STATE:
      return action.nextInitialState;
    case ACTION_UPDATE_NETWORK_DEVICE_TYPE:
      return {
        ...state,
        selectedDeviceType: action.nextSelectedDeviceType,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_USE_VLAN:
      return {
        ...state,
        useVlan: action.nextUseVlan,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_READ_CHANNEL_ID:
      return {
        ...state,
        readChannelId: action.nextReadChannelId,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_WRITE_CHANNEL_ID:
      return {
        ...state,
        writeChannelId: action.nextWriteChannelId,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_DATA_CHANNEL_ID:
      return {
        ...state,
        dataChannelId: action.nextDataChannelId,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_LAYER:
      return {
        ...state,
        layer: action.nextLayer,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_USE_MULTIPORT:
      return {
        ...state,
        useMultiPort: action.nextUseMultiPort,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_PORT_NO:
      return {
        ...state,
        portNo: action.nextPortNo,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_PCI_FUNCTION_ID:
      return {
        ...state,
        pciFunctionId: action.nextPciFunctionId,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_USER_IDENTIFIER:
      return {
        ...state,
        userIdentifier: action.nextUserIdentifier,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_VLAN_ID:
      return {
        ...state,
        vlanId: action.nextVlanId,
      };
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
