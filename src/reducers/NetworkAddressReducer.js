/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  ACTION_UPDATE_NETWORK_ADDRESS_NETMASK,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_HOSTNAME,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_HOSTNAME,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_NS_ADDRESS,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_NS_ADDRESS,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_GW_ADDRESS,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_GW_ADDRESS,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_ADDRESS,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_ADDRESS,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_CIDR,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_CIDR,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_BINARY,
  ACTION_UPDATE_NETWORK_ADDRESS_TYPE,
  ACTION_RESET_TO_INITIAL_STATE,
  ADDRESS_TYPE_IPV4,
} from "../util/constants";

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_RESET_TO_INITIAL_STATE:
      return action.nextInitialState;
    case ACTION_UPDATE_NETWORK_ADDRESS_NETMASK:
      return {
        ipv4: {
          ...state.ipv4,
          netmask: action.nextNetmask,
        },
        ipv6: {
          ...state.ipv6,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV4_HOSTNAME:
      return {
        ipv4: {
          ...state.ipv4,
          hostName: action.nextHostName,
        },
        ipv6: {
          ...state.ipv6,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV6_HOSTNAME:
      return {
        ipv4: {
          ...state.ipv4,
        },
        ipv6: {
          ...state.ipv6,
          hostName: action.nextHostName,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV4_NS_ADDRESS:
      return {
        ipv4: {
          ...state.ipv4,
          nameserverIpAddress: action.nextNameserverIpAddress,
        },
        ipv6: {
          ...state.ipv6,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV6_NS_ADDRESS:
      return {
        ipv4: {
          ...state.ipv4,
        },
        ipv6: {
          ...state.ipv6,
          nameserverIpAddress: action.nextNameserverIpAddress,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV4_GW_ADDRESS:
      return {
        ipv4: {
          ...state.ipv4,
          gatewayIpAddress: action.nextGatewayIpAddress,
        },
        ipv6: {
          ...state.ipv6,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV6_GW_ADDRESS:
      return {
        ipv4: {
          ...state.ipv4,
        },
        ipv6: {
          ...state.ipv6,
          gatewayIpAddress: action.nextGatewayIpAddress,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV4_ADDRESS:
      return {
        ipv4: {
          ...state.ipv4,
          ipv4Address: action.nextIpv4Address,
        },
        ipv6: {
          ...state.ipv6,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV6_ADDRESS:
      return {
        ipv4: {
          ...state.ipv4,
        },
        ipv6: {
          ...state.ipv6,
          ipv6Address: action.nextIpv6Address,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV4_CIDR:
      return {
        ipv4: {
          ...state.ipv4,
          ipv4Cidr: action.nextIpv4Cidr,
        },
        ipv6: {
          ...state.ipv6,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV6_CIDR:
      return {
        ipv4: {
          ...state.ipv4,
        },
        ipv6: {
          ...state.ipv6,
          ipv6Cidr: action.nextIpv6Cidr,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV4_BINARY:
      return {
        ipv4: {
          ...state.ipv4,
          binary: action.nextBinary,
        },
        ipv6: {
          ...state.ipv6,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_TYPE:
      return {
        ...state,
        addressType: action.nextAddressType || ADDRESS_TYPE_IPV4,
      };
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
