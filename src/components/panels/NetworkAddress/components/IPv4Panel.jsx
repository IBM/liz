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
    UPDATE_FUNCTION__IPV4_DOMAIN_SEARCH_PATH,
} from "../../../../util/constants";
import {
    isIpv4NetworkAddressValid,
    cidrToNetmask,
    isCidr,
    netmaskToBinary,
    netmaskToCidr,
    isHostnameValid,
    isDomainSearchPathValid,
} from "../../../../util/network-address-util";
import "./_ip-panels.scss";

const IPv4Panel = ({
    updateFunction,
    state,
    readOnly,
    requiresDomainSearchName,
}) => {
    const { t } = useTranslation();

    const PLACEHOLDER_GATEWAY_ADDRESS_IPV4 = t(
        "panel.networkAddress.gatewayAddressPlaceholderIPv4",
        { ns: "panels" }
    );
    const PLACEHOLDER_NAMESERVER_ADDRESS_IPV4 = t(
        "panel.networkAddress.nameserverAddressPlaceholderIPv4",
        { ns: "panels" }
    );

    const gridContentsMarkupRowTwoColumnOneIPv4 = (
        <div className="network-address_column-left">
            <TextInput
                readOnly={readOnly}
                id="network-address_ipv4-input"
                key="network-address_ipv4-input"
                invalidText={t("invalidTextLabel", { ns: "common" })}
                invalid={
                    state && state.ipv4 && state.ipv4.ipv4Address
                        ? !state.ipv4.ipv4Address.valid
                        : false
                }
                maxLength={24}
                labelText={t(
                    "panel.networkAddress.networkAddressIPv4TextLabel",
                    {
                        ns: "panels",
                    }
                )}
                helperText={t("panel.networkAddress.networkAddressIPv4Help", {
                    ns: "panels",
                })}
                placeholder={t(
                    "panel.networkAddress.networkAddressIPv4Placeholder",
                    {
                        ns: "panels",
                    }
                )}
                value={
                    state.ipv4 && state.ipv4.ipv4Address
                        ? state.ipv4.ipv4Address.value
                        : ""
                }
                onChange={(localAddress) => {
                    if (readOnly) return;

                    const localAddressValue =
                        localAddress &&
                        localAddress.target &&
                        localAddress.target.value
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
                    if (readOnly) return;

                    const localAddressValue =
                        localAddress &&
                        localAddress.target &&
                        localAddress.target.value
                            ? localAddress.target.value
                            : "";
                    const localAddressValueIsValid =
                        isIpv4NetworkAddressValid(localAddressValue);

                    if (!localAddressValueIsValid) {
                        updateFunction({
                            propertyName: UPDATE_FUNCTION__IPV4_ADDRESS,
                            propertyValue: localAddressValue,
                            propertyIsValid: localAddressValueIsValid,
                        });
                    }

                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para3"
                        )
                        ?.classList?.remove(
                            "help-panel__network-address__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para4"
                        )
                        ?.classList?.remove(
                            "help-panel__network-address__content__active"
                        );
                }}
                onFocus={() => {
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para3"
                        )
                        ?.classList?.add(
                            "help-panel__network-address__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para4"
                        )
                        ?.classList?.add(
                            "help-panel__network-address__content__active"
                        );
                }}
            />
            <NumberInput
                allowEmpty
                min={1}
                max={32}
                readOnly={readOnly}
                id="network-address_ipv4-prefix"
                key="network-address_ipv4-prefix"
                invalid={
                    state && state.ipv4 && state.ipv4.ipv4Cidr
                        ? !state.ipv4.ipv4Cidr.valid
                        : false
                }
                invalidText={t("invalidTextLabel", { ns: "common" })}
                label={
                    state &&
                    state.ipv4 &&
                    state.ipv4.ipv4Cidr &&
                    state.ipv4.ipv4Cidr.computed
                        ? t(
                              "panel.networkAddress.networkPrefixIPv4TextLabelComputed",
                              {
                                  ns: "panels",
                              }
                          )
                        : t("panel.networkAddress.networkPrefixIPv4TextLabel", {
                              ns: "panels",
                          })
                }
                helperText={t("panel.networkAddress.networkPrefixIPv4Help", {
                    ns: "panels",
                })}
                placeholder={t(
                    "panel.networkAddress.networkPrefixIPv4Placeholder",
                    {
                        ns: "panels",
                    }
                )}
                value={
                    state.ipv4 && state.ipv4.ipv4Cidr
                        ? state.ipv4.ipv4Cidr.value
                        : 1
                }
                translateWithId={(id) => t(id, { ns: "common" })}
                onChange={(event, { value, direction }) => {
                    if (readOnly) return;

                    const localCidrValue = value || 1;
                    const parsed = cidrToNetmask(localCidrValue);
                    const localCidrValueIsValid = isCidr(
                        ADDRESS_TYPE_IPV4,
                        localCidrValue
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
                    if (readOnly) return;

                    const localCidrValue =
                        localCidr && localCidr.target && localCidr.target.value
                            ? localCidr.target.value
                            : "";
                    const parsed = cidrToNetmask(localCidrValue);
                    const localCidrValueIsValid = isCidr(
                        ADDRESS_TYPE_IPV4,
                        localCidrValue
                    );

                    if (!localCidrValueIsValid) {
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
                    }

                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para3"
                        )
                        ?.classList?.remove(
                            "help-panel__network-address__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para4"
                        )
                        ?.classList?.remove(
                            "help-panel__network-address__content__active"
                        );
                }}
                onFocus={() => {
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para3"
                        )
                        ?.classList?.add(
                            "help-panel__network-address__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para4"
                        )
                        ?.classList?.add(
                            "help-panel__network-address__content__active"
                        );
                }}
            />
            <TextInput
                readOnly={readOnly}
                id="network-address_ipv4-netmask"
                key="network-address_ipv4-netmask"
                invalid={
                    state && state.ipv4 && state.ipv4.netmask
                        ? !state.ipv4.netmask.valid
                        : false
                }
                invalidText={t("invalidTextLabel", { ns: "common" })}
                maxLength={24}
                labelText={
                    state &&
                    state.ipv4 &&
                    state.ipv4.netmask &&
                    state.ipv4.netmask.computed
                        ? t(
                              "panel.networkAddress.netmaskIPv4TextLabelComputed",
                              {
                                  ns: "panels",
                              }
                          )
                        : t("panel.networkAddress.netmaskIPv4TextLabel", {
                              ns: "panels",
                          })
                }
                helperText={t("panel.networkAddress.netmaskIPv4Help", {
                    ns: "panels",
                })}
                placeholder={t("panel.networkAddress.netmaskIPv4Placeholder", {
                    ns: "panels",
                })}
                value={
                    state.ipv4 && state.ipv4.netmask
                        ? state.ipv4.netmask.value
                        : ""
                }
                onChange={(localNetmask) => {
                    if (readOnly) return;

                    const localNetmaskValue =
                        localNetmask &&
                        localNetmask.target &&
                        localNetmask.target.value
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
                    if (readOnly) return;

                    const localNetmaskValue =
                        localNetmask &&
                        localNetmask.target &&
                        localNetmask.target.value
                            ? localNetmask.target.value
                            : "";
                    const parsed = netmaskToCidr(localNetmaskValue);
                    const localNetmaskValueIsValid =
                        isIpv4NetworkAddressValid(localNetmaskValue);

                    if (localNetmaskValueIsValid) {
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
                                propertyValue:
                                    netmaskToBinary(localNetmaskValue),
                            });
                        }
                    }

                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para3"
                        )
                        ?.classList?.remove(
                            "help-panel__network-address__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para4"
                        )
                        ?.classList?.remove(
                            "help-panel__network-address__content__active"
                        );
                }}
                onFocus={() => {
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para3"
                        )
                        ?.classList?.add(
                            "help-panel__network-address__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para4"
                        )
                        ?.classList?.add(
                            "help-panel__network-address__content__active"
                        );
                }}
            />
            <TextInput
                readOnly
                id="network-address_ipv4-binary"
                key="network-address_ipv4-binary"
                invalidText={t("invalidTextLabel", { ns: "common" })}
                labelText={t(
                    "panel.networkAddress.networkAddressBinaryIPv4TextLabel",
                    {
                        ns: "panels",
                    }
                )}
                placeholder={t(
                    "panel.networkAddress.networkAddressBinaryIPv4Placeholder",
                    { ns: "panels" }
                )}
                value={state?.ipv4?.binary ?? ""}
            />
        </div>
    );

    const gridContentsMarkupRowTwoColumnTwo = (
        <div className="network-address_column-right">
            <TextInput
                readOnly={readOnly}
                id="network-address_gateway-input"
                key="network-address_gateway-input"
                invalid={
                    state && state.ipv4 && state.ipv4.gatewayIpAddress
                        ? !state.ipv4.gatewayIpAddress.valid
                        : false
                }
                invalidText={t("invalidTextLabel", { ns: "common" })}
                maxLength={24}
                labelText={t("panel.networkAddress.gatewayAddressTextLabel", {
                    ns: "panels",
                })}
                helperText={t("panel.networkAddress.gatewayAddressHelp", {
                    ns: "panels",
                })}
                placeholder={PLACEHOLDER_GATEWAY_ADDRESS_IPV4}
                value={
                    state.ipv4 && state.ipv4.gatewayIpAddress
                        ? state.ipv4.gatewayIpAddress.value
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
                        propertyName: UPDATE_FUNCTION__IPV4_GATEWAY,
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
                    const localGatewayIpAddressValueIsValid =
                        isIpv4NetworkAddressValid(localGatewayIpAddressValue);

                    if (!localGatewayIpAddressValueIsValid) {
                        updateFunction({
                            propertyName: UPDATE_FUNCTION__IPV4_GATEWAY,
                            propertyValue: localGatewayIpAddressValue,
                            propertyIsValid: localGatewayIpAddressValueIsValid,
                        });
                    }

                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para3"
                        )
                        ?.classList?.remove(
                            "help-panel__network-address__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para4"
                        )
                        ?.classList?.remove(
                            "help-panel__network-address__content__active"
                        );
                }}
                onFocus={() => {
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para3"
                        )
                        ?.classList?.add(
                            "help-panel__network-address__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para4"
                        )
                        ?.classList?.add(
                            "help-panel__network-address__content__active"
                        );
                }}
            />
            <TextInput
                readOnly={readOnly}
                id="network-address_nameserver-input"
                key="network-address_nameserver-input"
                invalid={
                    state && state.ipv4 && state.ipv4.nameserverIpAddress
                        ? !state.ipv4.nameserverIpAddress.valid
                        : false
                }
                invalidText={t("invalidTextLabel", { ns: "common" })}
                maxLength={24}
                labelText={t(
                    "panel.networkAddress.nameserverAddressTextLabel",
                    {
                        ns: "panels",
                    }
                )}
                helperText={t("panel.networkAddress.nameserverAddressHelp", {
                    ns: "panels",
                })}
                placeholder={PLACEHOLDER_NAMESERVER_ADDRESS_IPV4}
                value={
                    state.ipv4 && state.ipv4.nameserverIpAddress
                        ? state.ipv4.nameserverIpAddress.value
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
                        propertyName: UPDATE_FUNCTION__IPV4_NAMESERVER,
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
                        isIpv4NetworkAddressValid(
                            localNameserverIpAddressValue
                        );

                    if (!localNameserverIpAddressValueIsValid) {
                        updateFunction({
                            propertyName: UPDATE_FUNCTION__IPV4_NAMESERVER,
                            propertyValue: localNameserverIpAddressValue,
                            propertyIsValid:
                                localNameserverIpAddressValueIsValid,
                        });
                    }

                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para3"
                        )
                        ?.classList?.remove(
                            "help-panel__network-address__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para4"
                        )
                        ?.classList?.remove(
                            "help-panel__network-address__content__active"
                        );
                }}
                onFocus={() => {
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para3"
                        )
                        ?.classList?.add(
                            "help-panel__network-address__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para4"
                        )
                        ?.classList?.add(
                            "help-panel__network-address__content__active"
                        );
                }}
            />
            <TextInput
                readOnly={readOnly}
                id="network-address_hostname-input"
                key="network-address_hostname-input"
                invalid={
                    state && state.ipv4 && state.ipv4.hostName
                        ? !state.ipv4.hostName.valid
                        : false
                }
                invalidText={t("invalidTextLabel", { ns: "common" })}
                maxLength={128}
                labelText={t("panel.networkAddress.hostnameTextLabel", {
                    ns: "panels",
                })}
                helperText={t("panel.networkAddress.hostnameHelp", {
                    ns: "panels",
                })}
                placeholder={t("panel.networkAddress.hostnamePlaceholder", {
                    ns: "panels",
                })}
                value={
                    state.ipv4 && state.ipv4.hostName
                        ? state.ipv4.hostName.value
                        : ""
                }
                onChange={(localHostName) => {
                    if (readOnly) return;

                    const localHostNameValue =
                        localHostName &&
                        localHostName.target &&
                        localHostName.target.value
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
                    if (readOnly) return;

                    const localHostNameValue =
                        localHostName &&
                        localHostName.target &&
                        localHostName.target.value
                            ? localHostName.target.value
                            : "";
                    const localHostNameValueIsValid =
                        isHostnameValid(localHostNameValue) &&
                        !isIP(localHostNameValue);

                    if (!localHostNameValueIsValid) {
                        updateFunction({
                            propertyName: UPDATE_FUNCTION__IPV4_HOSTNAME,
                            propertyValue: localHostNameValue,
                            propertyIsValid: localHostNameValueIsValid,
                        });
                    }

                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para3"
                        )
                        ?.classList?.remove(
                            "help-panel__network-address__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para4"
                        )
                        ?.classList?.remove(
                            "help-panel__network-address__content__active"
                        );
                }}
                onFocus={() => {
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para3"
                        )
                        ?.classList?.add(
                            "help-panel__network-address__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_networkAddress_para4"
                        )
                        ?.classList?.add(
                            "help-panel__network-address__content__active"
                        );
                }}
            />
            {requiresDomainSearchName && (
                <TextInput
                    readOnly={readOnly}
                    id="network-address_domain-search-path-input"
                    key="network-address_domain-search-path-input"
                    invalid={
                        state && state.ipv4 && state.ipv4.domainSearchPath
                            ? !state.ipv4.domainSearchPath.valid
                            : false
                    }
                    invalidText={t("invalidTextLabel", { ns: "common" })}
                    maxLength={128}
                    labelText={t(
                        "panel.networkAddress.domainSearchPathTextLabel",
                        {
                            ns: "panels",
                        }
                    )}
                    helperText={t("panel.networkAddress.domainSearchPathHelp", {
                        ns: "panels",
                    })}
                    placeholder={t(
                        "panel.networkAddress.domainSearchPathPlaceholder",
                        {
                            ns: "panels",
                        }
                    )}
                    value={
                        state.ipv4 && state.ipv4.domainSearchPath
                            ? state.ipv4.domainSearchPath.value
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
                            propertyName:
                                UPDATE_FUNCTION__IPV4_DOMAIN_SEARCH_PATH,
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
                            isDomainSearchPathValid(
                                localDomainSearchPathValue
                            ) && !isIP(localDomainSearchPathValue);

                        if (!localDomainSearchPathValueIsValid) {
                            updateFunction({
                                propertyName:
                                    UPDATE_FUNCTION__IPV4_DOMAIN_SEARCH_PATH,
                                propertyValue: localDomainSearchPathValue,
                                propertyIsValid:
                                    localDomainSearchPathValueIsValid,
                            });
                        }

                        document
                            .getElementById(
                                "helpPanelContents_networkAddress_para3"
                            )
                            ?.classList?.remove(
                                "help-panel__network-address__content__active"
                            );
                        document
                            .getElementById(
                                "helpPanelContents_networkAddress_para4"
                            )
                            ?.classList?.remove(
                                "help-panel__network-address__content__active"
                            );
                    }}
                    onFocus={() => {
                        document
                            .getElementById(
                                "helpPanelContents_networkAddress_para3"
                            )
                            ?.classList?.add(
                                "help-panel__network-address__content__active"
                            );
                        document
                            .getElementById(
                                "helpPanelContents_networkAddress_para4"
                            )
                            ?.classList?.add(
                                "help-panel__network-address__content__active"
                            );
                    }}
                />
            )}
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
    readOnly: PropTypes.bool.isRequired,
    requiresDomainSearchName: PropTypes.bool.isRequired,
};

export default IPv4Panel;
