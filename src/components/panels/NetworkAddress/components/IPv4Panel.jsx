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
  ADDRESS_TYPE_IPV4,
  UPDATE_FUNCTION__IPV4_ADDRESS,
  UPDATE_FUNCTION__IPV4_PREFIX,
  UPDATE_FUNCTION__IPV4_NETMASK,
  UPDATE_FUNCTION__IPV4_BINARY,
  UPDATE_FUNCTION__IPV4_GATEWAY,
  UPDATE_FUNCTION__IPV4_NAMESERVER,
  UPDATE_FUNCTION__IPV4_HOSTNAME,
} from "../../../../util/constants";
import {
  isIpv4NetworkAddressValid,
  cidrToNetmask,
  isCidr,
  netmaskToBinary,
  netmaskToCidr,
  isHostnameValid,
} from "../../../../util/network-address-util";
import { getLabel, getContent } from "../../../../uiUtil/help-util";
import "./_ip-panels.scss";

const IPv4Panel = ({ updateFunction, state }) => {
  const { t } = useTranslation();

  const PLACEHOLDER_GATEWAY_ADDRESS_IPV4 = t(
    "panel.networkAddress.gatewayAddressPlaceholderIPv4",
    { ns: "panels" },
  );
  const PLACEHOLDER_NAMESERVER_ADDRESS_IPV4 = t(
    "panel.networkAddress.nameserverAddressPlaceholderIPv4",
    { ns: "panels" },
  );

  const gridContentsMarkupRowTwoColumnOneIPv4 = (
    <div className="network-address_column-left">
      <TextInput
        id="network-address_ipv4-input"
        invalidText={t("invalidTextLabel", { ns: "common" })}
        invalid={
          state && state.ipv4 && state.ipv4.ipv4Address
            ? !state.ipv4.ipv4Address.valid
            : false
        }
        labelText={getLabel(
          t("panel.networkAddress.networkAddressIPv4TextLabel", {
            ns: "panels",
          }),
          t("showInformationLabel", { ns: "common" }),
          getContent(
            t("panel.networkAddress.networkAddressIPv4Help", {
              ns: "panels",
            }),
          ),
        )}
        placeholder={t("panel.networkAddress.networkAddressIPv4Placeholder", {
          ns: "panels",
        })}
        value={
          state.ipv4 && state.ipv4.ipv4Address
            ? state.ipv4.ipv4Address.value
            : ""
        }
        onChange={(localAddress) => {
          const localAddressValue =
            localAddress && localAddress.target && localAddress.target.value
              ? localAddress.target.value
              : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV4_ADDRESS,
            propertyValue: localAddressValue,
            propertyIsValid: true,
          });
        }}
        onBlur={(localAddress) => {
          const localAddressValue =
            localAddress && localAddress.target && localAddress.target.value
              ? localAddress.target.value
              : "";
          const localAddressValueIsValid =
            isIpv4NetworkAddressValid(localAddressValue);
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV4_ADDRESS,
            propertyValue: localAddressValue,
            propertyIsValid: localAddressValueIsValid,
          });
        }}
      />
      <NumberInput
        allowEmpty
        min={1}
        max={32}
        id="network-address_ipv4-prefix"
        invalid={
          state && state.ipv4 && state.ipv4.ipv4Cidr
            ? !state.ipv4.ipv4Cidr.valid
            : false
        }
        invalidText={t("invalidTextLabel", { ns: "common" })}
        label={getLabel(
          state &&
            state.ipv4 &&
            state.ipv4.ipv4Cidr &&
            state.ipv4.ipv4Cidr.computed
            ? t("panel.networkAddress.networkPrefixIPv4TextLabelComputed", {
                ns: "panels",
              })
            : t("panel.networkAddress.networkPrefixIPv4TextLabel", {
                ns: "panels",
              }),
          t("showInformationLabel", { ns: "common" }),
          getContent(
            t("panel.networkAddress.networkPrefixIPv4Help", { ns: "panels" }),
          ),
        )}
        placeholder={t("panel.networkAddress.networkPrefixIPv4Placeholder", {
          ns: "panels",
        })}
        value={
          state.ipv4 && state.ipv4.ipv4Cidr ? state.ipv4.ipv4Cidr.value : 1
        }
        translateWithId={(id) => t(id, { ns: "common" })}
        onChange={(event, { value, direction }) => {
          const localCidrValue = value || 1;
          const parsed = cidrToNetmask(localCidrValue);
          const localCidrValueIsValid = isCidr(
            ADDRESS_TYPE_IPV4,
            localCidrValue,
          );

          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV4_PREFIX,
            propertyValue: localCidrValue,
            propertyIsValid: localCidrValueIsValid,
            propertyIsComputed: false,
          });

          if (localCidrValueIsValid && parsed) {
            updateFunction({
              propertyName: UPDATE_FUNCTION__IPV4_NETMASK,
              propertyValue: parsed,
              propertyIsValid: true,
              propertyIsComputed: true,
            });
            updateFunction({
              propertyName: UPDATE_FUNCTION__IPV4_BINARY,
              propertyValue: netmaskToBinary(parsed),
            });
          }
        }}
        onBlur={(localCidr) => {
          const localCidrValue =
            localCidr && localCidr.target && localCidr.target.value
              ? localCidr.target.value
              : "";
          const parsed = cidrToNetmask(localCidrValue);
          const localCidrValueIsValid = isCidr(
            ADDRESS_TYPE_IPV4,
            localCidrValue,
          );

          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV4_PREFIX,
            propertyValue: localCidrValue,
            propertyIsValid: localCidrValueIsValid,
            propertyIsComputed: false,
          });

          if (localCidrValueIsValid && parsed) {
            updateFunction({
              propertyName: UPDATE_FUNCTION__IPV4_NETMASK,
              propertyValue: parsed,
              propertyIsValid: true,
              propertyIsComputed: true,
            });
            updateFunction({
              propertyName: UPDATE_FUNCTION__IPV4_BINARY,
              propertyValue: netmaskToBinary(parsed),
            });
          }
        }}
      />
      <TextInput
        id="network-address_ipv4-netmask"
        invalid={
          state && state.ipv4 && state.ipv4.netmask
            ? !state.ipv4.netmask.valid
            : false
        }
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={getLabel(
          state &&
            state.ipv4 &&
            state.ipv4.netmask &&
            state.ipv4.netmask.computed
            ? t("panel.networkAddress.netmaskIPv4TextLabelComputed", {
                ns: "panels",
              })
            : t("panel.networkAddress.netmaskIPv4TextLabel", {
                ns: "panels",
              }),
          t("showInformationLabel", { ns: "common" }),
          getContent(
            t("panel.networkAddress.netmaskIPv4Help", { ns: "panels" }),
          ),
        )}
        placeholder={t("panel.networkAddress.netmaskIPv4Placeholder", {
          ns: "panels",
        })}
        value={state.ipv4 && state.ipv4.netmask ? state.ipv4.netmask.value : ""}
        onChange={(localNetmask) => {
          const localNetmaskValue =
            localNetmask && localNetmask.target && localNetmask.target.value
              ? localNetmask.target.value
              : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV4_NETMASK,
            propertyValue: localNetmaskValue,
            propertyIsValid: true,
            propertyIsComputed: false,
          });
        }}
        onBlur={(localNetmask) => {
          const localNetmaskValue =
            localNetmask && localNetmask.target && localNetmask.target.value
              ? localNetmask.target.value
              : "";
          const parsed = netmaskToCidr(localNetmaskValue);
          const localNetmaskValueIsValid =
            isIpv4NetworkAddressValid(localNetmaskValue);

          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV4_NETMASK,
            propertyValue: localNetmaskValue,
            propertyIsValid: localNetmaskValueIsValid,
            propertyIsComputed: false,
          });

          if (localNetmaskValueIsValid && parsed) {
            updateFunction({
              propertyName: UPDATE_FUNCTION__IPV4_PREFIX,
              propertyValue: parsed,
              propertyIsValid: true,
              propertyIsComputed: true,
            });
            updateFunction({
              propertyName: UPDATE_FUNCTION__IPV4_BINARY,
              propertyValue: netmaskToBinary(localNetmaskValue),
            });
          }
        }}
      />
      <TextInput
        readOnly
        id="network-address_ipv4-binary"
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={t("panel.networkAddress.networkAddressBinaryIPv4TextLabel", {
          ns: "panels",
        })}
        placeholder={t(
          "panel.networkAddress.networkAddressBinaryIPv4Placeholder",
          { ns: "panels" },
        )}
        value={state?.ipv4?.binary ?? ""}
      />
    </div>
  );

  const gridContentsMarkupRowTwoColumnTwo = (
    <div className="network-address_column-right">
      <TextInput
        id="network-address_gateway-input"
        invalid={
          state && state.ipv4 && state.ipv4.gatewayIpAddress
            ? !state.ipv4.gatewayIpAddress.valid
            : false
        }
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={getLabel(
          t("panel.networkAddress.gatewayAddressTextLabel", { ns: "panels" }),
          t("showInformationLabel", { ns: "common" }),
          getContent(
            t("panel.networkAddress.gatewayAddressHelp", { ns: "panels" }),
          ),
        )}
        placeholder={PLACEHOLDER_GATEWAY_ADDRESS_IPV4}
        value={
          state.ipv4 && state.ipv4.gatewayIpAddress
            ? state.ipv4.gatewayIpAddress.value
            : ""
        }
        onChange={(localGatewayIpAddress) => {
          const localGatewayIpAddressValue =
            localGatewayIpAddress &&
            localGatewayIpAddress.target &&
            localGatewayIpAddress.target.value
              ? localGatewayIpAddress.target.value
              : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV4_GATEWAY,
            propertyValue: localGatewayIpAddressValue,
            propertyIsValid: true,
          });
        }}
        onBlur={(localGatewayIpAddress) => {
          const localGatewayIpAddressValue =
            localGatewayIpAddress &&
            localGatewayIpAddress.target &&
            localGatewayIpAddress.target.value
              ? localGatewayIpAddress.target.value
              : "";
          const localGatewayIpAddressValueIsValid = isIpv4NetworkAddressValid(
            localGatewayIpAddressValue,
          );
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV4_GATEWAY,
            propertyValue: localGatewayIpAddressValue,
            propertyIsValid: localGatewayIpAddressValueIsValid,
          });
        }}
      />
      <TextInput
        id="network-address_nameserver-input"
        invalid={
          state && state.ipv4 && state.ipv4.nameserverIpAddress
            ? !state.ipv4.nameserverIpAddress.valid
            : false
        }
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={getLabel(
          t("panel.networkAddress.nameserverAddressTextLabel", {
            ns: "panels",
          }),
          t("showInformationLabel", { ns: "common" }),
          getContent(
            t("panel.networkAddress.nameserverAddressHelp", { ns: "panels" }),
          ),
        )}
        placeholder={PLACEHOLDER_NAMESERVER_ADDRESS_IPV4}
        value={
          state.ipv4 && state.ipv4.nameserverIpAddress
            ? state.ipv4.nameserverIpAddress.value
            : ""
        }
        onChange={(localNameserverIpAddress) => {
          const localNameserverIpAddressValue =
            localNameserverIpAddress &&
            localNameserverIpAddress.target &&
            localNameserverIpAddress.target.value
              ? localNameserverIpAddress.target.value
              : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV4_NAMESERVER,
            propertyValue: localNameserverIpAddressValue,
            propertyIsValid: true,
          });
        }}
        onBlur={(localNameserverIpAddress) => {
          const localNameserverIpAddressValue =
            localNameserverIpAddress &&
            localNameserverIpAddress.target &&
            localNameserverIpAddress.target.value
              ? localNameserverIpAddress.target.value
              : "";
          const localNameserverIpAddressValueIsValid =
            isIpv4NetworkAddressValid(localNameserverIpAddressValue);
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV4_NAMESERVER,
            propertyValue: localNameserverIpAddressValue,
            propertyIsValid: localNameserverIpAddressValueIsValid,
          });
        }}
      />
      <TextInput
        id="network-address_hostname-input"
        invalid={
          state && state.ipv4 && state.ipv4.hostName
            ? !state.ipv4.hostName.valid
            : false
        }
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={getLabel(
          t("panel.networkAddress.hostnameTextLabel", { ns: "panels" }),
          t("showInformationLabel", { ns: "common" }),
          getContent(t("panel.networkAddress.hostnameHelp", { ns: "panels" })),
        )}
        placeholder={t("panel.networkAddress.hostnamePlaceholder", {
          ns: "panels",
        })}
        value={
          state.ipv4 && state.ipv4.hostName ? state.ipv4.hostName.value : ""
        }
        onChange={(localHostName) => {
          const localHostNameValue =
            localHostName && localHostName.target && localHostName.target.value
              ? localHostName.target.value
              : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV4_HOSTNAME,
            propertyValue: localHostNameValue,
            propertyIsValid: true,
          });
        }}
        onBlur={(localHostName) => {
          const localHostNameValue =
            localHostName && localHostName.target && localHostName.target.value
              ? localHostName.target.value
              : "";
          const localHostNameValueIsValid =
            isHostnameValid(localHostNameValue) && !isIP(localHostNameValue);
          updateFunction({
            propertyName: UPDATE_FUNCTION__IPV4_HOSTNAME,
            propertyValue: localHostNameValue,
            propertyIsValid: localHostNameValueIsValid,
          });
        }}
      />
    </div>
  );

  return (
    <Row>
      <Column>{gridContentsMarkupRowTwoColumnOneIPv4}</Column>
      <Column>{gridContentsMarkupRowTwoColumnTwo}</Column>
    </Row>
  );
};

IPv4Panel.propTypes = {
  updateFunction: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
};

export default IPv4Panel;
