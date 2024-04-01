/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { isIP } from "is-ip";
import { Row, Column, NumberInput, TextInput } from "@carbon/react";
import {
  ADDRESS_TYPE_IPV6,
  UPDATE_FUNCTION__IPV6_ADDRESS,
  UPDATE_FUNCTION__IPV6_PREFIX,
  UPDATE_FUNCTION__IPV6_GATEWAY,
  UPDATE_FUNCTION__IPV6_NAMESERVER,
  UPDATE_FUNCTION__IPV6_HOSTNAME,
  UPDATE_FUNCTION__IPV6_DOMAIN_SEARCH_PATH,
} from "../../../../util/constants";
import {
  isIpv6NetworkAddressValid,
  isCidr,
  isHostnameValid,
  isDomainSearchPathValid,
} from "../../../../util/network-address-util";
import "./_ip-panels.scss";

const IPv6Panel = ({
  updateFunction,
  state,
  readOnly,
  requiresDomainSearchName,
}) => {
  const { t } = useTranslation();

  const PLACEHOLDER_GATEWAY_ADDRESS_IPV6 = t(
    "panel.networkAddress.gatewayAddressPlaceholderIPv6",
    { ns: "panels" },
  );
  const PLACEHOLDER_NAMESERVER_ADDRESS_IPV6 = t(
    "panel.networkAddress.nameserverAddressPlaceholderIPv6",
    { ns: "panels" },
  );

  const gridContentsMarkupRowTwoColumnOneIPv6 = (
    <div className="network-address_column-left">
      <TextInput
        readOnly={readOnly}
        id="network-address_ipv6-input"
        invalid={
          state && state.ipv6 && state.ipv6.ipv6Address
            ? !state.ipv6.ipv6Address.valid
            : false
        }
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={t("panel.networkAddress.networkAddressIPv6TextLabel", {
          ns: "panels",
        })}
        helperText={t("panel.networkAddress.networkAddressIPv6Help", {
          ns: "panels",
        })}
        placeholder={t("panel.networkAddress.networkAddressIPv6Placeholder", {
          ns: "panels",
        })}
        value={
          state.ipv6 && state.ipv6.ipv6Address
            ? state.ipv6.ipv6Address.value
            : ""
        }
        onChange={(localAddress) => {
          if (readOnly) return;

          const localAddressValue =
            localAddress && localAddress.target && localAddress.target.value
              ? localAddress.target.value
              : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV6_ADDRESS,
            propertyValue: localAddressValue,
            propertyIsValid: true,
          });
        }}
        onBlur={(localAddress) => {
          if (readOnly) return;

          const localAddressValue =
            localAddress && localAddress.target && localAddress.target.value
              ? localAddress.target.value
              : "";
          const localAddressValueIsValid =
            isIpv6NetworkAddressValid(localAddressValue);
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV6_ADDRESS,
            propertyValue: localAddressValue,
            propertyIsValid: localAddressValueIsValid,
          });
        }}
      />
      <NumberInput
        allowEmpty
        min={1}
        max={128}
        readOnly={readOnly}
        id="network-address_ipv6-prefix"
        invalid={
          state && state.ipv6 && state.ipv6.ipv6Cidr
            ? !state.ipv6.ipv6Cidr.valid
            : false
        }
        invalidText={t("invalidTextLabel", { ns: "common" })}
        label={t("panel.networkAddress.networkPrefixIPv6TextLabel", {
          ns: "panels",
        })}
        helperText={t("panel.networkAddress.networkPrefixIPv6Help", {
          ns: "panels",
        })}
        placeholder={t("panel.networkAddress.networkPrefixIPv6Placeholder", {
          ns: "panels",
        })}
        value={
          state.ipv6 && state.ipv6.ipv6Cidr ? state.ipv6.ipv6Cidr.value : ""
        }
        translateWithId={(id) => t(id, { ns: "common" })}
        onChange={(event, { value, direction }) => {
          if (readOnly) return;

          const localCidrValue = value || 1;
          const localCidrValueIsValid = isCidr(
            ADDRESS_TYPE_IPV6,
            localCidrValue,
          );

          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV6_PREFIX,
            propertyValue: localCidrValue,
            propertyIsValid: localCidrValueIsValid,
          });
        }}
        onBlur={(localCidr) => {
          if (readOnly) return;

          const localCidrValue =
            localCidr && localCidr.target && localCidr.target.value
              ? localCidr.target.value
              : "";
          const localCidrValueIsValid = isCidr(
            ADDRESS_TYPE_IPV6,
            localCidrValue,
          );

          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV6_PREFIX,
            propertyValue: localCidrValue,
            propertyIsValid: localCidrValueIsValid,
          });
        }}
      />
    </div>
  );

  const gridContentsMarkupRowTwoColumnTwo = (
    <div className="network-address_column-right">
      <TextInput
        readOnly={readOnly}
        id="network-address_gateway-input"
        invalid={
          state && state.ipv6 && state.ipv6.gatewayIpAddress
            ? !state.ipv6.gatewayIpAddress.valid
            : false
        }
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={t("panel.networkAddress.gatewayAddressTextLabel", {
          ns: "panels",
        })}
        helperText={t("panel.networkAddress.gatewayAddressHelp", {
          ns: "panels",
        })}
        placeholder={PLACEHOLDER_GATEWAY_ADDRESS_IPV6}
        value={
          state.ipv6 && state.ipv6.gatewayIpAddress
            ? state.ipv6.gatewayIpAddress.value
            : ""
        }
        onChange={(localGatewayIpAddress) => {
          if (readOnly) return;

          const localGatewayIpAddressValue =
            localGatewayIpAddress &&
            localGatewayIpAddress.target &&
            localGatewayIpAddress.target.value
              ? localGatewayIpAddress.target.value
              : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV6_GATEWAY,
            propertyValue: localGatewayIpAddressValue,
            propertyIsValid: true,
          });
        }}
        onBlur={(localGatewayIpAddress) => {
          if (readOnly) return;

          const localGatewayIpAddressValue =
            localGatewayIpAddress &&
            localGatewayIpAddress.target &&
            localGatewayIpAddress.target.value
              ? localGatewayIpAddress.target.value
              : "";
          const localGatewayIpAddressValueIsValid = isIpv6NetworkAddressValid(
            localGatewayIpAddressValue,
          );
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV6_GATEWAY,
            propertyValue: localGatewayIpAddressValue,
            propertyIsValid: localGatewayIpAddressValueIsValid,
          });
        }}
      />
      <TextInput
        readOnly={readOnly}
        id="network-address_nameserver-input"
        invalid={
          state && state.ipv6 && state.ipv6.nameserverIpAddress
            ? !state.ipv6.nameserverIpAddress.valid
            : false
        }
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={t("panel.networkAddress.nameserverAddressTextLabel", {
          ns: "panels",
        })}
        helperText={t("panel.networkAddress.nameserverAddressHelp", {
          ns: "panels",
        })}
        placeholder={PLACEHOLDER_NAMESERVER_ADDRESS_IPV6}
        value={
          state.ipv6 && state.ipv6.nameserverIpAddress
            ? state.ipv6.nameserverIpAddress.value
            : ""
        }
        onChange={(localNameserverIpAddress) => {
          if (readOnly) return;

          const localNameserverIpAddressValue =
            localNameserverIpAddress &&
            localNameserverIpAddress.target &&
            localNameserverIpAddress.target.value
              ? localNameserverIpAddress.target.value
              : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV6_NAMESERVER,
            propertyValue: localNameserverIpAddressValue,
            propertyIsValid: true,
          });
        }}
        onBlur={(localNameserverIpAddress) => {
          if (readOnly) return;

          const localNameserverIpAddressValue =
            localNameserverIpAddress &&
            localNameserverIpAddress.target &&
            localNameserverIpAddress.target.value
              ? localNameserverIpAddress.target.value
              : "";
          const localNameserverIpAddressValueIsValid =
            isIpv6NetworkAddressValid(localNameserverIpAddressValue);
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV6_NAMESERVER,
            propertyValue: localNameserverIpAddressValue,
            propertyIsValid: localNameserverIpAddressValueIsValid,
          });
        }}
      />
      <TextInput
        readOnly={readOnly}
        id="network-address_hostname-input"
        invalid={
          state && state.ipv6 && state.ipv6.hostName
            ? !state.ipv6.hostName.valid
            : false
        }
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={t("panel.networkAddress.hostnameTextLabel", {
          ns: "panels",
        })}
        helperText={t("panel.networkAddress.hostnameHelp", { ns: "panels" })}
        placeholder={t("panel.networkAddress.hostnamePlaceholder", {
          ns: "panels",
        })}
        value={
          state.ipv6 && state.ipv6.hostName ? state.ipv6.hostName.value : 1
        }
        onChange={(localHostName) => {
          if (readOnly) return;

          const localHostNameValue =
            localHostName && localHostName.target && localHostName.target.value
              ? localHostName.target.value
              : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV6_HOSTNAME,
            propertyValue: localHostNameValue,
            propertyIsValid: true,
          });
        }}
        onBlur={(localHostName) => {
          if (readOnly) return;

          const localHostNameValue =
            localHostName && localHostName.target && localHostName.target.value
              ? localHostName.target.value
              : "";
          const localHostNameValueIsValid =
            isHostnameValid(localHostNameValue) && !isIP(localHostNameValue);
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV6_HOSTNAME,
            propertyValue: localHostNameValue,
            propertyIsValid: localHostNameValueIsValid,
          });
        }}
      />
      {requiresDomainSearchName && (
        <TextInput
          readOnly={readOnly}
          id="network-address_domain-search-path-input"
          invalid={
            state && state.ipv6 && state.ipv6.domainSearchPath
              ? !state.ipv6.domainSearchPath.valid
              : false
          }
          invalidText={t("invalidTextLabel", { ns: "common" })}
          labelText={t("panel.networkAddress.domainSearchPathTextLabel", {
            ns: "panels",
          })}
          helperText={t("panel.networkAddress.domainSearchPathHelp", {
            ns: "panels",
          })}
          placeholder={t("panel.networkAddress.domainSearchPathPlaceholder", {
            ns: "panels",
          })}
          value={
            state.ipv6 && state.ipv6.domainSearchPath
              ? state.ipv6.domainSearchPath.value
              : ""
          }
          onChange={(localDomainSearchPath) => {
            if (readOnly) return;

            const localDomainSearchPathValue =
              localDomainSearchPath &&
              localDomainSearchPath.target &&
              localDomainSearchPath.target.value
                ? localDomainSearchPath.target.value
                : "";
            // while editing we don't update the validity but set it to true
            // cause we don't want to have the form validation logic kick in.
            updateFunction({
              propertyName: UPDATE_FUNCTION__IPV6_DOMAIN_SEARCH_PATH,
              propertyValue: localDomainSearchPathValue,
              propertyIsValid: true,
            });
          }}
          onBlur={(localDomainSearchPath) => {
            if (readOnly) return;

            const localDomainSearchPathValue =
              localDomainSearchPath &&
              localDomainSearchPath.target &&
              localDomainSearchPath.target.value
                ? localDomainSearchPath.target.value
                : "";
            const localDomainSearchPathValueIsValid =
              isDomainSearchPathValid(localDomainSearchPathValue) &&
              !isIP(localDomainSearchPathValue);
            updateFunction({
              propertyName: UPDATE_FUNCTION__IPV6_DOMAIN_SEARCH_PATH,
              propertyValue: localDomainSearchPathValue,
              propertyIsValid: localDomainSearchPathValueIsValid,
            });
          }}
        />
      )}
    </div>
  );

  return (
    <Row>
      <Column>{gridContentsMarkupRowTwoColumnOneIPv6}</Column>
      <Column>{gridContentsMarkupRowTwoColumnTwo}</Column>
    </Row>
  );
};

IPv6Panel.propTypes = {
  updateFunction: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  readOnly: PropTypes.bool.isRequired,
  requiresDomainSearchName: PropTypes.bool.isRequired,
};

export default IPv6Panel;
