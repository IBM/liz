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
        selectedDeviceType: action.nextSelectedDeviceType,
        readChannelId: state.readChannelId,
        writeChannelId: state.writeChannelId,
        dataChannelId: state.dataChannelId,
        layer: state.layer,
        portNo: state.portNo,
        pciFunctionId: state.pciFunctionId,
        userIdentifier: state.userIdentifier,
        vlanId: state.vlanId,
        useVlan: state.useVlan,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_USE_VLAN:
      return {
        selectedDeviceType: state.selectedDeviceType,
        readChannelId: state.readChannelId,
        writeChannelId: state.writeChannelId,
        dataChannelId: state.dataChannelId,
        layer: state.layer,
        portNo: state.portNo,
        pciFunctionId: state.pciFunctionId,
        userIdentifier: state.userIdentifier,
        vlanId: state.vlanId,
        useVlan: action.nextUseVlan,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_READ_CHANNEL_ID:
      return {
        selectedDeviceType: state.selectedDeviceType,
        readChannelId: action.nextReadChannelId,
        writeChannelId: state.writeChannelId,
        dataChannelId: state.dataChannelId,
        layer: state.layer,
        portNo: state.portNo,
        pciFunctionId: state.pciFunctionId,
        userIdentifier: state.userIdentifier,
        vlanId: state.vlanId,
        useVlan: state.useVlan,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_WRITE_CHANNEL_ID:
      return {
        selectedDeviceType: state.selectedDeviceType,
        readChannelId: state.readChannelId,
        writeChannelId: action.nextWriteChannelId,
        dataChannelId: state.dataChannelId,
        layer: state.layer,
        portNo: state.portNo,
        pciFunctionId: state.pciFunctionId,
        userIdentifier: state.userIdentifier,
        vlanId: state.vlanId,
        useVlan: state.useVlan,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_DATA_CHANNEL_ID:
      return {
        selectedDeviceType: state.selectedDeviceType,
        readChannelId: state.readChannelId,
        writeChannelId: state.writeChannelId,
        dataChannelId: action.nextDataChannelId,
        layer: state.layer,
        portNo: state.portNo,
        pciFunctionId: state.pciFunctionId,
        userIdentifier: state.userIdentifier,
        vlanId: state.vlanId,
        useVlan: state.useVlan,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_LAYER:
      return {
        selectedDeviceType: state.selectedDeviceType,
        readChannelId: state.readChannelId,
        writeChannelId: state.writeChannelId,
        dataChannelId: state.dataChannelId,
        layer: action.nextLayer,
        portNo: state.portNo,
        pciFunctionId: state.pciFunctionId,
        userIdentifier: state.userIdentifier,
        vlanId: state.vlanId,
        useVlan: state.useVlan,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_PORT_NO:
      return {
        selectedDeviceType: state.selectedDeviceType,
        readChannelId: state.readChannelId,
        writeChannelId: state.writeChannelId,
        dataChannelId: state.dataChannelId,
        layer: state.layer,
        portNo: action.nextPortNo,
        pciFunctionId: state.pciFunctionId,
        userIdentifier: state.userIdentifier,
        vlanId: state.vlanId,
        useVlan: state.useVlan,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_PCI_FUNCTION_ID:
      return {
        selectedDeviceType: state.selectedDeviceType,
        readChannelId: state.readChannelId,
        writeChannelId: state.writeChannelId,
        dataChannelId: state.dataChannelId,
        layer: state.layer,
        portNo: state.portNo,
        pciFunctionId: action.nextPciFunctionId,
        userIdentifier: state.userIdentifier,
        vlanId: state.vlanId,
        useVlan: state.useVlan,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_USER_IDENTIFIER:
      return {
        selectedDeviceType: state.selectedDeviceType,
        readChannelId: state.readChannelId,
        writeChannelId: state.writeChannelId,
        dataChannelId: state.dataChannelId,
        layer: state.layer,
        portNo: state.portNo,
        pciFunctionId: state.pciFunctionId,
        userIdentifier: action.nextUserIdentifier,
        vlanId: state.vlanId,
        useVlan: state.useVlan,
      };
    case ACTION_UPDATE_NETWORK_DEVICE_VLAN_ID:
      return {
        selectedDeviceType: state.selectedDeviceType,
        readChannelId: state.readChannelId,
        writeChannelId: state.writeChannelId,
        dataChannelId: state.dataChannelId,
        layer: state.layer,
        portNo: state.portNo,
        pciFunctionId: state.pciFunctionId,
        userIdentifier: state.userIdentifier,
        vlanId: action.nextVlanId,
        useVlan: state.useVlan,
      };
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
