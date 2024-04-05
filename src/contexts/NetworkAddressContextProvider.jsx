/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import networkAddressReducer from "../reducers/NetworkAddressReducer";
import { createInitialState as createInitialNetworkAddressState } from "../states/NetworkAddressState";
import {
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_NETWORK_ADDRESS_NETMASK,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_CIDR,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_CIDR,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_BINARY,
  ACTION_UPDATE_NETWORK_ADDRESS_TYPE,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_ADDRESS,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_ADDRESS,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_GW_ADDRESS,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_GW_ADDRESS,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_NS_ADDRESS,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_NS_ADDRESS,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_HOSTNAME,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_HOSTNAME,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_DOMAIN_SEARCH_PATH,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_DOMAIN_SEARCH_PATH,
} from "../util/reducer-action-constants";
import { ADDRESS_TYPE_IPV4, ADDRESS_TYPE_IPV6 } from "../util/constants";
import { NetworkAddressContext } from "./index";

const NetworkAddressContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    networkAddressReducer,
    createInitialNetworkAddressState(),
  );

  const ipVersion =
    state.addressType && state.addressType === ADDRESS_TYPE_IPV6
      ? "ipv6"
      : "ipv4";

  const updateResetToInitialState = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_RESET_TO_INITIAL_STATE,
        nextInitialState: createInitialNetworkAddressState(true),
      });
    },
    [state, dispatch],
  );

  const updateNetmask = useCallback(
    (updates) => {
      const { value, valid, computed } = updates;
      dispatch({
        type: ACTION_UPDATE_NETWORK_ADDRESS_NETMASK,
        nextNetmask: {
          value,
          valid,
          computed,
        },
      });
    },
    [state, dispatch],
  );

  const updateIpv4Cidr = useCallback(
    (updates) => {
      const { value, valid, computed } = updates;
      dispatch({
        type: ACTION_UPDATE_NETWORK_ADDRESS_IPV4_CIDR,
        nextIpv4Cidr: {
          value,
          valid,
          computed,
        },
      });
    },
    [state, dispatch],
  );

  const updateIpv6Cidr = useCallback(
    (updates) => {
      const { value, valid } = updates;
      dispatch({
        type: ACTION_UPDATE_NETWORK_ADDRESS_IPV6_CIDR,
        nextIpv6Cidr: {
          value,
          valid,
        },
      });
    },
    [state, dispatch],
  );

  const updateBinary = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_NETWORK_ADDRESS_IPV4_BINARY,
        nextBinary: updates,
      });
    },
    [state, dispatch],
  );

  const updateAddressType = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_NETWORK_ADDRESS_TYPE,
        nextAddressType: updates,
      });
    },
    [state, dispatch],
  );

  const updateIpv4Address = useCallback(
    (updates) => {
      const { value, valid } = updates;
      dispatch({
        type: ACTION_UPDATE_NETWORK_ADDRESS_IPV4_ADDRESS,
        nextIpv4Address: {
          value,
          valid,
        },
      });
    },
    [state, dispatch],
  );

  const updateIpv6Address = useCallback(
    (updates) => {
      const { value, valid } = updates;
      dispatch({
        type: ACTION_UPDATE_NETWORK_ADDRESS_IPV6_ADDRESS,
        nextIpv6Address: {
          value,
          valid,
        },
      });
    },
    [state, dispatch],
  );

  const updateGatewayAddress = useCallback(
    (updates) => {
      const { value, valid } = updates;
      dispatch({
        type:
          ipVersion === ADDRESS_TYPE_IPV4 ||
          state.addressType === ADDRESS_TYPE_IPV4
            ? ACTION_UPDATE_NETWORK_ADDRESS_IPV4_GW_ADDRESS
            : ACTION_UPDATE_NETWORK_ADDRESS_IPV6_GW_ADDRESS,
        nextGatewayIpAddress: {
          value,
          valid,
        },
      });
    },
    [state, dispatch],
  );

  const updateNameserverAddress = useCallback(
    (updates) => {
      const { value, valid } = updates;
      dispatch({
        type:
          ipVersion === ADDRESS_TYPE_IPV4 ||
          state.addressType === ADDRESS_TYPE_IPV4
            ? ACTION_UPDATE_NETWORK_ADDRESS_IPV4_NS_ADDRESS
            : ACTION_UPDATE_NETWORK_ADDRESS_IPV6_NS_ADDRESS,
        nextNameserverIpAddress: {
          value,
          valid,
        },
      });
    },
    [state, dispatch],
  );

  const updateHostName = useCallback(
    (updates) => {
      const { value, valid } = updates;
      dispatch({
        type:
          ipVersion === ADDRESS_TYPE_IPV4 ||
          state.addressType === ADDRESS_TYPE_IPV4
            ? ACTION_UPDATE_NETWORK_ADDRESS_IPV4_HOSTNAME
            : ACTION_UPDATE_NETWORK_ADDRESS_IPV6_HOSTNAME,
        nextHostName: {
          value,
          valid,
        },
      });
    },
    [state, dispatch],
  );

  const updateDomainSearchPath = useCallback(
    (updates) => {
      const { value, valid } = updates;
      dispatch({
        type:
          ipVersion === ADDRESS_TYPE_IPV4 ||
          state.addressType === ADDRESS_TYPE_IPV4
            ? ACTION_UPDATE_NETWORK_ADDRESS_IPV4_DOMAIN_SEARCH_PATH
            : ACTION_UPDATE_NETWORK_ADDRESS_IPV6_DOMAIN_SEARCH_PATH,
        nextDomainSearchPath: {
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
      updateNetmask,
      updateIpv4Cidr,
      updateIpv6Cidr,
      updateBinary,
      updateAddressType,
      updateIpv4Address,
      updateIpv6Address,
      updateGatewayAddress,
      updateNameserverAddress,
      updateHostName,
      updateDomainSearchPath,
      resetToInitialState,
    }),
    [
      value,
      state,
      updateNetmask,
      updateIpv4Cidr,
      updateIpv6Cidr,
      updateBinary,
      updateAddressType,
      updateIpv4Address,
      updateIpv6Address,
      updateGatewayAddress,
      updateNameserverAddress,
      updateHostName,
      updateDomainSearchPath,
      resetToInitialState,
    ],
  );

  return (
    <NetworkAddressContext.Provider value={getContextValue()}>
      {children}
    </NetworkAddressContext.Provider>
  );
};

NetworkAddressContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default NetworkAddressContextProvider;
