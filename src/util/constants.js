/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import { nanoid } from "nanoid";

const PANEL_DOWNLOAD_PARAM_FILE = "downloadParamFile";
const PANEL_HINT = "hint";
const PANEL_INFORMATION = "information";
const PANEL_INPUT_FILE_SELECTION = "inputFileSelection";
const PANEL_INSTALLATION_PARAMETERS = "installationParameters";
const PANEL_NETWORK_ADDRESS = "networkAddress";
const PANEL_NETWORK_DEVICE = "networkDevice";
const PANEL_NEXT_STEPS = "netxtSteps";
const PANEL_SUMMARY = "summary";
const PANEL_INTRO = "intro";
const PANEL_LANDING_PAGE = "landingPage";
const PANEL_UNKNOWN = "unknown";

const ACTION_UPDATE_DISTRIBUTION_NAME = "updatedDistributionName";
const ACTION_UPDATE_DISTRIBUTION_VERSION = "updateDistributionVersion";
const ACTION_UPDATE_PARAM_FILE_COPIED = "updateParamFileCopied";
const ACTION_UPDATE_PARAM_FILE_MODIFIED = "updateParamFileModified";
const ACTION_UPDATE_PARAM_FILE_CONTENT = "updateParamFileContent";
const ACTION_UPDATE_NOP = "updateNop";
const ACTION_RESET_TO_INITIAL_STATE = "resetToInitialState";
const ACTION_UPDATE_INSTALLATION_PARAM_USE_SSH =
  "updateInstallationParamUseSSH";
const ACTION_UPDATE_INSTALLATION_PARAM_USE_VNC =
  "updateInstallationParamUseVNC";
const ACTION_UPDATE_INSTALLATION_PARAM_ADDRESS =
  "updateInstallationParamAddress";
const ACTION_UPDATE_INSTALLATION_PARAM_USERNAME =
  "updateInstallationParamUsername";
const ACTION_UPDATE_INSTALLATION_PARAM_PASSWORD =
  "updateInstallationParamPassword";
const ACTION_UPDATE_INSTALLATION_PARAM_VNC_PASSWORD =
  "updateInstallationParamVNCPassword";
const ACTION_UPDATE_NETWORK_ADDRESS_NETMASK = "updateNetmask";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV4_HOSTNAME = "updateIpv4Hostname";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV6_HOSTNAME = "updateIpv6Hostname";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV4_NS_ADDRESS =
  "updateIpv4NameserverAddress";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV6_NS_ADDRESS =
  "updateIpv6NameserverAddress";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV4_GW_ADDRESS =
  "updateIpv4GatewayAddress";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV6_GW_ADDRESS =
  "updateIpv6GatewayAddress";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV4_ADDRESS = "updateIpv4Address";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV6_ADDRESS = "updateIpv6Address";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV4_CIDR = "updateIpv4Cidr";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV6_CIDR = "updateIpv6Cidr";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV4_BINARY = "updateIpv4Binary";
const ACTION_UPDATE_NETWORK_ADDRESS_TYPE = "updateAddressType";
const ACTION_UPDATE_NETWORK_DEVICE_TYPE = "updateDeviceType";
const ACTION_UPDATE_NETWORK_DEVICE_USE_VLAN = "updateUseVlan";
const ACTION_UPDATE_NETWORK_DEVICE_READ_CHANNEL_ID = "updateReadChannelId";
const ACTION_UPDATE_NETWORK_DEVICE_WRITE_CHANNEL_ID = "updateWriteChannelId";
const ACTION_UPDATE_NETWORK_DEVICE_DATA_CHANNEL_ID = "updateDataChannelId";
const ACTION_UPDATE_NETWORK_DEVICE_LAYER = "updateNetworkLayer";
const ACTION_UPDATE_NETWORK_DEVICE_USE_MULTIPORT = "updateUseMultiPort";
const ACTION_UPDATE_NETWORK_DEVICE_PORT_NO = "updatePortNo";
const ACTION_UPDATE_NETWORK_DEVICE_PCI_FUNCTION_ID = "updatePciFunctionId";
const ACTION_UPDATE_NETWORK_DEVICE_USER_IDENTIFIER = "updateUserIdentifier";
const ACTION_UPDATE_NETWORK_DEVICE_VLAN_ID = "updateVlanId";
const ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE = "updateDownloadParmfile";
const ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE_NAME =
  "updateDownloadParmfileName";
const ACTION_UPDATE_INTRO_PURGE_PARMFILE_SETTINGS =
  "updatePurgeParmfileSettings";
const ACTION_UPDATE_APP_NEXT_STEP = "updateAppNextStep";
const ACTION_UPDATE_APP_STATE = "updateAppState";
const ACTION_UPDATE_APP_STEP = "updateAppStep";
const ACTION_UPDATE_APP_HELP_STEP = "updateAppHelpStep";
const ACTION_UPDATE_APP_STEPS = "updateAppSteps";
const ACTION_UPDATE_APP_USE_STATE_FROM_LOCAL_STORAGE =
  "updateAppUseStateFromLocalStorage";
const ACTION_UPDATE_APP_PARAM_FILE_MODIFIED = "updateAppParamFileModified";
const ACTION_UPDATE_APP_PARAM_FILE_CONTENT = "updateAppParamFileContent";
const ACTION_UPDATE_APP_CAN_RENDER_STEP = "canRenderStep";
const ACTION_UPDATE_APP_SHOW_NOTIFICATION = "updateShowNotification";
const ACTION_UPDATE_APP_HELP_PANEL_EXPANDED = "updateHelpPanelExpanded";
const ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL = "updateShowConfirmationModal";
const ACTION_UPDATE_APP_SHOW_DISCARD_MODIFIED_PARAM_FILE_CONTENTS_MODAL =
  "showDiscardModifiedParamFileContentsModal";
const ACTION_UPDATE_APP_IS_DIRTY = "updateIsDirty";
const ACTION_UPDATE_APP_IS_EDITING = "updateIsEditing";
const ACTION_UPDATE_APP_IS_DISABLED = "updateIsDisabled";

const LOCAL_STORAGE_KEY_APP = "com.ibm.systems.linux.z.app";
const LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION =
  "com.ibm.systems.linux.z.inputFileSelection";
const LOCAL_STORAGE_KEY_APP_INFORMATION = "com.ibm.systems.linux.z.information";
const LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE =
  "com.ibm.systems.linux.z.downloadParamFile";
const LOCAL_STORAGE_KEY_APP_INTRO = "com.ibm.systems.linux.z.intro";
const LOCAL_STORAGE_KEY_APP_HINT = "com.ibm.systems.linux.z.hint";
const LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS =
  "com.ibm.systems.linux.z.installationParameters";
const LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS =
  "com.ibm.systems.linux.z.networkAddress";
const LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE =
  "com.ibm.systems.linux.z.networkDevice";
const LOCAL_STORAGE_KEY_APP_NEXT_STEPS = "com.ibm.systems.linux.z.nextSteps";
const LOCAL_STORAGE_KEY_APP_SUMMARY = "com.ibm.systems.linux.z.summary";
const LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION =
  "com.ibm.systems.linux.z.inlineNotification";

const STATE_ORIGIN_USER = "user";
const STATE_ORIGIN_DEFAULT = "default";
const STATE_ORIGIN_STORAGE = "storage";

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
const UPDATE_FUNCTION__USE_MULTIPORT = "useMultiPort";
const UPDATE_FUNCTION__PORT_NO = "portNo";
const UPDATE_FUNCTION__PCI_FUNCTION_ID = "pciFunctionId";
const UPDATE_FUNCTION__USER_IDENTIFIER = "userIdentifier";

const RHEL_PRESET = "ro ramdisk_size=40000 cio_ignore=all,!condev";

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

const RHEL_V9_DISTRIBUTION_ID = "rhel";
const RHEL_V9_DISTRIBUTION_LABEL = "Red Hat Enterprise Linux 9";
const RHEL_V9_VERSION_ID = "version-9.x";
const RHEL_V9_VERSION_LABEL = "9.x";

const DISTRIBUTION_LIST = [
  {
    id: RHEL_V9_DISTRIBUTION_ID,
    label: RHEL_V9_DISTRIBUTION_LABEL,
  },
];
const VERSION_LIST = [
  {
    id: RHEL_V9_VERSION_ID,
    label: RHEL_V9_VERSION_LABEL,
  },
];

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

const DEFAULT_STEPS = {
  inputFileSelection: {
    distributionName: RHEL_V9_DISTRIBUTION_ID,
    distributionVersion: RHEL_V9_VERSION_ID,
    memorySize: 3,
    diskSize: 10,
    machineLevel: "IBM z14(r), IBM LinuxONE Emperor II or Rockhopper II",
    docLink:
      "https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9",
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
  hint: {
    complete: true,
    disabled: true,
    invalid: false,
    localStorageKey: LOCAL_STORAGE_KEY_APP_HINT,
    index: 2,
  },
  installationParameters: {
    networkInstallationUrl: "",
    vnc: {
      password: "",
      enabled: true,
    },
    ssh: {
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
  nextSteps: {
    disabled: true,
    complete: true,
    invalid: false,
    localStorageKey: LOCAL_STORAGE_KEY_APP_NEXT_STEPS,
    index: 7,
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
  PANEL_DOWNLOAD_PARAM_FILE,
  PANEL_HINT,
  PANEL_INFORMATION,
  PANEL_INPUT_FILE_SELECTION,
  PANEL_INSTALLATION_PARAMETERS,
  PANEL_NETWORK_ADDRESS,
  PANEL_NETWORK_DEVICE,
  PANEL_NEXT_STEPS,
  PANEL_SUMMARY,
  PANEL_INTRO,
  PANEL_LANDING_PAGE,
  PANEL_UNKNOWN,
  DEFAULT_DISTRIBUTION_ID,
  DEFAULT_VERSION_ID,
  LOCAL_STORAGE_KEY_APP,
  LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
  LOCAL_STORAGE_KEY_APP_INFORMATION,
  LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
  LOCAL_STORAGE_KEY_APP_INTRO,
  LOCAL_STORAGE_KEY_APP_HINT,
  LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
  LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
  LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
  LOCAL_STORAGE_KEY_APP_NEXT_STEPS,
  LOCAL_STORAGE_KEY_APP_SUMMARY,
  LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
  ACTION_UPDATE_APP_STATE,
  ACTION_UPDATE_APP_STEP,
  ACTION_UPDATE_APP_HELP_STEP,
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_NEXT_STEP,
  ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
  ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
  ACTION_UPDATE_APP_SHOW_NOTIFICATION,
  ACTION_UPDATE_APP_HELP_PANEL_EXPANDED,
  ACTION_UPDATE_APP_USE_STATE_FROM_LOCAL_STORAGE,
  ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL,
  ACTION_UPDATE_APP_SHOW_DISCARD_MODIFIED_PARAM_FILE_CONTENTS_MODAL,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_EDITING,
  ACTION_UPDATE_APP_IS_DISABLED,
  ACTION_UPDATE_APP_CAN_RENDER_STEP,
  ACTION_UPDATE_NETWORK_DEVICE_TYPE,
  ACTION_UPDATE_NETWORK_DEVICE_USE_VLAN,
  ACTION_UPDATE_NETWORK_DEVICE_READ_CHANNEL_ID,
  ACTION_UPDATE_NETWORK_DEVICE_WRITE_CHANNEL_ID,
  ACTION_UPDATE_NETWORK_DEVICE_DATA_CHANNEL_ID,
  ACTION_UPDATE_NETWORK_DEVICE_LAYER,
  ACTION_UPDATE_NETWORK_DEVICE_USE_MULTIPORT,
  ACTION_UPDATE_NETWORK_DEVICE_PORT_NO,
  ACTION_UPDATE_NETWORK_DEVICE_PCI_FUNCTION_ID,
  ACTION_UPDATE_NETWORK_DEVICE_USER_IDENTIFIER,
  ACTION_UPDATE_NETWORK_DEVICE_VLAN_ID,
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
  ACTION_UPDATE_INSTALLATION_PARAM_USE_SSH,
  ACTION_UPDATE_INSTALLATION_PARAM_USE_VNC,
  ACTION_UPDATE_INSTALLATION_PARAM_ADDRESS,
  ACTION_UPDATE_INSTALLATION_PARAM_USERNAME,
  ACTION_UPDATE_INSTALLATION_PARAM_PASSWORD,
  ACTION_UPDATE_INSTALLATION_PARAM_VNC_PASSWORD,
  ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE,
  ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE_NAME,
  ACTION_UPDATE_INTRO_PURGE_PARMFILE_SETTINGS,
  ACTION_UPDATE_NOP,
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_PARAM_FILE_COPIED,
  ACTION_UPDATE_PARAM_FILE_MODIFIED,
  ACTION_UPDATE_PARAM_FILE_CONTENT,
  ACTION_UPDATE_DISTRIBUTION_NAME,
  ACTION_UPDATE_DISTRIBUTION_VERSION,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_DEFAULT,
  STATE_ORIGIN_STORAGE,
  ADDRESS_TYPE_IPV4,
  ADDRESS_TYPE_IPV6,
  DEVICE_TYPE_OSA,
  DEVICE_TYPE_ROCE,
  PORT_NUMBER_ZERO,
  PORT_NUMBER_ONE,
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
  UPDATE_FUNCTION__USE_MULTIPORT,
  UPDATE_FUNCTION__PORT_NO,
  UPDATE_FUNCTION__PCI_FUNCTION_ID,
  UPDATE_FUNCTION__USER_IDENTIFIER,
  RHEL_PRESET,
  DEVICE_TYPE_LIST,
  DISTRIBUTION_LIST,
  VERSION_LIST,
  RHEL_V9_DISTRIBUTION_ID,
  RHEL_V9_DISTRIBUTION_LABEL,
  RHEL_V9_VERSION_ID,
  RHEL_V9_VERSION_LABEL,
};
