/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  LOCAL_STORAGE_KEY_APP,
  LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
  LOCAL_STORAGE_KEY_APP_INFORMATION,
  LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
  LOCAL_STORAGE_KEY_APP_HINT,
  LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
  LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
  LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
  LOCAL_STORAGE_KEY_APP_NEXT_STEPS,
  RHEL_PRESET,
  ADDRESS_TYPE_IPV4,
  DEVICE_TYPE_OSA,
  STATE_ORIGIN_DEFAULT,
} from "../util/constants";

const createInitialState = (useStateFromLocalStorage = false) => {
  const initialState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_APP));
  const defaultState = {
    step: 0,
    nextStep: 0,
    steps: {
      inputFileSelection: {
        distributionName: "Red Hat Enterprise Linux 9 (RHEL 9)",
        distributionVersion: "9.0",
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
        complete: false,
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
        complete: false,
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
        complete: false,
        invalid: false,
        localStorageKey: LOCAL_STORAGE_KEY_APP_NEXT_STEPS,
        index: 7,
      },
    },
    showNotification: false,
    isDirty: false,
    canRenderStep: true,
    isHelpPanelExpanded: true,
    showConfirmationModal: false,
    showUseExistingSettingsModal: false,
    showDiscardModifiedParamFileContentsModal: false,
    useExistingSettingsModalOpened: true,
    useStateFromLocalStorage: false,
    origin: STATE_ORIGIN_DEFAULT,
  };

  if (initialState && useStateFromLocalStorage) {
    initialState.isDirty = false;
    initialState.showConfirmationModal = false;
    initialState.showUseExistingSettingsModal = true;
    initialState.useStateFromLocalStorage = true;

    return initialState;
  } else if (initialState && !useStateFromLocalStorage) {
    defaultState.showUseExistingSettingsModal = true;
    return defaultState;
  }

  return defaultState;
};

export default createInitialState;
