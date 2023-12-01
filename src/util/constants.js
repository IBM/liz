/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

const ADDRESS_TYPE_IPV4 = "radio-ipv4";
const ADDRESS_TYPE_IPV6 = "radio-ipv6";

const UPDATE_FUNCTION__UNKNOWN = "unknown";

const UPDATE_FUNCTION__IPV4_ADDRESS = "ipv4-address";
const UPDATE_FUNCTION__IPV4_PREFIX = "ipv4-prefix";
const UPDATE_FUNCTION__IPV4_NETMASK = "ipv4-netmask";
const UPDATE_FUNCTION__IPV4_BINARY = "ipv4-binary";
const UPDATE_FUNCTION__IPV4_GATEWAY = "ipv4-gateway";
const UPDATE_FUNCTION__IPV4_NAMESERVER = "ipv4-nameserver";
const UPDATE_FUNCTION__IPV4_HOSTNAME = "ipv4-hostname";

const UPDATE_FUNCTION__IPV6_ADDRESS = "ipv6-address";
const UPDATE_FUNCTION__IPV6_PREFIX = "ipv6-prefix";
const UPDATE_FUNCTION__IPV6_GATEWAY = "ipv6-gateway";
const UPDATE_FUNCTION__IPV6_NAMESERVER = "ipv6-nameserver";
const UPDATE_FUNCTION__IPV6_HOSTNAME = "ipv6-hostname";

const DEVICE_TYPE_OSA = "network-device_osa-option";
const DEVICE_TYPE_ROCE = "network-device_roce-option";

const UPDATE_FUNCTION__SELECT_DEVICE_TYPE = "selectedDeviceType";
const UPDATE_FUNCTION__READ_CHANNEL_ID = "readChannelId";
const UPDATE_FUNCTION__WRITE_CHANNEL_ID = "writeChannelId";
const UPDATE_FUNCTION__DATA_CHANNEL_ID = "dataChannelId";

const UPDATE_FUNCTION__LAYER = "layer";
const UPDATE_FUNCTION__PORT_NO = "portNo";
const UPDATE_FUNCTION__PCI_FUNCTION_ID = "pciFunctionId";
const UPDATE_FUNCTION__USER_IDENTIFIER = "userIdentifier";

export {
  ADDRESS_TYPE_IPV4,
  ADDRESS_TYPE_IPV6,
  DEVICE_TYPE_OSA,
  DEVICE_TYPE_ROCE,
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
  UPDATE_FUNCTION__SELECT_DEVICE_TYPE,
  UPDATE_FUNCTION__READ_CHANNEL_ID,
  UPDATE_FUNCTION__WRITE_CHANNEL_ID,
  UPDATE_FUNCTION__DATA_CHANNEL_ID,
  UPDATE_FUNCTION__LAYER,
  UPDATE_FUNCTION__PORT_NO,
  UPDATE_FUNCTION__PCI_FUNCTION_ID,
  UPDATE_FUNCTION__USER_IDENTIFIER,
};
