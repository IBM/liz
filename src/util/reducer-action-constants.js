/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

const ACTION_UPDATE_DISTRIBUTION_NAME = "updatedDistributionName";
const ACTION_UPDATE_DISTRIBUTION_VERSION = "updateDistributionVersion";
const ACTION_UPDATE_PARAM_FILE_COPIED = "updateParamFileCopied";
const ACTION_UPDATE_PARAM_FILE_MODIFIED = "updateParamFileModified";
const ACTION_UPDATE_PARAM_FILE_CONTENT = "updateParamFileContent";
const ACTION_UPDATE_NOP = "updateNop";
const ACTION_RESET_TO_INITIAL_STATE = "resetToInitialState";
const ACTION_UPDATE_INSTALLATION_PARAM_USE_SSH =
    "updateInstallationParamUseSSH";
const ACTION_UPDATE_INSTALLATION_PARAM_SHOW_PASSWORDS =
    "updateInstallationParamShowPasswords";
const ACTION_UPDATE_INSTALLATION_PARAM_IS_EDITING =
    "updateInstallationParamIsEditings";
const ACTION_UPDATE_INSTALLATION_PARAM_OVERRIDE_GLOBAL_STATE =
    "updateInstallationParamOverrideGlobalState";
const ACTION_UPDATE_INSTALLATION_PARAM_USE_VNC =
    "updateInstallationParamUseVNC";
const ACTION_UPDATE_INSTALLATION_PARAM_ADDRESS =
    "updateInstallationParamAddress";
const ACTION_UPDATE_INSTALLATION_PARAM_USERNAME =
    "updateInstallationParamUsername";
const ACTION_UPDATE_INSTALLATION_PARAM_PASSWORD =
    "updateInstallationParamPassword";
const ACTION_UPDATE_INSTALLATION_PARAM_SSH_PASSWORD =
    "updateInstallationParamSSHPassword";
const ACTION_UPDATE_INSTALLATION_PARAM_VNC_PASSWORD =
    "updateInstallationParamVNCPassword";
const ACTION_UPDATE_NETWORK_ADDRESS_NETMASK = "updateNetmask";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV4_HOSTNAME = "updateIpv4Hostname";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV6_HOSTNAME = "updateIpv6Hostname";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV4_DOMAIN_SEARCH_PATH =
    "updateIpv4DomainSearchPath";
const ACTION_UPDATE_NETWORK_ADDRESS_IPV6_DOMAIN_SEARCH_PATH =
    "updateIpv6DomainSearchPath";
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
const ACTION_UPDATE_APP_SHOW_NOTIFICATION = "updateShowNotification";
const ACTION_UPDATE_APP_SHOW_LEGAL_NOTIFICATION = "updateShowLegalNotification";
const ACTION_UPDATE_APP_HELP_PANEL_EXPANDED = "updateHelpPanelExpanded";
const ACTION_UPDATE_APP_HELP_PANEL_SELECTOR_PRIMARY_FOCUS =
    "selectorPrimaryFocus";
const ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL = "updateShowConfirmationModal";
const ACTION_UPDATE_APP_IS_DIRTY = "updateIsDirty";
const ACTION_UPDATE_APP_IS_EDITING = "updateIsEditing";
const ACTION_UPDATE_APP_IS_DISABLED = "updateIsDisabled";
const ACTION_UPDATE_APP_INCLUDE_INTRO_STEP = "updateIncludeIntroStep";
const ACTION_UPDATE_PARMFILE_CARD_IS_EXPANDED = "updateParfileCardIsExpanded";
const ACTION_UPDATE_REQUIREMENTS_CARD_IS_EXPANDED =
    "updateRequirementsCardIsExpanded";
const ACTION_UPDATE_REQUIREMENTS_CARD_HAS_BEEN_REVIEWED =
    "updateRequirementsCardHasBeenReviewed";
const ACTION_UPDATE_NEXT_STEPS_CARD_IS_EXPANDED =
    "updateNextStepsCardIsExpanded";
const ACTION_UPDATE_NEXT_STEPS_CARD_HAS_BEEN_REVIEWED =
    "updateNextStepsCardHasBeenReviewed";
const ACTION_UPDATE_NEEDS_MANUAL_NAVIGATION_CONFIRMATION =
    "needsManualNavigationConfirmation";
const ACTION_UPDATE_MANUAL_NAVIGATION_ORIGIN = "manualNavigationOrigin";
const ACTION_UPDATE_APP_CONFIG = "updateConfig";
const ACTION_UPDATE_APP_HAS_TABS = "updateHasTabs";
const ACTION_UPDATE_APP_TABS = "updateTabs";
const ACTION_UPDATE_APP_THEME = "updateTheme";
const ACTION_UPDATE_APP_USE_OS_THEME = "updateUseOperatingSystemTheme";
const ACTION_UPDATE_APP_SHOW_PASSWORDS = "updateShowPasswords";

export {
    ACTION_UPDATE_APP_THEME,
    ACTION_UPDATE_APP_USE_OS_THEME,
    ACTION_UPDATE_APP_SHOW_PASSWORDS,
    ACTION_UPDATE_APP_HAS_TABS,
    ACTION_UPDATE_APP_TABS,
    ACTION_UPDATE_APP_CONFIG,
    ACTION_UPDATE_APP_STATE,
    ACTION_UPDATE_APP_STEP,
    ACTION_UPDATE_APP_HELP_STEP,
    ACTION_UPDATE_APP_STEPS,
    ACTION_UPDATE_APP_NEXT_STEP,
    ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
    ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
    ACTION_UPDATE_APP_SHOW_NOTIFICATION,
    ACTION_UPDATE_APP_SHOW_LEGAL_NOTIFICATION,
    ACTION_UPDATE_APP_HELP_PANEL_EXPANDED,
    ACTION_UPDATE_APP_HELP_PANEL_SELECTOR_PRIMARY_FOCUS,
    ACTION_UPDATE_APP_USE_STATE_FROM_LOCAL_STORAGE,
    ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL,
    ACTION_UPDATE_APP_IS_DIRTY,
    ACTION_UPDATE_APP_IS_EDITING,
    ACTION_UPDATE_APP_IS_DISABLED,
    ACTION_UPDATE_APP_INCLUDE_INTRO_STEP,
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
    ACTION_UPDATE_INSTALLATION_PARAM_USE_SSH,
    ACTION_UPDATE_INSTALLATION_PARAM_USE_VNC,
    ACTION_UPDATE_INSTALLATION_PARAM_SHOW_PASSWORDS,
    ACTION_UPDATE_INSTALLATION_PARAM_OVERRIDE_GLOBAL_STATE,
    ACTION_UPDATE_INSTALLATION_PARAM_IS_EDITING,
    ACTION_UPDATE_INSTALLATION_PARAM_ADDRESS,
    ACTION_UPDATE_INSTALLATION_PARAM_USERNAME,
    ACTION_UPDATE_INSTALLATION_PARAM_PASSWORD,
    ACTION_UPDATE_INSTALLATION_PARAM_VNC_PASSWORD,
    ACTION_UPDATE_INSTALLATION_PARAM_SSH_PASSWORD,
    ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE,
    ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE_NAME,
    ACTION_UPDATE_INTRO_PURGE_PARMFILE_SETTINGS,
    ACTION_UPDATE_PARMFILE_CARD_IS_EXPANDED,
    ACTION_UPDATE_REQUIREMENTS_CARD_IS_EXPANDED,
    ACTION_UPDATE_REQUIREMENTS_CARD_HAS_BEEN_REVIEWED,
    ACTION_UPDATE_NEXT_STEPS_CARD_IS_EXPANDED,
    ACTION_UPDATE_NEXT_STEPS_CARD_HAS_BEEN_REVIEWED,
    ACTION_UPDATE_NOP,
    ACTION_RESET_TO_INITIAL_STATE,
    ACTION_UPDATE_PARAM_FILE_COPIED,
    ACTION_UPDATE_PARAM_FILE_MODIFIED,
    ACTION_UPDATE_PARAM_FILE_CONTENT,
    ACTION_UPDATE_DISTRIBUTION_NAME,
    ACTION_UPDATE_DISTRIBUTION_VERSION,
    ACTION_UPDATE_NEEDS_MANUAL_NAVIGATION_CONFIRMATION,
    ACTION_UPDATE_MANUAL_NAVIGATION_ORIGIN,
};
