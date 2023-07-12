import React, { useState } from "react";
import { Modal, Content } from "@carbon/react";
import { Routes, Route } from "react-router-dom";
import InstallerHeader from "./components/InstallerHeader";
import {
  Information,
  InputFileSelection,
  InstallationParameters,
  Hint,
  MiscParameters,
  NetworkAddress,
  NetworkDevice,
  NextSteps,
  DownloadParamFile
} from "./components/panels";
import LandingPage from "./content/LandingPage";
import "./App.scss";

const PROGRESS_STEP_STATE_COMPLETION = "complete";
const PROGRESS_STATE_INVALIDATION = "invalid";

const stateToParamFile = (state) => {
  let stateToParamFile = `rd.znet=qeth,0.0.bdf0,0.0.bdf1,0.0.bdf2,
layer2=1,
portno=0,
ip=172.18.132.1::172.18.0.1:15:t3560001.lnxne.boe:encbdf0:none,
nameserver=172.18.0.1  
`;

if (state && state.miscParameters && state.miscParameters.params && state.miscParameters.params.length > 0) {
  stateToParamFile = `${stateToParamFile}${state.miscParameters.params}`;
}

return stateToParamFile;
}

const getProgressStepState = (state, forProgressStepState) => {
  if (
    forProgressStepState === PROGRESS_STATE_INVALIDATION ||
    forProgressStepState === PROGRESS_STEP_STATE_COMPLETION
  ) {
    return {
      inputFileSelection: state.inputFileSelection[forProgressStepState],
      information: state.information[forProgressStepState],
      hint: state.hint[forProgressStepState],
      networkDevice: state.networkDevice[forProgressStepState],
      networkAddress: state.networkAddress[forProgressStepState],
      installationParameters: state.miscParameters[forProgressStepState],
      miscParameters: state.miscParameters[forProgressStepState],
      downloadParamFile: state.downloadParamFile[forProgressStepState],
      nextStep: state.nextStep[forProgressStepState]
    }
  }
  return {};
}

const renderPanel = (step, patchState, state) => {
  let markup;

  switch (step) {
    case 0:
      markup = InputFileSelection(patchState, {
        disk: state.inputFileSelection.diskSize,
        memory: state.inputFileSelection.memorySize,
        level: state.inputFileSelection.machineLevel
      },
      state.inputFileSelection.docLink,
      state.inputFileSelection.localStorageKey,
      state.useStateFromLocalStorage,
      state.useExistingSettingsModalOpened);
      break;
    case 1:
      markup = Information(patchState, {
        name: state.inputFileSelection.distributionName,
        version: state.inputFileSelection.distributionVersion
      },
      {
        disk: state.inputFileSelection.diskSize,
        memory: state.inputFileSelection.memorySize,
        level: state.inputFileSelection.machineLevel
      },
      state.inputFileSelection.docLink,
      state.information.localStorageKey);
      break;
    case 2:
      markup = Hint(patchState, state.hint.localStorageKey);
      break;
    case 3:
      markup = NetworkDevice(patchState, state.networkDevice.localStorageKey);
      break;
    case 4:
      markup = NetworkAddress(patchState, state.networkAddress.localStorageKey);
      break;
    case 5:
      markup = InstallationParameters(patchState, state.installationParameters.localStorageKey);
      break;
    case 6:
      markup = MiscParameters(patchState, state.miscParameters.localStorageKey);
      break;
    case 7:
      markup = DownloadParamFile(patchState, stateToParamFile, state, state.downloadParamFile.localStorageKey);
      break;
    case 8:
      markup = NextSteps(
        state.installationParameters.ssh.enabled,
        state.installationParameters.vnc.enabled,
        state.networkAddress.addressType === "radio-ipv4"
          ? state.networkAddress.ipv4.address
          : state.networkAddress.ipv6.address,
        state.installationParameters.vnc.password,
        patchState,
        state.nextStep.localStorageKey
      );
      break;
    default:
      markup = <div>Panel not yet implemented.</div>;
  }

  return markup;
};

const App = () => {
  const getInitialState = (useStateFromLocalStorage) => {
    const initialState = JSON.parse(localStorage.getItem("com.ibm.systems.linux.z.app"));
    const defaultState = {
      inputFileSelection: {
        distributionName: "Red Hat Enterprise Linux 9 (RHEL 9)",
        distributionVersion: "9.0",
        memorySize: 3,
        diskSize: 10,
        machineLevel: "IBM z14(r), IBM LinuxONE Emperor II or Rockhopper II",
        docLink: "https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9",
        complete: false,
        invalid: false,
        localStorageKey: "com.ibm.systems.linux.z.inputFileSelection"
      },
      information: {
        complete: true,
        invalid: false,
        localStorageKey: "com.ibm.systems.linux.z.information"
      },
      downloadParamFile: {
        contents: "",
        complete: false,
        invalid: false,
        localStorageKey: "com.ibm.systems.linux.z.downloadParamFile"
      },
      hint: {
        complete: true,
        invalid: false,
        localStorageKey: "com.ibm.systems.linux.z.hint"
      },
      installationParameters: {
        networkInstallationUrl: "",
        vnc: {
          password: "",
          enabled: false
        },
        ssh: {
          enabled: false
        },
        complete: false,
        invalid: false,
        localStorageKey: "com.ibm.systems.linux.z.installationParameters"
      },
      miscParameters: {
        params: "",
        complete: true,
        invalid: false,
        localStorageKey: "com.ibm.systems.linux.z.miscParameters"
      },
      networkAddress: {
        addressType: "",
        ipv4: {
          cidr: "",
          binary: "",
          netmask: "",
          address: ""
        },
        ipv6: {
          cidr: "",
          address: ""
        },
        gatewayIpAddress: "",
        nameserverIpAddress: "",
        complete: false,
        invalid: false,
        localStorageKey: "com.ibm.systems.linux.z.networkAddress"
      },
      networkDevice: {
        deviceType: "",
        osa: {
          readChannel: "",
          writeChannel: "",
          dataChannel: "",
          portNumber: 0,
          layer: 0,
        },
        roce: {
          fid: "",
          uid: ""
        },
        vlanId: "",
        complete: false,
        invalid: false,
        localStorageKey: "com.ibm.systems.linux.z.networkDevice"
      },
      nextStep: {
        complete: true,
        invalid: false,
        localStorageKey: "com.ibm.systems.linux.z.nextStep"
      },
      showNotification: false,
      isDirty: false,
      showConfirmationModal: false,
      showUseExistingSettingsModal: false,
      useExistingSettingsModalOpened: true,
      useStateFromLocalStorage: false
    };

    if (initialState && useStateFromLocalStorage) {
      initialState.isDirty = false;
      initialState.showConfirmationModal = false;
      initialState.showUseExistingSettingsModal = true;
      initialState.useStateFromLocalStorage = true;
      return initialState
    } else if (initialState && !useStateFromLocalStorage) {
      defaultState.showUseExistingSettingsModal = true;
      return defaultState;
    }
    return defaultState;
  }
  const [step, setStep] = useState(0);
  const [state, setState] = useState(getInitialState);
  const patchState = (patch) => {;
    setState((prevState) => ({...prevState, ...patch}));
    updateIsDirty(true);
    localStorage.setItem("com.ibm.systems.linux.z.app", JSON.stringify(state));
    console.log(state);
  }
  const updateShowNotification = (showNotification) => {
    setState((prevState) => ({...prevState, showNotification}));
  }
  const updateShowConfirmationModal = (showConfirmationModal) => {
    setState((prevState) => ({...prevState, showConfirmationModal}));
  }
  const updateShowUseExistingSettingsModal = (showUseExistingSettingsModal) => {
    setState((prevState) => ({...prevState, showUseExistingSettingsModal}));
  }
  const updateUseExistingSettingsModalOpened = (useExistingSettingsModalOpened) => {
    setState((prevState) => ({...prevState, useExistingSettingsModalOpened}));
  }
  const updateIsDirty = (isDirty) => {
    setState((prevState) => ({...prevState, isDirty}));
  }
  const panelMarkup = renderPanel(step, patchState, state);
  const showNotification = (callback) => {
    if (callback) {
      if (state.showNotification) {
        updateShowNotification(false);
        return callback();
      }
      updateShowNotification(true);
      return callback();
    }
    return state.showNotification ? updateShowNotification(false) : updateShowNotification(true);
  }
  const closeNotification = (settingsWereDeleted) => {
    if (settingsWereDeleted && typeof settingsWereDeleted === "boolean") {
      showNotification(() => {
        return updateShowConfirmationModal(true);
      });
    }
    return updateShowNotification(false);
  }
  const progressStepCompletion = getProgressStepState(state, PROGRESS_STEP_STATE_COMPLETION);
  const progressStepInvalidation = getProgressStepState(state, PROGRESS_STATE_INVALIDATION);
  const getLocalStorageKeys = () => {
    const keys = Object.keys(state);
    const localStorageKeys = [];

    let i;
    for (i = 0; i < keys.length; i++) {
      const stateKey = keys[i];
      const currentLocalStorageKey = state[stateKey].localStorageKey;
      localStorageKeys.push(currentLocalStorageKey);
    }
    return localStorageKeys;
  }

  window.addEventListener('beforeunload', (event) => {
    if (state.isDirty) {
      event.returnValue = `Are you sure you want to leave?`;
    }
  });

  return (
    <>
      <InstallerHeader
        showNotification={state.showNotification}
        onShowNotification={showNotification}
        onProgress={setStep}
        progressStep={step}
        progressStepCompletion={progressStepCompletion}
        progressStepInvalidation={progressStepInvalidation}
      />
      <Modal
        open={state.showConfirmationModal}
        passiveModal
        onRequestClose={() => {
          updateShowConfirmationModal(false);
        }}
        modalHeading="The param file settings have been pruned from your browser cache.">
      </Modal>
      <Modal
        preventCloseOnClickOutside
        open={state.showUseExistingSettingsModal}
        modalHeading="There are existing param file settings. Do you want to use them as a baseline for this session?"
        modalLabel="Existing settings found"
        primaryButtonText="Yes"
        secondaryButtonText="No"
        onRequestSubmit={() => {
          patchState(getInitialState(true));
          updateShowUseExistingSettingsModal(false);
          updateUseExistingSettingsModalOpened(true);
        }}
        onSecondarySubmit={() => {
          const localStorageKeys = getLocalStorageKeys();
          let i;
          for (i = 0; i < localStorageKeys.length; i++) {
            localStorage.removeItem(localStorageKeys[i]);
          }
          localStorage.removeItem("com.ibm.systems.linux.z.app");
          updateShowUseExistingSettingsModal(false);
          updateUseExistingSettingsModalOpened(true);
        }}
        onRequestClose={() => {
          updateShowUseExistingSettingsModal(false);
          updateUseExistingSettingsModalOpened(true);
        }}
      />
      <Content className="app__full-height">
        <Routes>
          <Route
            exact={true}
            path={import.meta.env.VITE_URL_PATH_PREFIX}
            element={
              <LandingPage
                panelMarkup={panelMarkup}
                showNotification={state.showNotification}
                closeNotification={closeNotification}
                localStorageKeys={getLocalStorageKeys()}
              />
            }
          />
        </Routes>
      </Content>
    </>
  );
};

export default App;
