/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Content } from "@carbon/react";
import { Routes, Route } from "react-router-dom";
import InstallerHeader from "./components/InstallerHeader";
import {
  Information,
  InputFileSelection,
  InstallationParameters,
  Hint,
  NetworkAddress,
  NetworkDevice,
  NextSteps,
  DownloadParamFile,
} from "./components/panels";
import {
  Information as InformationContent,
  InputFileSelection as InputFileSelectionContent,
  InstallationParameters as InstallationParametersContent,
  Hint as HintContent,
  NetworkAddress as NetworkAddressContent,
  NetworkDevice as NetworkDeviceContent,
  NextSteps as NextStepsContent,
  DownloadParamFile as DownloadParamFileContent,
} from "./components/help";
import { stateToParamFile } from "./util/param-file-util";
import { ADDRESS_TYPE_IPV4, RHEL_PRESET } from "./util/constants";
import LandingPage from "./content/LandingPage";
import "./App.scss";

const PROGRESS_STEP_STATE_COMPLETE = "complete";
const PROGRESS_STATE_INVALID = "invalid";
const PROGRESS_STATE_DISABLED = "disabled";

const getProgressStepState = (state, forProgressStepState) => {
  if (
    forProgressStepState === PROGRESS_STATE_INVALID ||
    forProgressStepState === PROGRESS_STEP_STATE_COMPLETE ||
    forProgressStepState === PROGRESS_STATE_DISABLED
  ) {
    return {
      inputFileSelection: state.steps.inputFileSelection[forProgressStepState],
      information: state.steps.information[forProgressStepState],
      hint: state.steps.hint[forProgressStepState],
      networkDevice: state.steps.networkDevice[forProgressStepState],
      networkAddress: state.steps.networkAddress[forProgressStepState],
      installationParameters:
        state.steps.installationParameters[forProgressStepState],
      downloadParamFile: state.steps.downloadParamFile[forProgressStepState],
      nextSteps: state.steps.nextSteps[forProgressStepState],
    };
  }
  return {};
};

const renderHelpContent = (step) => {
  let markup;

  switch (step) {
    case 0:
      markup = InputFileSelectionContent();
      break;
    case 1:
      markup = InformationContent();
      break;
    case 2:
      markup = HintContent();
      break;
    case 3:
      markup = NetworkDeviceContent();
      break;
    case 4:
      markup = NetworkAddressContent();
      break;
    case 5:
      markup = InstallationParametersContent();
      break;
    case 6:
      markup = DownloadParamFileContent();
      break;
    case 7:
      markup = NextStepsContent();
      break;
    default:
      markup = <div>Help content not yet implemented.</div>;
  }

  return markup;
};

const renderPanel = (step, patchState, state) => {
  let markup;

  switch (step) {
    case 0:
      markup = InputFileSelection(
        patchState,
        {
          disk: state.steps.inputFileSelection.diskSize,
          memory: state.steps.inputFileSelection.memorySize,
          level: state.steps.inputFileSelection.machineLevel,
        },
        state.steps.inputFileSelection.docLink,
        state.steps.inputFileSelection.localStorageKey,
        state.steps.useStateFromLocalStorage,
        state.steps.useExistingSettingsModalOpened,
      );
      break;
    case 1:
      markup = Information(
        patchState,
        {
          name: state.steps.inputFileSelection.distributionName,
          version: state.steps.inputFileSelection.distributionVersion,
        },
        {
          disk: state.steps.inputFileSelection.diskSize,
          memory: state.steps.inputFileSelection.memorySize,
          level: state.steps.inputFileSelection.machineLevel,
        },
        state.steps.inputFileSelection.docLink,
        state.steps.information.localStorageKey,
      );
      break;
    case 2:
      markup = Hint(patchState, state.steps.hint.localStorageKey);
      break;
    case 3:
      markup = NetworkDevice(
        patchState,
        state.steps.networkDevice.localStorageKey,
      );
      break;
    case 4:
      markup = NetworkAddress(
        patchState,
        state.steps.networkAddress.localStorageKey,
      );
      break;
    case 5:
      markup = InstallationParameters(
        patchState,
        state.steps.installationParameters.localStorageKey,
        state?.steps?.networkAddress?.addressType ?? ADDRESS_TYPE_IPV4,
      );
      break;
    case 6:
      markup = DownloadParamFile(
        patchState,
        stateToParamFile,
        state,
        state.steps.downloadParamFile.localStorageKey,
      );
      break;
    case 7:
      markup = NextSteps(
        state.steps.installationParameters.ssh.enabled,
        state.steps.installationParameters.vnc.enabled,
        state.steps.networkAddress.addressType === ADDRESS_TYPE_IPV4
          ? state.steps.networkAddress.ipv4.address
          : state.steps.networkAddress.ipv6.address,
        state.steps.installationParameters.vnc.password,
        patchState,
        state.steps.nextSteps.localStorageKey,
      );
      break;
    default:
      markup = <div>Panel not yet implemented.</div>;
  }

  return markup;
};

const App = () => {
  const { t } = useTranslation();
  const getInitialState = (useStateFromLocalStorage) => {
    const initialState = JSON.parse(
      localStorage.getItem("com.ibm.systems.linux.z.app"),
    );
    const defaultState = {
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
          localStorageKey: "com.ibm.systems.linux.z.inputFileSelection",
        },
        information: {
          complete: false,
          disabled: true,
          invalid: false,
          localStorageKey: "com.ibm.systems.linux.z.information",
        },
        downloadParamFile: {
          presets: RHEL_PRESET,
          contents: "",
          complete: false,
          disabled: true,
          invalid: false,
          localStorageKey: "com.ibm.systems.linux.z.downloadParamFile",
        },
        hint: {
          complete: false,
          disabled: true,
          invalid: false,
          localStorageKey: "com.ibm.systems.linux.z.hint",
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
          localStorageKey: "com.ibm.systems.linux.z.installationParameters",
        },
        networkAddress: {
          addressType: "",
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
          localStorageKey: "com.ibm.systems.linux.z.networkAddress",
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
            uid: "",
          },
          vlan: {
            id: 1,
            enabled: false,
          },
          complete: false,
          disabled: true,
          invalid: false,
          localStorageKey: "com.ibm.systems.linux.z.networkDevice",
        },
        nextSteps: {
          disabled: true,
          complete: false,
          invalid: false,
          localStorageKey: "com.ibm.systems.linux.z.nextSteps",
        },
      },
      showNotification: false,
      isDirty: false,
      isHelpPanelExpanded: true,
      showConfirmationModal: false,
      showUseExistingSettingsModal: false,
      useExistingSettingsModalOpened: true,
      useStateFromLocalStorage: false,
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
  const [step, setStep] = useState(0);
  const [state, setState] = useState(getInitialState());
  const patchState = (patch) => {
    const stateCopy = JSON.parse(JSON.stringify(state));
    const mergedSteps = Object.assign(stateCopy.steps, patch.steps);

    stateCopy.steps = mergedSteps;
    setState((prevState) => Object.assign(prevState, stateCopy));
    updateIsDirty(true);
    updateIsDisabled(stateCopy);
    localStorage.setItem("com.ibm.systems.linux.z.app", JSON.stringify(state));
    console.log(state);
  };
  const updateShowNotification = (showNotification) => {
    setState((prevState) => ({ ...prevState, showNotification }));
  };
  const updateIsHelpPanelExpanded = (isHelpPanelExpanded) => {
    setState((prevState) => ({ ...prevState, isHelpPanelExpanded }));
  };
  const updateShowConfirmationModal = (showConfirmationModal) => {
    setState((prevState) => ({ ...prevState, showConfirmationModal }));
  };
  const updateShowUseExistingSettingsModal = (showUseExistingSettingsModal) => {
    setState((prevState) => ({ ...prevState, showUseExistingSettingsModal }));
  };
  const updateUseExistingSettingsModalOpened = (
    useExistingSettingsModalOpened,
  ) => {
    setState((prevState) => ({ ...prevState, useExistingSettingsModalOpened }));
  };
  const updateIsDirty = (isDirty) => {
    setState((prevState) => ({ ...prevState, isDirty }));
  };
  const setNavigationalStepsActivity = (flag = false, localState) => {
    const stateCopy = JSON.parse(JSON.stringify(localState));
    const keys = Object.keys(stateCopy.steps);

    let i;
    for (i = 0; i < keys.length; i++) {
      const stateKey = keys[i];

      if (stateKey !== "inputFileSelection") {
        stateCopy.steps[stateKey].disabled = flag;
      }
      setState((prevState) => ({ ...prevState, ...stateCopy }));
    }
  };
  const updateIsDisabled = (localState) => {
    const hasInputFileSelection =
      localState && localState.steps && localState.steps.inputFileSelection;
    const isComplete =
      hasInputFileSelection && localState.steps.inputFileSelection.complete;

    if (hasInputFileSelection && !isComplete) {
      setNavigationalStepsActivity(true, localState);
    } else if (hasInputFileSelection && isComplete) {
      setNavigationalStepsActivity(false, localState);
    }
  };
  const helpContentMarkup = renderHelpContent(step);
  const panelMarkup = renderPanel(step, patchState, state);
  const showHelpPanel = (flag) => {
    updateIsHelpPanelExpanded(flag);
  };
  const showNotification = (callback) => {
    if (callback) {
      if (state.showNotification) {
        updateShowNotification(false);
        return callback();
      }
      updateShowNotification(true);
      return callback();
    }
    return state.showNotification
      ? updateShowNotification(false)
      : updateShowNotification(true);
  };
  const closeNotification = (settingsWereDeleted) => {
    if (settingsWereDeleted && typeof settingsWereDeleted === "boolean") {
      showNotification(() => {
        return updateShowConfirmationModal(true);
      });
    }
    return updateShowNotification(false);
  };
  const progressStepComplete = getProgressStepState(
    state,
    PROGRESS_STEP_STATE_COMPLETE,
  );
  const progressStepInvalid = getProgressStepState(
    state,
    PROGRESS_STATE_INVALID,
  );
  const progressStepDisabled = getProgressStepState(
    state,
    PROGRESS_STATE_DISABLED,
  );
  const getLocalStorageKeys = () => {
    const keys = Object.keys(state.steps);
    const localStorageKeys = [];

    let i;
    for (i = 0; i < keys.length; i++) {
      const stateKey = keys[i];
      const currentLocalStorageKey = state.steps[stateKey].localStorageKey;
      localStorageKeys.push(currentLocalStorageKey);
    }
    return localStorageKeys;
  };
  const getInlineNotification = () => {
    const headerLabel = t("legalNotice.headerLabel");
    const contentLabel = t("legalNotice.contentLabel");

    const inlineNotification = JSON.parse(
      localStorage.getItem("com.ibm.systems.linux.z.inlineNotification"),
    );
    const defaultInlineNotification = {
      show: true,
      kind: "warning",
      title: headerLabel,
      subtitle: contentLabel,
    };

    if (inlineNotification) {
      return inlineNotification;
    }
    localStorage.setItem(
      "com.ibm.systems.linux.z.inlineNotification",
      JSON.stringify(defaultInlineNotification),
    );
    return defaultInlineNotification;
  };
  const contentClassName = state.isHelpPanelExpanded
    ? "app__full-height"
    : "app__full-height__collapsed";

  window.addEventListener("beforeunload", (event) => {
    if (state.isDirty) {
      event.returnValue = t("browserPrompt.reloadWarning");
    }
  });

  return (
    <>
      <InstallerHeader
        showNotification={state.showNotification}
        onShowNotification={showNotification}
        onShowHelpPanel={showHelpPanel}
        onProgress={setStep}
        progressStep={step}
        progressStepComplete={progressStepComplete}
        progressStepInvalid={progressStepInvalid}
        progressStepDisabled={progressStepDisabled}
        helpContent={helpContentMarkup}
      />
      <Modal
        open={state.showConfirmationModal}
        passiveModal
        onRequestClose={() => {
          updateShowConfirmationModal(false);
        }}
        modalHeading={t("modalHeading.localStorageHasBeenPrunedConfirmation")}
      ></Modal>
      <Modal
        preventCloseOnClickOutside
        open={state.showUseExistingSettingsModal}
        modalHeading={t("modalHeading.useExistingSettingsPrompt")}
        modalLabel={t("modalLabel.useExistingSettingsPrompt")}
        primaryButtonText={t("btnLabel.Yes", { ns: "common" })}
        secondaryButtonText={t("btnLabel.No", { ns: "common" })}
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
      <Content className={contentClassName}>
        <Routes>
          <Route
            exact={true}
            path={import.meta.env.VITE_URL_PATH_PREFIX}
            element={
              <LandingPage
                panelMarkup={panelMarkup}
                inlineNotification={getInlineNotification()}
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
