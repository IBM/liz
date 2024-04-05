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

  const updateResetToInitialState = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_RESET_TO_INITIAL_STATE,
        nextInitialState: createInitialNetworkDeviceState(true),
      });
    },
    [state, dispatch],
  );

  const updateSelectedDeviceType = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_NETWORK_DEVICE_TYPE,
        nextSelectedDeviceType: updates,
      });
    },
    [state, dispatch],
  );

  const updateUseVlan = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_NETWORK_DEVICE_USE_VLAN,
        nextUseVlan: updates,
      });
    },
    [state, dispatch],
  );

  const updateReadChannelId = useCallback(
    (updates) => {
      const { value, computed, valid } = updates;
      dispatch({
        type: ACTION_UPDATE_NETWORK_DEVICE_READ_CHANNEL_ID,
        nextReadChannelId: {
          value,
          computed,
          valid,
        },
      });
    },
    [state, dispatch],
  );

  const updateWriteChannelId = useCallback(
    (updates) => {
      const { value, computed, valid } = updates;
      dispatch({
        type: ACTION_UPDATE_NETWORK_DEVICE_WRITE_CHANNEL_ID,
        nextWriteChannelId: {
          value,
          computed,
          valid,
        },
      });
    },
    [state, dispatch],
  );

  const updateDataChannelId = useCallback(
    (updates) => {
      const { value, computed, valid } = updates;
      dispatch({
        type: ACTION_UPDATE_NETWORK_DEVICE_DATA_CHANNEL_ID,
        nextDataChannelId: {
          value,
          computed,
          valid,
        },
      });
    },
    [state, dispatch],
  );

  const updateLayer = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_NETWORK_DEVICE_LAYER,
        nextLayer: updates,
      });
    },
    [state, dispatch],
  );

  const updateUseMultiPort = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_NETWORK_DEVICE_USE_MULTIPORT,
        nextUseMultiPort: updates,
      });
    },
    [state, dispatch],
  );

  const updatePortNo = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_NETWORK_DEVICE_PORT_NO,
        nextPortNo: updates,
      });
    },
    [state, dispatch],
  );

  const updatePciFunctionId = useCallback(
    (updates) => {
      const { value, valid } = updates;
      dispatch({
        type: ACTION_UPDATE_NETWORK_DEVICE_PCI_FUNCTION_ID,
        nextPciFunctionId: {
          value,
          valid,
        },
      });
    },
    [state, dispatch],
  );

  const updateUserIdentifier = useCallback(
    (updates) => {
      const { value, valid } = updates;
      dispatch({
        type: ACTION_UPDATE_NETWORK_DEVICE_USER_IDENTIFIER,
        nextUserIdentifier: {
          value,
          valid,
        },
      });
    },
    [state, dispatch],
  );

  const updateVlanId = useCallback(
    (updates) => {
      const { value, valid } = updates;
      dispatch({
        type: ACTION_UPDATE_NETWORK_DEVICE_VLAN_ID,
        nextVlanId: {
          value,
          valid,
        },
      });
    },
    [state, dispatch],
  );

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
