/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import { nanoid } from "nanoid";

import {
  LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
  LOCAL_STORAGE_KEY_APP_INFORMATION,
  LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
  LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
  LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
  LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
  LOCAL_STORAGE_KEY_APP_SUMMARY,
  LOCAL_STORAGE_KEY_APP_INTRO,
} from "./local-storage-constants";

const ADDRESS_TYPE_IPV4 = "ipv4";
const ADDRESS_TYPE_IPV6 = "ipv6";

const PORT_NUMBER_ZERO = "port-00";
const PORT_NUMBER_ONE = "port-01";

const UPDATE_FUNCTION__UNKNOWN = "unknown";

const UPDATE_FUNCTION__IPV4_ADDRESS = "ipv4-address";
const UPDATE_FUNCTION__IPV4_PREFIX = "ipv4-prefix";
const UPDATE_FUNCTION__IPV4_NETMASK = "ipv4-netmask";
const UPDATE_FUNCTION__IPV4_BINARY = "ipv4-binary";
const UPDATE_FUNCTION__IPV4_GATEWAY = "ipv4-gateway";
const UPDATE_FUNCTION__IPV4_NAMESERVER = "ipv4-nameserver";
const UPDATE_FUNCTION__IPV4_HOSTNAME = "ipv4-hostname";
const UPDATE_FUNCTION__IPV4_DOMAIN_SEARCH_PATH = "ipv4-domainSearchPath";

const UPDATE_FUNCTION__IPV6_ADDRESS = "ipv6-address";
const UPDATE_FUNCTION__IPV6_PREFIX = "ipv6-prefix";
const UPDATE_FUNCTION__IPV6_GATEWAY = "ipv6-gateway";
const UPDATE_FUNCTION__IPV6_NAMESERVER = "ipv6-nameserver";
const UPDATE_FUNCTION__IPV6_HOSTNAME = "ipv6-hostname";
const UPDATE_FUNCTION__IPV6_DOMAIN_SEARCH_PATH = "ipv6-domainSearchPath";

const DEVICE_TYPE_OSA = "network-device_osa-option";
const DEVICE_TYPE_ROCE = "network-device_roce-option";

const UPDATE_FUNCTION__SELECT_DEVICE_TYPE = "selectedDeviceType";
const UPDATE_FUNCTION__READ_CHANNEL_ID = "readChannelId";
const UPDATE_FUNCTION__WRITE_CHANNEL_ID = "writeChannelId";
const UPDATE_FUNCTION__DATA_CHANNEL_ID = "dataChannelId";

const UPDATE_FUNCTION__LAYER = "layer";
const UPDATE_FUNCTION__USE_MULTIPORT = "useMultiPort";
const UPDATE_FUNCTION__PORT_NO = "portNo";
const UPDATE_FUNCTION__PCI_FUNCTION_ID = "pciFunctionId";
const UPDATE_FUNCTION__USER_IDENTIFIER = "userIdentifier";

const RHEL_PRESET = "ro ramdisk_size=40000 cio_ignore=all,!condev";
const SLES_PRESET =
  "ro term=dumb init=/linuxrc linuxrclog=/dev/console MANUAL=0 deviceautoconfig=0";
const UBUNTU_PRESET = "ro locale=en_US auto=true priority=critical";

const PRESETS = {
  rhel: RHEL_PRESET,
  sles: SLES_PRESET,
  ubuntu: UBUNTU_PRESET,
};

const SYSTEM_REQUIREMENTS = {
  rhel: {
    memorySize: 3,
    diskSize: 10,
    machineLevel: "IBM z14(r), IBM LinuxONE Emperor II or Rockhopper II",
    docLink:
      "https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9",
  },
  sles: {
    memorySize: 1.5,
    diskSize: 10,
    machineLevel: "IBM zEnterprise EC12, BC12 IBM LinuxONE Emperor, Rockhopper",
    docLink:
      "https://documentation.suse.com/sles/15-SP5/single-html/SLES-deployment/#sec-zseries-requirements",
  },
  ubuntu: {
    memorySize: 3,
    diskSize: 10,
    machineLevel: "IBM z14(r), IBM LinuxONE Emperor II or Rockhopper II",
    docLink: "https://some.ubuntu.domain/some/path/to/documentation",
  },
};

const DEVICE_TYPE_LIST = [
  {
    id: "network-device_osa-option",
    label: "OSA",
  },
  {
    id: "network-device_roce-option",
    label: "RoCE",
  },
];

const MAJORITY_STABLE = "majorityStable";
const MAJORITY_EXPERIMENTAL = "majorityExperimental";

const RHEL_DISTRIBUTION_ID = "rhel";
const RHEL_DISTRIBUTION_LABEL = "Red Hat Enterprise Linux";
const RHEL_V9_VERSION_ID = "version-9.x";
const RHEL_V9_VERSION_LABEL = "9.x";

const SLES_DISTRIBUTION_ID = "sles";
const SLES_DISTRIBUTION_LABEL = "SUSE Linux Enterprise Server (experimental)";
const SLES_V15_VERSION_ID = "version-15";
const SLES_V15_VERSION_LABEL = "15 SP5";

const UBUNTU_DISTRIBUTION_ID = "ubuntu";
const UBUNTU_DISTRIBUTION_LABEL = "Ubuntu Server (experimental)";
const UBUNTU_V20_VERSION_ID = "version-20";
const UBUNTU_V20_VERSION_LABEL = "20.04.6 LTS";
const UBUNTU_V22_VERSION_ID = "version-22";
const UBUNTU_V22_VERSION_LABEL = "22.04.4 LTS";

const DISTRIBUTION_LIST = [
  {
    id: RHEL_DISTRIBUTION_ID,
    label: RHEL_DISTRIBUTION_LABEL,
    majority: MAJORITY_STABLE,
  },
  {
    id: SLES_DISTRIBUTION_ID,
    label: SLES_DISTRIBUTION_LABEL,
    majority: MAJORITY_EXPERIMENTAL,
  },
  {
    id: UBUNTU_DISTRIBUTION_ID,
    label: UBUNTU_DISTRIBUTION_LABEL,
    majority: MAJORITY_EXPERIMENTAL,
  },
];
const VERSION_LIST = {
  rhel: [
    {
      id: RHEL_V9_VERSION_ID,
      label: RHEL_V9_VERSION_LABEL,
    },
  ],
  sles: [
    {
      id: SLES_V15_VERSION_ID,
      label: SLES_V15_VERSION_LABEL,
    },
  ],
  ubuntu: [
    {
      id: UBUNTU_V20_VERSION_ID,
      label: UBUNTU_V20_VERSION_LABEL,
    },
    {
      id: UBUNTU_V22_VERSION_ID,
      label: UBUNTU_V22_VERSION_LABEL,
    },
  ],
};

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

const DEFAULT_DISTRIBUTION_ID = "rhel";
const DEFAULT_VERSION_ID = "version-9.x";

const TEARSHEET_KIND_GETTING_STARTED = "gettingStarted";
const TEARSHEET_KIND_NEXT_STEPS = "nextSteps";
const TEARSHEET_KIND_NONE = "none";

const TEARSHEET_TAB_CONTENT_CLASSIC_MODE = "tabContentClassicMode";
const TEARSHEET_TAB_CONTENT_DPM = "tabContentDPM";

const DEFAULT_PARAM_FILE_NAME = `parmfile__${nanoid()}.txt`;

const DEFAULT_THEME = "white";
const DARK_THEME = "g100";
const LIGHT_THEME = DEFAULT_THEME;

const DEFAULT_STEPS = {
  inputFileSelection: {
    distributionName: RHEL_DISTRIBUTION_ID,
    distributionVersion: RHEL_V9_VERSION_ID,
    systemRequirements: SYSTEM_REQUIREMENTS,
    complete: false,
    disabled: false,
    invalid: false,
    localStorageKey: LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
    index: 0,
  },
  information: {
    complete: true,
    disabled: true,
    invalid: false,
    localStorageKey: LOCAL_STORAGE_KEY_APP_INFORMATION,
    index: 1,
  },
  downloadParamFile: {
    presets: RHEL_PRESET,
    contents: "",
    modified: false,
    complete: false,
    disabled: true,
    invalid: false,
    localStorageKey: LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
    index: 6,
  },
  installationParameters: {
    networkInstallationUrl: "",
    vnc: {
      password: "",
      enabled: true,
    },
    ssh: {
      password: "",
      enabled: false,
    },
    complete: false,
    disabled: true,
    invalid: false,
    localStorageKey: LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
    index: 5,
  },
  networkAddress: {
    addressType: ADDRESS_TYPE_IPV4,
    ipv4: {
      cidr: 1,
      binary: "",
      netmask: "",
      address: "",
    },
    ipv6: {
      cidr: 1,
      address: "",
    },
    gatewayIpAddress: "",
    nameserverIpAddress: "",
    hostName: "",
    domainSearchPath: "",
    complete: false,
    disabled: true,
    invalid: false,
    localStorageKey: LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
    index: 4,
  },
  networkDevice: {
    deviceType: DEVICE_TYPE_OSA,
    osa: {
      readChannel: "",
      writeChannel: "",
      dataChannel: "",
      portNumber: 0,
      layer: 0,
    },
    roce: {
      fid: "",
      uid: "",
    },
    vlan: {
      id: 1,
      enabled: false,
    },
    complete: false,
    disabled: true,
    invalid: false,
    localStorageKey: LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
    index: 3,
  },
  summary: {
    downloadParmfile: false,
    downloadParmfileName: "",
    disabled: true,
    complete: true,
    invalid: false,
    localStorageKey: LOCAL_STORAGE_KEY_APP_SUMMARY,
    index: 8,
  },
  intro: {
    purgeParmfileSettings: false,
    disabled: true,
    complete: true,
    invalid: false,
    localStorageKey: LOCAL_STORAGE_KEY_APP_INTRO,
    index: 10,
  },
};

export {
  PRESETS,
  DARK_THEME,
  LIGHT_THEME,
  DEFAULT_THEME,
  DEFAULT_STEPS,
  DEFAULT_PARAM_FILE_NAME,
  TEARSHEET_TAB_CONTENT_CLASSIC_MODE,
  TEARSHEET_TAB_CONTENT_DPM,
  TEARSHEET_KIND_NONE,
  TEARSHEET_KIND_GETTING_STARTED,
  TEARSHEET_KIND_NEXT_STEPS,
  DEFAULT_COMPUTED_NUMBER_OBJECT,
  DEFAULT_COMPUTED_STRING_OBJECT,
  DEFAULT_NUMBER_OBJECT,
  DEFAULT_STRING_OBJECT,
  DEFAULT_DISTRIBUTION_ID,
  DEFAULT_VERSION_ID,
  ADDRESS_TYPE_IPV4,
  ADDRESS_TYPE_IPV6,
  DEVICE_TYPE_OSA,
  DEVICE_TYPE_ROCE,
  PORT_NUMBER_ZERO,
  PORT_NUMBER_ONE,
  MAJORITY_STABLE,
  MAJORITY_EXPERIMENTAL,
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
  UPDATE_FUNCTION__SELECT_DEVICE_TYPE,
  UPDATE_FUNCTION__READ_CHANNEL_ID,
  UPDATE_FUNCTION__WRITE_CHANNEL_ID,
  UPDATE_FUNCTION__DATA_CHANNEL_ID,
  UPDATE_FUNCTION__LAYER,
  UPDATE_FUNCTION__USE_MULTIPORT,
  UPDATE_FUNCTION__PORT_NO,
  UPDATE_FUNCTION__PCI_FUNCTION_ID,
  UPDATE_FUNCTION__USER_IDENTIFIER,
  RHEL_PRESET,
  SLES_PRESET,
  UBUNTU_PRESET,
  DEVICE_TYPE_LIST,
  DISTRIBUTION_LIST,
  VERSION_LIST,
  RHEL_DISTRIBUTION_ID,
  RHEL_DISTRIBUTION_LABEL,
  RHEL_V9_VERSION_ID,
  RHEL_V9_VERSION_LABEL,
  SLES_DISTRIBUTION_ID,
  SLES_DISTRIBUTION_LABEL,
  SLES_V15_VERSION_ID,
  SLES_V15_VERSION_LABEL,
  UBUNTU_DISTRIBUTION_ID,
  UBUNTU_DISTRIBUTION_LABEL,
  UBUNTU_V20_VERSION_ID,
  UBUNTU_V20_VERSION_LABEL,
  UBUNTU_V22_VERSION_ID,
  UBUNTU_V22_VERSION_LABEL,
};
