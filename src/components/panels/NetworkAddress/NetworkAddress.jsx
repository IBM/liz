/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Layer,
  RadioButtonGroup,
  RadioButton,
  FlexGrid,
  Row,
  Column,
  ActionableNotification,
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
  UPDATE_FUNCTION__IPV4_DOMAIN_SEARCH_PATH,
  UPDATE_FUNCTION__IPV6_ADDRESS,
  UPDATE_FUNCTION__IPV6_PREFIX,
  UPDATE_FUNCTION__IPV6_GATEWAY,
  UPDATE_FUNCTION__IPV6_NAMESERVER,
  UPDATE_FUNCTION__IPV6_HOSTNAME,
  UPDATE_FUNCTION__IPV6_DOMAIN_SEARCH_PATH,
  ACTION_UPDATE_NETWORK_ADDRESS_NETMASK,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_HOSTNAME,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_HOSTNAME,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV4_DOMAIN_SEARCH_PATH,
  ACTION_UPDATE_NETWORK_ADDRESS_IPV6_DOMAIN_SEARCH_PATH,
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
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_DISABLED,
  LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
  SLES_DISTRIBUTION_ID,
  UBUNTU_DISTRIBUTION_ID,
  DEFAULT_DISTRIBUTION_ID,
} from "../../../util/constants";
import { ApplicationContext } from "../../../App";
import { updateIsDisabled } from "../../../util/panel-utils";
import {
  isIpv4NetworkAddressValid,
  isIpv6NetworkAddressValid,
} from "../../../util/network-address-util";
import { resetParamFileTextAreaData } from "../../../uiUtil/panel-utils";
import { IPv4Panel, IPv6Panel } from "./components";
import "./_network-address.scss";

const NetworkAddress = forwardRef(function NetworkAddress(props, ref) {
  const {
    state: globalState,
    dispatch: globalDispatch,
    componentDispatchers,
  } = React.useContext(ApplicationContext);
  const downloadParamFileDispatch =
    componentDispatchers.downloadParamFileDispatch;
  const { t } = useTranslation();

  const { state, dispatch } = props;
  const publicRef = {
    persistState: () => {
      let mergedSteps = {};

      isCompleteAndValid((error, isCompleteAndValid) => {
        if (!error) {
          mergedSteps = {
            ...globalState,
            steps: {
              ...globalState.steps,
              networkAddress: {
                ...globalState.steps.networkAddress,
                addressType: state.addressType,
                ipv4: {
                  cidr: +state?.ipv4?.ipv4Cidr?.value,
                  binary: state?.ipv4?.binary ?? "",
                  netmask: state?.ipv4?.netmask?.value ?? "",
                  address: state?.ipv4?.ipv4Address?.value ?? "",
                },
                ipv6: {
                  cidr: +state?.ipv6?.ipv6Cidr?.value,
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
                domainSearchPath: state[ipVersion].domainSearchPath
                  ? state[ipVersion].domainSearchPath.value
                  : "",
                complete: true,
                invalid: false,
                origin: STATE_ORIGIN_USER,
              },
            },
          };
        } else if (isCompleteAndValid.isComplete) {
          mergedSteps = {
            ...globalState,
            steps: {
              ...globalState.steps,
              networkAddress: {
                ...globalState.steps.networkAddress,
                addressType: state.addressType,
                ipv4: {
                  cidr: +state?.ipv4?.ipv4Cidr?.value,
                  binary: state?.ipv4?.binary ?? "",
                  netmask: state?.ipv4?.netmask?.value ?? "",
                  address: state?.ipv4?.ipv4Address?.value ?? "",
                },
                ipv6: {
                  cidr: +state?.ipv6?.ipv6Cidr?.value,
                  address: state?.ipv6?.ipv6Address?.value ?? "",
                },
                gatewayIpAddress:
                  state[ipVersion]?.gatewayIpAddress?.value ?? "",
                nameserverIpAddress:
                  state[ipVersion]?.nameserverIpAddress?.value ?? "",
                hostName: state[ipVersion]?.hostName?.value ?? "",
                domainSearchPath:
                  state[ipVersion]?.domainSearchPath?.value ?? "",
                complete: isCompleteAndValid.isComplete,
                invalid: !isCompleteAndValid.isValid,
                origin: STATE_ORIGIN_USER,
              },
            },
          };
        } else {
          mergedSteps = {
            ...globalState,
            steps: {
              ...globalState.steps,
              networkAddress: {
                ...globalState.steps.networkAddress,
                addressType: state?.addressType ?? ADDRESS_TYPE_IPV4,
                ipv4: {
                  cidr: +state?.ipv4?.ipv4Cidr?.value,
                  binary: state?.ipv4?.binary ?? "",
                  netmask: state?.ipv4?.netmask?.value ?? "",
                  address: state?.ipv4?.ipv4Address?.value ?? "",
                },
                ipv6: {
                  cidr: +state?.ipv6?.ipv6Cidr?.value,
                  address: state?.ipv6?.ipv6Address?.value ?? "",
                },
                gatewayIpAddress:
                  state[ipVersion]?.gatewayIpAddress?.value ?? "",
                nameserverIpAddress:
                  state[ipVersion]?.nameserverIpAddress?.value ?? "",
                hostName: state[ipVersion]?.hostName?.value ?? "",
                domainSearchPath:
                  state[ipVersion]?.domainSearchPath?.value ?? "",
                complete: isCompleteAndValid.isComplete,
                invalid: !isCompleteAndValid.isValid,
                origin: STATE_ORIGIN_USER,
              },
            },
          };
        }

        globalDispatch({
          type: ACTION_UPDATE_APP_STEPS,
          nextSteps: mergedSteps.steps,
        });
        globalDispatch({
          type: ACTION_UPDATE_APP_IS_DIRTY,
          nextIsDirty: true,
        });
        globalDispatch({
          type: ACTION_UPDATE_APP_IS_DISABLED,
          nextSteps: updateIsDisabled(mergedSteps.steps),
        });
      });

      localStorage.setItem(
        LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
        JSON.stringify({
          ...state,
          origin: STATE_ORIGIN_STORAGE,
        }),
      );
    },
  };

  useEffect(publicRef.persistState, [state]);
  useImperativeHandle(ref, () => publicRef);

  const paramFileHasBeenModifiedFromState =
    globalState?.steps.downloadParamFile?.modified ?? false;
  const ipVersion =
    state.addressType && state.addressType === ADDRESS_TYPE_IPV6
      ? "ipv6"
      : "ipv4";
  const distributionName =
    globalState?.steps?.inputFileSelection?.distributionName ??
    DEFAULT_DISTRIBUTION_ID;
  const requiresDomainSearchName = !!(
    distributionName &&
    distributionName.length > 0 &&
    (distributionName === SLES_DISTRIBUTION_ID ||
      distributionName === UBUNTU_DISTRIBUTION_ID)
  );

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
    } else if (propertyName === UPDATE_FUNCTION__IPV4_DOMAIN_SEARCH_PATH) {
      updateDomainSearchPath(propertyValue, propertyIsValid);
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
    } else if (propertyName === UPDATE_FUNCTION__IPV6_DOMAIN_SEARCH_PATH) {
      updateDomainSearchPath(propertyValue, propertyIsValid);
    } else if (UPDATE_FUNCTION__UNKNOWN) {
      console.log("Unknown property name passed to update proxy function.");
    }
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
    return ipVersion === ADDRESS_TYPE_IPV4 ||
      state.addressType === ADDRESS_TYPE_IPV4
      ? isV4AddressValid()
      : isV6AddressValid();
  };

  const isGatewayIpAddressValid = () => {
    const gatewayIpAddressValueIsValid =
      ipVersion === ADDRESS_TYPE_IPV4 || state.addressType === ADDRESS_TYPE_IPV4
        ? isIpv4NetworkAddressValid(ipv4Namespace.gatewayIpAddress.value)
        : isIpv6NetworkAddressValid(ipv6Namespace.gatewayIpAddress.value);
    return gatewayIpAddressValueIsValid;
  };

  const isNameserverIpAddressValid = () => {
    const nameserverIpAddressValueIsValid =
      ipVersion === ADDRESS_TYPE_IPV4 || state.addressType === ADDRESS_TYPE_IPV4
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

  const isDomainSearchPathValid = () => {
    if (state[ipVersion].domainSearchPath) {
      return state[ipVersion].domainSearchPath.valid;
    }
    // return true since domainSearchPath is optional
    return true;
  };

  const isValid = () => {
    return (
      isIpAddressValid() &&
      isGatewayIpAddressValid() &&
      isNameserverIpAddressValid() &&
      isHostNameValid() &&
      isDomainSearchPathValid()
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
      (state.addressType === ADDRESS_TYPE_IPV4 ||
        ipVersion === ADDRESS_TYPE_IPV4) &&
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
      (state.addressType === ADDRESS_TYPE_IPV6 ||
        ipVersion === ADDRESS_TYPE_IPV4) &&
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

  const isDomainSearchPathComplete = () => {
    if (state[ipVersion].hostName) {
      return (
        typeof state[ipVersion].domainSearchPath === "object" &&
        typeof state[ipVersion].domainSearchPath.value === "string"
      );
    }
    // return true since domainSearchPath is optional
    return true;
  };

  const isComplete = () => {
    return (
      isIpDataComplete() &&
      isGatewayIpAddressComplete() &&
      isNameserverIpAddressComplete() &&
      isHostNameComplete() &&
      isDomainSearchPathComplete()
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

  const gridContentsMarkupRowOne = (
    <div className="network-address_column-left">
      <RadioButtonGroup
        readOnly={paramFileHasBeenModifiedFromState}
        className="network-address_ip-version-group"
        legendText={t("panel.networkAddress.internetProtocolVersionTextLabel", {
          ns: "panels",
        })}
        name="network-address_ip-version-group"
        defaultSelected={state?.addressType ?? ADDRESS_TYPE_IPV4}
        onChange={(selected) => {
          if (paramFileHasBeenModifiedFromState) return;

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
      return (
        <IPv4Panel
          updateFunction={updateFunction}
          state={state}
          readOnly={paramFileHasBeenModifiedFromState}
          requiresDomainSearchName={requiresDomainSearchName}
        />
      );
    } else if (state.addressType && state.addressType === ADDRESS_TYPE_IPV6) {
      return (
        <IPv6Panel
          updateFunction={updateFunction}
          state={state}
          readOnly={paramFileHasBeenModifiedFromState}
          requiresDomainSearchName={requiresDomainSearchName}
        />
      );
    } else if (!state.addressType) {
      return (
        <IPv4Panel
          updateFunction={updateFunction}
          state={state}
          readOnly={paramFileHasBeenModifiedFromState}
          requiresDomainSearchName={requiresDomainSearchName}
        />
      );
    }
    return <></>;
  };

  const parmfileHasBeenModifiedNotificationMarkup = (
    <ActionableNotification
      hideCloseButton
      inline
      lowContrast
      className="intro_parmfile-purge-banner"
      actionButtonLabel={t("btnLabel.Reset", { ns: "common" })}
      aria-label="closes notification"
      kind="info"
      onActionButtonClick={() => {
        resetParamFileTextAreaData(
          globalState,
          globalDispatch,
          downloadParamFileDispatch,
        );
      }}
      onClose={function noRefCheck() {}}
      onCloseButtonClick={function noRefCheck() {}}
      statusIconDescription="notification"
      subtitle={t("panel.parmFileHasBeenModifiedNotificationSubtitle", {
        ns: "common",
      })}
      title={t("modalHeading.discardParamFileModificationsPrompt")}
    />
  );

  return (
    <Layer className="network-address__layer">
      <FlexGrid className="network-address__grid">
        <Row>
          <Column>
            {paramFileHasBeenModifiedFromState &&
              parmfileHasBeenModifiedNotificationMarkup}
          </Column>
        </Row>
        <Row>
          <Column>{gridContentsMarkupRowOne}</Column>
        </Row>
        {getIPVersionSpecificMarkup()}
      </FlexGrid>
    </Layer>
  );
});

NetworkAddress.propTypes = {
  state: PropTypes.shape({
    addressType: PropTypes.string.isRequired,
    ipv4: PropTypes.shape({
      netmask: PropTypes.object.isRequired,
      ipv4Cidr: PropTypes.object.isRequired,
      binary: PropTypes.string.isRequired,
      ipv4Address: PropTypes.object.isRequired,
      gatewayIpAddress: PropTypes.object.isRequired,
      nameserverIpAddress: PropTypes.object.isRequired,
      hostName: PropTypes.object.isRequired,
      domainSearchPath: PropTypes.object.isRequired,
    }),
    ipv6: PropTypes.shape({
      ipv6Cidr: PropTypes.object.isRequired,
      ipv6Address: PropTypes.object.isRequired,
      gatewayIpAddress: PropTypes.object.isRequired,
      nameserverIpAddress: PropTypes.object.isRequired,
      hostName: PropTypes.object.isRequired,
      domainSearchPath: PropTypes.object.isRequired,
    }),
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default NetworkAddress;
