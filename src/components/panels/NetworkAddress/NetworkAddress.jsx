/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Layer,
  RadioButtonGroup,
  RadioButton,
  FlexGrid,
  Row,
  Column,
} from "@carbon/react";
import {
  ADDRESS_TYPE_IPV4,
  ADDRESS_TYPE_IPV6,
  UPDATE_FUNCTION__UNKNOWN,
  UPDATE_FUNCTION__IPV4_ADDRESS,
  UPDATE_FUNCTION__IPV4_PREFIX,
  UPDATE_FUNCTION__IPV4_NETMASK,
  UPDATE_FUNCTION__IPV4_BINARY,
  UPDATE_FUNCTION__IPV4_GATEWAY,
  UPDATE_FUNCTION__IPV4_NAMESERVER,
  UPDATE_FUNCTION__IPV4_HOSTNAME,
  UPDATE_FUNCTION__IPV6_ADDRESS,
  UPDATE_FUNCTION__IPV6_PREFIX,
  UPDATE_FUNCTION__IPV6_GATEWAY,
  UPDATE_FUNCTION__IPV6_NAMESERVER,
  UPDATE_FUNCTION__IPV6_HOSTNAME,
} from "../../../util/constants";
import {
  isIpv4NetworkAddressValid,
  isIpv6NetworkAddressValid,
} from "../../../util/network-address-util";
import { IPv4Panel, IPv6Panel } from "./components";
import "./_network-address.scss";

const NetworkAddress = (patchState, localStorageKey) => {
  const { t } = useTranslation();
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      ipv4: {
        netmask: {
          value: "",
          valid: false,
          computed: false,
        },
        ipv4Cidr: {
          value: "",
          valid: false,
          computed: false,
        },
        binary: "",
        ipv4Address: {
          value: "",
          valid: false,
        },
        gatewayIpAddress: {
          value: "",
          valid: false,
        },
        nameserverIpAddress: {
          value: "",
          valid: false,
        },
        hostName: {
          value: "",
          valid: false,
        },
      },
      ipv6: {
        ipv6Cidr: {
          value: "",
          valid: false,
        },
        ipv6Address: {
          value: "",
          valid: false,
        },
        gatewayIpAddress: {
          value: "",
          valid: false,
        },
        nameserverIpAddress: {
          value: "",
          valid: false,
        },
        hostName: {
          value: "",
          valid: false,
        },
      },
      addressType: ADDRESS_TYPE_IPV4,
    };

    if (initialState) {
      return initialState;
    }
    return defaultState;
  };
  const [state, setState] = useState(getInitialState());

  const ipVersion =
    state.addressType && state.addressType === ADDRESS_TYPE_IPV6
      ? "ipv6"
      : "ipv4";

  const updateFunction = ({
    propertyName = UPDATE_FUNCTION__UNKNOWN,
    propertyValue = null,
    propertyIsValid = false,
    propertyIsComputed = false,
  }) => {
    if (propertyName === UPDATE_FUNCTION__IPV4_ADDRESS) {
      updateIpv4Address(propertyValue, propertyIsValid);
    } else if (propertyName === UPDATE_FUNCTION__IPV4_PREFIX) {
      updateIpv4Cidr(propertyValue, propertyIsValid, propertyIsComputed);
    } else if (propertyName === UPDATE_FUNCTION__IPV4_NETMASK) {
      updateNetmask(propertyValue, propertyIsValid, propertyIsComputed);
    } else if (propertyName === UPDATE_FUNCTION__IPV4_BINARY) {
      updateBinary(propertyValue);
    } else if (propertyName === UPDATE_FUNCTION__IPV4_GATEWAY) {
      updateGatewayAddress(propertyValue, propertyIsValid);
    } else if (propertyName === UPDATE_FUNCTION__IPV4_NAMESERVER) {
      updateNameserverAddress(propertyValue, propertyIsValid);
    } else if (propertyName === UPDATE_FUNCTION__IPV4_HOSTNAME) {
      updateHostName(propertyValue, propertyIsValid);
    } else if (propertyName === UPDATE_FUNCTION__IPV6_ADDRESS) {
      updateIpv6Address(propertyValue, propertyIsValid);
    } else if (propertyName === UPDATE_FUNCTION__IPV6_PREFIX) {
      updateIpv6Cidr(propertyValue, propertyIsValid);
    } else if (propertyName === UPDATE_FUNCTION__IPV6_GATEWAY) {
      updateGatewayAddress(propertyValue, propertyIsValid);
    } else if (propertyName === UPDATE_FUNCTION__IPV6_NAMESERVER) {
      updateNameserverAddress(propertyValue, propertyIsValid);
    } else if (propertyName === UPDATE_FUNCTION__IPV6_HOSTNAME) {
      updateHostName(propertyValue, propertyIsValid);
    } else if (UPDATE_FUNCTION__UNKNOWN) {
      console.log("Unknown property name passed to update proxy function.");
    }
  };

  const updateNetmask = (netmask, valid, computed) => {
    if (state.addressType) {
      setState((prevState) => ({
        ...prevState,
        [ipVersion]: {
          ...prevState[ipVersion],
          netmask: {
            ...(prevState[ipVersion]?.netmask ?? null),
            value: netmask,
            valid,
            computed,
          },
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        ipv4: {
          ...prevState.ipv4,
          netmask: {
            ...(prevState?.ipv4?.netmask ?? null),
            value: netmask,
            valid,
            computed,
          },
        },
        addressType: ADDRESS_TYPE_IPV4,
      }));
    }
  };

  const updateIpv4Cidr = (ipv4Cidr, valid, computed) => {
    if (state.addressType) {
      setState((prevState) => ({
        ...prevState,
        [ipVersion]: {
          ...prevState[ipVersion],
          ipv4Cidr: {
            ...(prevState[ipVersion]?.ipv4Cidr ?? null),
            value: ipv4Cidr,
            valid,
            computed,
          },
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        ipv4: {
          ...prevState.ipv4,
          ipv4Cidr: {
            ...(prevState?.ipv4?.ipv4Cidr ?? null),
            value: ipv4Cidr,
            valid,
            computed,
          },
        },
        addressType: ADDRESS_TYPE_IPV4,
      }));
    }
  };

  const updateIpv6Cidr = (ipv6Cidr, valid) => {
    if (state.addressType) {
      setState((prevState) => ({
        ...prevState,
        [ipVersion]: {
          ...prevState[ipVersion],
          ipv6Cidr: {
            ...(prevState[ipVersion]?.ipv6Cidr ?? null),
            value: ipv6Cidr,
            valid,
          },
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        ipv6: {
          ...prevState.ipv6,
          ipv6Cidr: {
            ...(prevState?.ipv6?.ipv6Cidr ?? null),
            value: ipv6Cidr,
            valid,
          },
        },
        addressType: ADDRESS_TYPE_IPV4,
      }));
    }
  };

  const updateBinary = (binary) => {
    if (state.addressType) {
      setState((prevState) => ({
        ...prevState,
        [ipVersion]: {
          ...prevState[ipVersion],
          binary,
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        ipv4: {
          ...prevState.ipv4,
          binary,
        },
        addressType: ADDRESS_TYPE_IPV4,
      }));
    }
  };

  const updateAddressType = (addressType) => {
    setState((prevState) => {
      return {
        ...prevState,
        addressType,
      };
    });
  };

  const updateIpv4Address = (ipv4Address, valid) => {
    if (state.addressType) {
      setState((prevState) => ({
        ...prevState,
        ipv4: {
          ...prevState.ipv4,
          ipv4Address: {
            ...(prevState?.ipv4?.ipv4Address ?? null),
            value: ipv4Address,
            valid,
          },
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        ipv4: {
          ...prevState.ipv4,
          ipv4Address: {
            ...(prevState?.ipv4?.ipv4Address ?? null),
            value: ipv4Address,
            valid,
          },
        },
        addressType: ADDRESS_TYPE_IPV4,
      }));
    }
  };

  const updateIpv6Address = (ipv6Address, valid) => {
    if (state.addressType) {
      setState((prevState) => ({
        ...prevState,
        ipv6: {
          ...prevState.ipv6,
          ipv6Address: {
            ...(prevState?.ipv6?.ipv6Address ?? null),
            value: ipv6Address,
            valid,
          },
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        ipv6: {
          ...prevState.ipv6,
          ipv6Address: {
            ...(prevState?.ipv6?.ipv6Address ?? null),
            value: ipv6Address,
            valid,
          },
        },
        addressType: ADDRESS_TYPE_IPV4,
      }));
    }
  };

  const updateGatewayAddress = (gatewayIpAddress, valid) => {
    if (state.addressType) {
      setState((prevState) => ({
        ...prevState,
        [ipVersion]: {
          ...prevState[ipVersion],
          gatewayIpAddress: {
            ...(prevState[ipVersion]?.gatewayIpAddress ?? null),
            value: gatewayIpAddress,
            valid,
          },
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        ipv4: {
          ...prevState.ipv4,
          gatewayIpAddress: {
            ...(prevState?.ipv4?.gatewayIpAddress ?? null),
            value: gatewayIpAddress,
            valid,
          },
        },
        addressType: ADDRESS_TYPE_IPV4,
      }));
    }
  };

  const updateNameserverAddress = (nameserverIpAddress, valid) => {
    if (state.addressType) {
      setState((prevState) => ({
        ...prevState,
        [ipVersion]: {
          ...prevState[ipVersion],
          nameserverIpAddress: {
            ...(prevState[ipVersion]?.nameserverIpAddress ?? null),
            value: nameserverIpAddress,
            valid,
          },
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        ipv4: {
          ...prevState.ipv4,
          nameserverIpAddress: {
            ...(prevState?.ipv4?.nameserverIpAddress ?? null),
            value: nameserverIpAddress,
            valid,
          },
        },
        addressType: ADDRESS_TYPE_IPV4,
      }));
    }
  };

  const updateHostName = (hostName, valid) => {
    if (state.addressType) {
      setState((prevState) => ({
        ...prevState,
        [ipVersion]: {
          ...prevState[ipVersion],
          hostName: {
            ...(prevState[ipVersion]?.hostName ?? null),
            value: hostName,
            valid,
          },
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        ipv4: {
          ...prevState.ipv4,
          hostName: {
            ...(prevState?.ipv4?.hostName ?? null),
            value: hostName,
            valid,
          },
        },
        addressType: ADDRESS_TYPE_IPV4,
      }));
    }
  };

  const ipv4Namespace = state.ipv4;
  const ipv6Namespace = state.ipv6;

  const isV4AddressValid = () => {
    if (
      !ipv4Namespace.ipv4Cidr ||
      !ipv4Namespace.gatewayIpAddress ||
      !ipv4Namespace.nameserverIpAddress
    ) {
      return false;
    }
    return (
      ipv4Namespace.ipv4Cidr.valid &&
      ipv4Namespace.netmask.valid &&
      ipv4Namespace.ipv4Address.valid &&
      ipv4Namespace.gatewayIpAddress.valid &&
      ipv4Namespace.nameserverIpAddress.valid
    );
  };

  const isV6AddressValid = () => {
    if (
      !ipv6Namespace.ipv6Cidr ||
      !ipv6Namespace.gatewayIpAddress ||
      !ipv6Namespace.nameserverIpAddress
    ) {
      return false;
    }
    return (
      ipv6Namespace.ipv6Cidr.valid &&
      ipv6Namespace.ipv6Address.valid &&
      ipv6Namespace.gatewayIpAddress.valid &&
      ipv6Namespace.nameserverIpAddress.valid
    );
  };

  const isIpAddressValid = () => {
    return state.addressType === ADDRESS_TYPE_IPV4
      ? isV4AddressValid()
      : isV6AddressValid();
  };

  const isGatewayIpAddressValid = () => {
    const gatewayIpAddressValueIsValid =
      state.addressType === ADDRESS_TYPE_IPV4
        ? isIpv4NetworkAddressValid(ipv4Namespace.gatewayIpAddress.value)
        : isIpv6NetworkAddressValid(ipv6Namespace.gatewayIpAddress.value);
    return gatewayIpAddressValueIsValid;
  };

  const isNameserverIpAddressValid = () => {
    const nameserverIpAddressValueIsValid =
      state.addressType === ADDRESS_TYPE_IPV4
        ? isIpv4NetworkAddressValid(ipv4Namespace.nameserverIpAddress.value)
        : isIpv6NetworkAddressValid(ipv6Namespace.nameserverIpAddress.value);
    return nameserverIpAddressValueIsValid;
  };

  const isHostNameValid = () => {
    if (state[ipVersion].hostName) {
      return state[ipVersion].hostName.valid;
    }
    // return true since hostName is optional
    return true;
  };

  const isValid = () => {
    return (
      isIpAddressValid() &&
      isGatewayIpAddressValid() &&
      isNameserverIpAddressValid() &&
      isHostNameValid()
    );
  };

  const isIpv4AddressComplete = () => {
    return (
      ipv4Namespace &&
      typeof ipv4Namespace.ipv4Address === "object" &&
      typeof ipv4Namespace.ipv4Address.value === "string" &&
      ipv4Namespace.ipv4Address.value.length > 0
    );
  };

  const isIpv4CidrComplete = () => {
    return (
      ipv4Namespace &&
      typeof ipv4Namespace.ipv4Cidr === "object" &&
      (typeof ipv4Namespace.ipv4Cidr.value === "number" ||
        typeof ipv4Namespace.ipv4Cidr.value === "string") &&
      ipv4Namespace.ipv4Cidr.value > 0
    );
  };

  const isIpv4NetmaskComplete = () => {
    return (
      ipv4Namespace &&
      typeof ipv4Namespace.netmask === "object" &&
      typeof ipv4Namespace.netmask.value === "string" &&
      ipv4Namespace.netmask.value.length > 0
    );
  };

  const isIpv4DataComplete = () => {
    return (
      state.addressType === ADDRESS_TYPE_IPV4 &&
      isIpv4AddressComplete() &&
      isIpv4CidrComplete() &&
      isIpv4NetmaskComplete()
    );
  };

  const isIpv6AddressComplete = () => {
    return (
      ipv6Namespace &&
      typeof ipv6Namespace.ipv6Address === "object" &&
      typeof ipv6Namespace.ipv6Address.value === "string" &&
      ipv6Namespace.ipv6Address.value.length > 0
    );
  };

  const isIpv6CidrComplete = () => {
    return (
      ipv6Namespace &&
      typeof ipv6Namespace.ipv6Cidr === "object" &&
      (typeof ipv6Namespace.ipv6Cidr.value === "number" ||
        typeof ipv6Namespace.ipv6Cidr.value === "string") &&
      ipv6Namespace.ipv6Cidr.value > 0
    );
  };

  const isIpv6DataComplete = () => {
    return (
      state.addressType === ADDRESS_TYPE_IPV6 &&
      isIpv6AddressComplete() &&
      isIpv6CidrComplete()
    );
  };

  const isIpDataComplete = () => {
    return isIpv4DataComplete() || isIpv6DataComplete();
  };

  const isGatewayIpAddressComplete = () => {
    return (
      typeof state[ipVersion].gatewayIpAddress === "object" &&
      typeof state[ipVersion].gatewayIpAddress.value === "string" &&
      state[ipVersion].gatewayIpAddress.value.length > 0
    );
  };

  const isNameserverIpAddressComplete = () => {
    return (
      typeof state[ipVersion].nameserverIpAddress === "object" &&
      typeof state[ipVersion].nameserverIpAddress.value === "string" &&
      state[ipVersion].nameserverIpAddress.value.length > 0
    );
  };

  const isHostNameComplete = () => {
    if (state[ipVersion].hostName) {
      return (
        typeof state[ipVersion].hostName === "object" &&
        typeof state[ipVersion].hostName.value === "string"
      );
    }
    // return true since hostName is optional
    return true;
  };

  const isComplete = () => {
    return (
      isIpDataComplete() &&
      isGatewayIpAddressComplete() &&
      isNameserverIpAddressComplete() &&
      isHostNameComplete()
    );
  };

  const isCompleteAndValid = (callback) => {
    let localIsComplete = false;
    let localIsValid = false;

    if (isComplete()) {
      localIsComplete = true;
      localIsValid = isValid();
    }

    if (localIsComplete && localIsValid) {
      return callback(null, {
        isComplete: localIsComplete,
        isValid: localIsValid,
      });
    }

    return callback(new Error("Form data is incomplete or invalid"), {
      isComplete: localIsComplete,
      isValid: localIsValid,
    });
  };

  useEffect(
    () => () => {
      localStorage.setItem(localStorageKey, JSON.stringify(state));

      isCompleteAndValid((error, isCompleteAndValid) => {
        if (!error) {
          patchState({
            steps: {
              networkAddress: {
                addressType: state.addressType,
                ipv4: {
                  cidr: +state?.ipv4?.ipv4Cidr?.value ?? 1,
                  binary: state?.ipv4?.binary ?? "",
                  netmask: state?.ipv4?.netmask?.value ?? "",
                  address: state?.ipv4?.ipv4Address?.value ?? "",
                },
                ipv6: {
                  cidr: +state?.ipv6?.ipv6Cidr?.value ?? 1,
                  address: state?.ipv6?.ipv6Address?.value ?? "",
                },
                gatewayIpAddress: state[ipVersion].gatewayIpAddress
                  ? state[ipVersion].gatewayIpAddress.value
                  : "",
                nameserverIpAddress: state[ipVersion].nameserverIpAddress
                  ? state[ipVersion].nameserverIpAddress.value
                  : "",
                hostName: state[ipVersion].hostName
                  ? state[ipVersion].hostName.value
                  : "",
                complete: true,
                invalid: false,
                localStorageKey,
              },
            },
          });
        } else if (isCompleteAndValid.isComplete) {
          patchState({
            steps: {
              networkAddress: {
                addressType: state.addressType,
                ipv4: {
                  cidr: +state?.ipv4?.ipv4Cidr?.value ?? 1,
                  binary: state?.ipv4?.binary ?? "",
                  netmask: state?.ipv4?.netmask?.value ?? "",
                  address: state?.ipv4?.ipv4Address?.value ?? "",
                },
                ipv6: {
                  cidr: +state?.ipv6?.ipv6Cidr?.value ?? 1,
                  address: state?.ipv6?.ipv6Address?.value ?? "",
                },
                gatewayIpAddress:
                  state[ipVersion]?.gatewayIpAddress?.value ?? "",
                nameserverIpAddress:
                  state[ipVersion]?.nameserverIpAddress?.value ?? "",
                hostName: state[ipVersion]?.hostName?.value ?? "",
                complete: isCompleteAndValid.isComplete,
                invalid: !isCompleteAndValid.isValid,
                localStorageKey,
              },
            },
          });
        } else {
          patchState({
            steps: {
              networkAddress: {
                addressType: state?.addressType ?? ADDRESS_TYPE_IPV4,
                ipv4: {
                  cidr: +state?.ipv4?.ipv4Cidr?.value ?? 1,
                  binary: state?.ipv4?.binary ?? "",
                  netmask: state?.ipv4?.netmask?.value ?? "",
                  address: state?.ipv4?.ipv4Address?.value ?? "",
                },
                ipv6: {
                  cidr: +state?.ipv6?.ipv6Cidr?.value ?? 1,
                  address: state?.ipv6?.ipv6Address?.value ?? "",
                },
                gatewayIpAddress:
                  state[ipVersion]?.gatewayIpAddress?.value ?? "",
                nameserverIpAddress:
                  state[ipVersion]?.nameserverIpAddress?.value ?? "",
                hostName: state[ipVersion]?.hostName?.value ?? "",
                complete: isCompleteAndValid.isComplete,
                invalid: !isCompleteAndValid.isValid,
                localStorageKey,
              },
            },
          });
        }
      });
    },
    [state],
  );

  const gridContentsMarkupRowOne = (
    <div className="network-address_column-left">
      <RadioButtonGroup
        className="network-address_ip-version-group"
        legendText={t("panel.networkAddress.internetProtocolVersionTextLabel", {
          ns: "panels",
        })}
        name="network-address_ip-version-group"
        defaultSelected={state?.addressType ?? ADDRESS_TYPE_IPV4}
        onChange={(selected) => {
          updateAddressType(selected);
        }}
      >
        <RadioButton
          labelText="IPv4"
          value={ADDRESS_TYPE_IPV4}
          id="network-address_ipv4-radio"
        />
        <RadioButton
          labelText="IPv6"
          value={ADDRESS_TYPE_IPV6}
          id="network-address_ipv6-radio"
        />
      </RadioButtonGroup>
    </div>
  );

  const getIPVersionSpecificMarkup = () => {
    if (state.addressType && state.addressType === ADDRESS_TYPE_IPV4) {
      return <IPv4Panel updateFunction={updateFunction} state={state} />;
    } else if (state.addressType && state.addressType === ADDRESS_TYPE_IPV6) {
      return <IPv6Panel updateFunction={updateFunction} state={state} />;
    } else if (!state.addressType) {
      return <IPv4Panel updateFunction={updateFunction} state={state} />;
    }
    return <></>;
  };

  return (
    <Layer>
      <FlexGrid className="network-address__grid">
        <Row>
          <Column>{gridContentsMarkupRowOne}</Column>
        </Row>
        {getIPVersionSpecificMarkup()}
      </FlexGrid>
    </Layer>
  );
};

NetworkAddress.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired,
};

export default NetworkAddress;
