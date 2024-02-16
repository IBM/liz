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

const DEFAULT_STRING_OBJECT = {
  value: "",
  valid: true,
};

const DEFAULT_NUMBER_OBJECT = {
  value: 1,
  valid: true,
};

const DEFAULT_COMPUTED_STRING_OBJECT = {
  value: "",
  valid: true,
  computed: false,
};

const DEFAULT_COMPUTED_NUMBER_OBJECT = {
  value: 1,
  valid: true,
  computed: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_RESET_TO_INITIAL_STATE:
      return action.nextInitialState;
    case ACTION_UPDATE_NETWORK_ADDRESS_NETMASK:
      return {
        ipv4: {
          netmask: action.nextNetmask,
          ipv4Cidr: state?.ipv4?.ipv4Cidr ?? DEFAULT_COMPUTED_NUMBER_OBJECT,
          binary: state?.ipv4?.binary ?? "",
          ipv4Address: state?.ipv4?.ipv4Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv4?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv4?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv4?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        ipv6: {
          ipv6Cidr: state?.ipv6?.ipv6Cidr ?? DEFAULT_NUMBER_OBJECT,
          ipv6Address: state?.ipv6?.ipv6Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv6?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv6?.nameserverIpAddres ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv6?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV4_HOSTNAME:
      return {
        ipv4: {
          netmask: state?.ipv4?.netmask ?? DEFAULT_COMPUTED_STRING_OBJECT,
          ipv4Cidr: state?.ipv4?.ipv4Cidr ?? DEFAULT_COMPUTED_NUMBER_OBJECT,
          binary: state?.ipv4?.binary ?? "",
          ipv4Address: state?.ipv4?.ipv4Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv4?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv4?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: action.nextHostName,
        },
        ipv6: {
          ipv6Cidr: state?.ipv6?.ipv6Cidr ?? DEFAULT_NUMBER_OBJECT,
          ipv6Address: state?.ipv6?.ipv6Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv6?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv6?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv6?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV6_HOSTNAME:
      return {
        ipv4: {
          netmask: state?.ipv4?.netmask ?? DEFAULT_COMPUTED_STRING_OBJECT,
          ipv4Cidr: state?.ipv4?.ipv4Cidr ?? DEFAULT_COMPUTED_NUMBER_OBJECT,
          binary: state?.ipv4?.binary ?? "",
          ipv4Address: state?.ipv4?.ipv4Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv4?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv4?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv4?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        ipv6: {
          ipv6Cidr: state?.ipv6?.ipv6Cidr ?? DEFAULT_NUMBER_OBJECT,
          ipv6Address: state?.ipv6?.ipv6Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv6?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv6?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: action.nextHostName,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV4_NS_ADDRESS:
      return {
        ipv4: {
          netmask: state?.ipv4?.netmask ?? DEFAULT_COMPUTED_STRING_OBJECT,
          ipv4Cidr: state?.ipv4?.ipv4Cidr ?? DEFAULT_COMPUTED_NUMBER_OBJECT,
          binary: state?.ipv4?.binary ?? "",
          ipv4Address: state?.ipv4?.ipv4Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv4?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress: action.nextNameserverIpAddress,
          hostName: state?.ipv4?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        ipv6: {
          ipv6Cidr: state?.ipv6?.ipv6Cidr ?? DEFAULT_NUMBER_OBJECT,
          ipv6Address: state?.ipv6?.ipv6Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv6?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv6?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv6?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV6_NS_ADDRESS:
      return {
        ipv4: {
          netmask: state?.ipv4?.netmask ?? DEFAULT_COMPUTED_STRING_OBJECT,
          ipv4Cidr: state?.ipv4?.ipv4Cidr ?? DEFAULT_COMPUTED_NUMBER_OBJECT,
          binary: state?.ipv4?.binary ?? "",
          ipv4Address: state?.ipv4?.ipv4Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv4?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv4?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv4?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        ipv6: {
          ipv6Cidr: state?.ipv6?.ipv6Cidr ?? DEFAULT_NUMBER_OBJECT,
          ipv6Address: state?.ipv6?.ipv6Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv6?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress: action.nextNameserverIpAddress,
          hostName: state?.ipv6?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV4_GW_ADDRESS:
      return {
        ipv4: {
          netmask: state?.ipv4?.netmask ?? DEFAULT_COMPUTED_STRING_OBJECT,
          ipv4Cidr: state?.ipv4?.ipv4Cidr ?? DEFAULT_COMPUTED_NUMBER_OBJECT,
          binary: state?.ipv4?.binary ?? "",
          ipv4Address: state?.ipv4?.ipv4Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress: action.nextGatewayIpAddress,
          nameserverIpAddress:
            state?.ipv4?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv4?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        ipv6: {
          ipv6Cidr: state?.ipv6?.ipv6Cidr ?? DEFAULT_NUMBER_OBJECT,
          ipv6Address: state?.ipv6?.ipv6Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv6?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv6?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv6?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV6_GW_ADDRESS:
      return {
        ipv4: {
          netmask: state?.ipv4?.netmask ?? DEFAULT_COMPUTED_STRING_OBJECT,
          ipv4Cidr: state?.ipv4?.ipv4Cidr ?? DEFAULT_COMPUTED_NUMBER_OBJECT,
          binary: state?.ipv4?.binary ?? "",
          ipv4Address: state?.ipv4?.ipv4Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv4?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv4?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv4?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        ipv6: {
          ipv6Cidr: state?.ipv6?.ipv6Cidr ?? DEFAULT_NUMBER_OBJECT,
          ipv6Address: state?.ipv6?.ipv6Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress: action.nextGatewayIpAddress,
          nameserverIpAddress:
            state?.ipv6?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv6?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV4_ADDRESS:
      return {
        ipv4: {
          netmask: state?.ipv4?.netmask ?? DEFAULT_COMPUTED_STRING_OBJECT,
          ipv4Cidr: state?.ipv4?.ipv4Cidr ?? DEFAULT_COMPUTED_NUMBER_OBJECT,
          binary: state?.ipv4?.binary ?? "",
          ipv4Address: action.nextIpv4Address,
          gatewayIpAddress:
            state?.ipv4?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv4?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv4?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        ipv6: {
          ipv6Cidr: state?.ipv6?.ipv6Cidr ?? DEFAULT_NUMBER_OBJECT,
          ipv6Address: state?.ipv6?.ipv6Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv6?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv6?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv6?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV6_ADDRESS:
      return {
        ipv4: {
          netmask: state?.ipv4?.netmask ?? DEFAULT_COMPUTED_STRING_OBJECT,
          ipv4Cidr: state?.ipv4?.ipv4Cidr ?? DEFAULT_COMPUTED_NUMBER_OBJECT,
          binary: state?.ipv4?.binary ?? "",
          ipv4Address: state?.ipv4?.ipv4Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv4?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv4?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv4?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        ipv6: {
          ipv6Cidr: state?.ipv6?.ipv6Cidr ?? DEFAULT_NUMBER_OBJECT,
          ipv6Address: action.nextIpv6Address,
          gatewayIpAddress:
            state?.ipv6?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv6?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv6?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV4_CIDR:
      return {
        ipv4: {
          netmask: state?.ipv4?.netmask ?? DEFAULT_COMPUTED_STRING_OBJECT,
          ipv4Cidr: action.nextIpv4Cidr,
          binary: state?.ipv4?.binary ?? "",
          ipv4Address: state?.ipv4?.ipv4Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv4?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv4?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv4?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        ipv6: {
          ipv6Cidr: state?.ipv6?.ipv6Cidr ?? DEFAULT_NUMBER_OBJECT,
          ipv6Address: state?.ipv6?.ipv6Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv6?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv6?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv6?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV6_CIDR:
      return {
        ipv4: {
          netmask: state?.ipv4?.netmask ?? DEFAULT_COMPUTED_STRING_OBJECT,
          ipv4Cidr: state?.ipv4?.ipv4Cidr ?? DEFAULT_COMPUTED_NUMBER_OBJECT,
          binary: state?.ipv4?.binary ?? "",
          ipv4Address: state?.ipv4?.ipv4Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv4?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv4?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv4?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        ipv6: {
          ipv6Cidr: action.nextIpv6Cidr,
          ipv6Address: state?.ipv6?.ipv6Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv6?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv6?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv6?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_IPV4_BINARY:
      return {
        ipv4: {
          netmask: state?.ipv4?.netmask ?? DEFAULT_COMPUTED_STRING_OBJECT,
          ipv4Cidr: state?.ipv4?.ipv4Cidr ?? DEFAULT_COMPUTED_NUMBER_OBJECT,
          binary: action.nextBinary,
          ipv4Address: state?.ipv4?.ipv4Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv4?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv4?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv4?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        ipv6: {
          ipv6Cidr: state?.ipv6?.ipv6Cidr ?? DEFAULT_NUMBER_OBJECT,
          ipv6Address: state?.ipv6?.ipv6Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv6?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv6?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv6?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        addressType: state.addressType || ADDRESS_TYPE_IPV4,
      };
    case ACTION_UPDATE_NETWORK_ADDRESS_TYPE:
      return {
        ipv4: {
          netmask: state?.ipv4?.netmask ?? DEFAULT_COMPUTED_STRING_OBJECT,
          ipv4Cidr: state?.ipv4?.ipv4Cidr ?? DEFAULT_COMPUTED_NUMBER_OBJECT,
          binary: state?.ipv4?.binary ?? "",
          ipv4Address: state?.ipv4?.ipv4Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv4?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv4?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv4?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        ipv6: {
          ipv6Cidr: state?.ipv6?.ipv6Cidr ?? DEFAULT_NUMBER_OBJECT,
          ipv6Address: state?.ipv6?.ipv6Address ?? DEFAULT_STRING_OBJECT,
          gatewayIpAddress:
            state?.ipv6?.gatewayIpAddress ?? DEFAULT_STRING_OBJECT,
          nameserverIpAddress:
            state?.ipv6?.nameserverIpAddress ?? DEFAULT_STRING_OBJECT,
          hostName: state?.ipv6?.hostName ?? DEFAULT_STRING_OBJECT,
        },
        addressType: action.nextAddressType || ADDRESS_TYPE_IPV4,
      };
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
