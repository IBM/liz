/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer } from "react";
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

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialNetworkAddressState(),
    });
  };

  const updateNetmask = (netmask, valid, computed) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_ADDRESS_NETMASK,
      nextNetmask: {
        value: netmask,
        valid,
        computed,
      },
    });
  };

  const updateIpv4Cidr = (ipv4Cidr, valid, computed) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_ADDRESS_IPV4_CIDR,
      nextIpv4Cidr: {
        value: ipv4Cidr,
        valid,
        computed,
      },
    });
  };

  const updateIpv6Cidr = (ipv6Cidr, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_ADDRESS_IPV6_CIDR,
      nextIpv6Cidr: {
        value: ipv6Cidr,
        valid,
      },
    });
  };

  const updateBinary = (binary) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_ADDRESS_IPV4_BINARY,
      nextBinary: binary,
    });
  };

  const updateAddressType = (addressType) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_ADDRESS_TYPE,
      nextAddressType: addressType,
    });
  };

  const updateIpv4Address = (ipv4Address, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_ADDRESS_IPV4_ADDRESS,
      nextIpv4Address: {
        value: ipv4Address,
        valid,
      },
    });
  };

  const updateIpv6Address = (ipv6Address, valid) => {
    dispatch({
      type: ACTION_UPDATE_NETWORK_ADDRESS_IPV6_ADDRESS,
      nextIpv6Address: {
        value: ipv6Address,
        valid,
      },
    });
  };

  const updateGatewayAddress = (gatewayIpAddress, valid) => {
    dispatch({
      type:
        ipVersion === ADDRESS_TYPE_IPV4 ||
        state.addressType === ADDRESS_TYPE_IPV4
          ? ACTION_UPDATE_NETWORK_ADDRESS_IPV4_GW_ADDRESS
          : ACTION_UPDATE_NETWORK_ADDRESS_IPV6_GW_ADDRESS,
      nextGatewayIpAddress: {
        value: gatewayIpAddress,
        valid,
      },
    });
  };

  const updateNameserverAddress = (nameserverIpAddress, valid) => {
    dispatch({
      type:
        ipVersion === ADDRESS_TYPE_IPV4 ||
        state.addressType === ADDRESS_TYPE_IPV4
          ? ACTION_UPDATE_NETWORK_ADDRESS_IPV4_NS_ADDRESS
          : ACTION_UPDATE_NETWORK_ADDRESS_IPV6_NS_ADDRESS,
      nextNameserverIpAddress: {
        value: nameserverIpAddress,
        valid,
      },
    });
  };

  const updateHostName = (hostName, valid) => {
    dispatch({
      type:
        ipVersion === ADDRESS_TYPE_IPV4 ||
        state.addressType === ADDRESS_TYPE_IPV4
          ? ACTION_UPDATE_NETWORK_ADDRESS_IPV4_HOSTNAME
          : ACTION_UPDATE_NETWORK_ADDRESS_IPV6_HOSTNAME,
      nextHostName: {
        value: hostName,
        valid,
      },
    });
  };

  const updateDomainSearchPath = (domainSearchPath, valid) => {
    dispatch({
      type:
        ipVersion === ADDRESS_TYPE_IPV4 ||
        state.addressType === ADDRESS_TYPE_IPV4
          ? ACTION_UPDATE_NETWORK_ADDRESS_IPV4_DOMAIN_SEARCH_PATH
          : ACTION_UPDATE_NETWORK_ADDRESS_IPV6_DOMAIN_SEARCH_PATH,
      nextDomainSearchPath: {
        value: domainSearchPath,
        valid,
      },
    });
  };

  return (
    <NetworkAddressContext.Provider
      value={{
        ...value,
        state,
        updateResetToInitialState,
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
      }}
    >
      {children}
    </NetworkAddressContext.Provider>
  );
};

NetworkAddressContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default NetworkAddressContextProvider;
