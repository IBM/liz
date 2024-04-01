/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import networkDeviceReducer from "../reducers/NetworkDeviceReducer";
import { createInitialState as createInitialNetworkDeviceState } from "../states/NetworkDeviceState";
import {
  ACTION_RESET_TO_INITIAL_STATE,
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
} from "../util/reducer-action-constants";
import { NetworkDeviceContext } from "./index";

const NetworkDeviceContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    networkDeviceReducer,
    createInitialNetworkDeviceState(),
  );

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialNetworkDeviceState(true),
    });
  };

  const updateSelectedDeviceType = (selectedDeviceType) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_TYPE,
      nextSelectedDeviceType: selectedDeviceType,
    });
  };

  const updateUseVlan = (flag) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_USE_VLAN,
      nextUseVlan: flag,
    });
  };

  const updateReadChannelId = (readChannelId, computedReadChannelId, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_READ_CHANNEL_ID,
      nextReadChannelId: {
        value: readChannelId,
        computed: computedReadChannelId,
        valid,
      },
    });
  };

  const updateWriteChannelId = (
    writeChannelId,
    computedWriteChannelId,
    valid,
  ) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_WRITE_CHANNEL_ID,
      nextWriteChannelId: {
        value: writeChannelId,
        computed: computedWriteChannelId,
        valid,
      },
    });
  };

  const updateDataChannelId = (dataChannelId, computedDataChannelId, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_DATA_CHANNEL_ID,
      nextDataChannelId: {
        value: dataChannelId,
        computed: computedDataChannelId,
        valid,
      },
    });
  };

  const updateLayer = (layer) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_LAYER,
      nextLayer: layer,
    });
  };

  const updateUseMultiPort = (useMultiPort) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_USE_MULTIPORT,
      nextUseMultiPort: useMultiPort,
    });
  };

  const updatePortNo = (portNo) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_PORT_NO,
      nextPortNo: portNo,
    });
  };

  const updatePciFunctionId = (pciFunctionId, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_PCI_FUNCTION_ID,
      nextPciFunctionId: {
        value: pciFunctionId,
        valid,
      },
    });
  };

  const updateUserIdentifier = (userIdentifier, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_USER_IDENTIFIER,
      nextUserIdentifier: {
        value: userIdentifier,
        valid,
      },
    });
  };

  const updateVlanId = (vlanId, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_DEVICE_VLAN_ID,
      nextVlanId: { value: vlanId, valid },
    });
  };

  const resetToInitialState = useCallback(() => {
    updateResetToInitialState();
  }, [state, updateResetToInitialState]);

  const getContextValue = useCallback(
    () => ({
      ...value,
      state,
      updateSelectedDeviceType,
      updateUseVlan,
      updateReadChannelId,
      updateWriteChannelId,
      updateDataChannelId,
      updateLayer,
      updateUseMultiPort,
      updatePortNo,
      updatePciFunctionId,
      updateUserIdentifier,
      updateVlanId,
      resetToInitialState,
    }),
    [
      value,
      state,
      updateSelectedDeviceType,
      updateUseVlan,
      updateReadChannelId,
      updateWriteChannelId,
      updateDataChannelId,
      updateLayer,
      updateUseMultiPort,
      updatePortNo,
      updatePciFunctionId,
      updateUserIdentifier,
      updateVlanId,
      resetToInitialState,
    ],
  );

  return (
    <NetworkDeviceContext.Provider value={getContextValue()}>
      {children}
    </NetworkDeviceContext.Provider>
  );
};

NetworkDeviceContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default NetworkDeviceContextProvider;
