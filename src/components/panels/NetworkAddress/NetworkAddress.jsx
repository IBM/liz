/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
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
  SLES_DISTRIBUTION_ID,
  UBUNTU_DISTRIBUTION_ID,
  DEFAULT_DISTRIBUTION_ID,
} from "../../../util/constants";
import {
  LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
} from "../../../util/local-storage-constants";
import {
  ApplicationContext,
  NetworkAddressContext,
  DownloadParamFileContext,
} from "../../../contexts";
import { updateIsDisabled as updateIsDisabledFromUtils } from "../../../util/panel-util";
import {
  isIpv4NetworkAddressValid,
  isIpv6NetworkAddressValid,
} from "../../../util/network-address-util";
import { resetParamFileTextAreaData } from "../../../uiUtil/panel-util";
import { IPv4Panel, IPv6Panel } from "./components";
import "./_network-address.scss";

const NetworkAddress = forwardRef(function NetworkAddress(props, ref) {
  const {
    state: globalState,
    updateModified: globalUpdateModified,
    updateNextStep,
    updateIsDirty,
    updateIsDisabled,
  } = React.useContext(ApplicationContext);
  const { updateModified, updateParamFileContent } = React.useContext(
    DownloadParamFileContext,
  );
  const {
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
  } = React.useContext(NetworkAddressContext);
  const { t } = useTranslation();
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

        updateNextStep(mergedSteps.steps);
        updateIsDirty(true);
        updateIsDisabled(updateIsDisabledFromUtils(mergedSteps.steps));
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
      updateIpv4Address({
        value: propertyValue,
        valid: propertyIsValid,
      });
    } else if (propertyName === UPDATE_FUNCTION__IPV4_PREFIX) {
      updateIpv4Cidr({
        value: propertyValue,
        valid: propertyIsValid,
        computed: propertyIsComputed,
      });
    } else if (propertyName === UPDATE_FUNCTION__IPV4_NETMASK) {
      updateNetmask({
        value: propertyValue,
        valid: propertyIsValid,
        computed: propertyIsComputed,
      });
    } else if (propertyName === UPDATE_FUNCTION__IPV4_BINARY) {
      updateBinary(propertyValue);
    } else if (propertyName === UPDATE_FUNCTION__IPV4_GATEWAY) {
      updateGatewayAddress({
        value: propertyValue,
        valid: propertyIsValid,
      });
    } else if (propertyName === UPDATE_FUNCTION__IPV4_NAMESERVER) {
      updateNameserverAddress({
        value: propertyValue,
        valid: propertyIsValid,
      });
    } else if (propertyName === UPDATE_FUNCTION__IPV4_HOSTNAME) {
      updateHostName({
        value: propertyValue,
        valid: propertyIsValid,
      });
    } else if (propertyName === UPDATE_FUNCTION__IPV4_DOMAIN_SEARCH_PATH) {
      updateDomainSearchPath({
        value: propertyValue,
        valid: propertyIsValid,
      });
    } else if (propertyName === UPDATE_FUNCTION__IPV6_ADDRESS) {
      updateIpv6Address({
        value: propertyValue,
        valid: propertyIsValid,
      });
    } else if (propertyName === UPDATE_FUNCTION__IPV6_PREFIX) {
      updateIpv6Cidr({
        value: propertyValue,
        valid: propertyIsValid,
      });
    } else if (propertyName === UPDATE_FUNCTION__IPV6_GATEWAY) {
      updateGatewayAddress({
        value: propertyValue,
        propertyIsValid,
      });
    } else if (propertyName === UPDATE_FUNCTION__IPV6_NAMESERVER) {
      updateNameserverAddress({
        value: propertyValue,
        valid: propertyIsValid,
      });
    } else if (propertyName === UPDATE_FUNCTION__IPV6_HOSTNAME) {
      updateHostName({
        value: propertyValue,
        valid: propertyIsValid,
      });
    } else if (propertyName === UPDATE_FUNCTION__IPV6_DOMAIN_SEARCH_PATH) {
      updateDomainSearchPath({
        value: propertyValue,
        valid: propertyIsValid,
      });
    } else if (UPDATE_FUNCTION__UNKNOWN) {
      console.log("Unknown property name passed to update proxy function.");
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
        resetParamFileTextAreaData({
          updateParamFileContent,
          globalUpdateModified,
          updateModified,
          state: globalState,
        });
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

export default NetworkAddress;
