/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useReducer, createContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Content,
  ComposedModal,
  ModalFooter,
  ModalBody,
  ModalHeader,
} from "@carbon/react";
import { Routes, Route } from "react-router-dom";
import InstallerHeader from "./components/InstallerHeader";
import { stateToParamFile } from "./util/param-file-util";

import reducer from "./reducers/AppReducer";
import downloadParamFileReducer from "./reducers/DownloadParamFileReducer";
import hintReducer from "./reducers/HintReducer";
import informationReducer from "./reducers/InformationReducer";
import inputFileSelectionReducer from "./reducers/InputFileSelectionReducer";
import installationParameterReducer from "./reducers/InstallationParameterReducer";
import networkAddressReducer from "./reducers/NetworkAddressReducer";
import networkDeviceReducer from "./reducers/NetworkDeviceReducer";
import nextStepsReducer from "./reducers/NextStepsReducer";

import createInitialState from "./states/AppState";
import { createInitialState as createInitialDownloadParamFileState } from "./states/DownloadParamFileState";
import { createInitialState as createInitialHintState } from "./states/HintState";
import { createInitialState as createInitialInformationState } from "./states/InformationState";
import { createInitialState as createInitialInputFileSelectionState } from "./states/InputFileSelectionState";
import { createInitialState as createInitialInstallationParameterState } from "./states/InstallationParameterState";
import { createInitialState as createInitialNetworkAddressState } from "./states/NetworkAddressState";
import { createInitialState as createInitialNetworkDeviceState } from "./states/NetworkDeviceState";
import { createInitialState as createInitialNetxtStepsState } from "./states/NextStepsState";

import {
  ADDRESS_TYPE_IPV4,
  ACTION_UPDATE_APP_STATE,
  ACTION_UPDATE_APP_STEP,
  ACTION_UPDATE_APP_NEXT_STEP,
  ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
  ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
  ACTION_UPDATE_APP_SHOW_NOTIFICATION,
  ACTION_UPDATE_APP_HELP_PANEL_EXPANDED,
  ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL,
  ACTION_UPDATE_APP_SHOW_USE_EXISTING_SETTINGS_MODAL,
  ACTION_UPDATE_APP_SHOW_DISCARD_MODIFIED_PARAM_FILE_CONTENTS_MODAL,
  ACTION_UPDATE_APP_USE_EXISTING_SETTINGS_MODAL_OPENED,
  ACTION_UPDATE_APP_CAN_RENDER_STEP,
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_PARAM_FILE_CONTENT,
  ACTION_UPDATE_PARAM_FILE_MODIFIED,
  PANEL_DOWNLOAD_PARAM_FILE,
  PANEL_HINT,
  PANEL_INFORMATION,
  PANEL_INPUT_FILE_SELECTION,
  PANEL_INSTALLATION_PARAMETERS,
  PANEL_NETWORK_ADDRESS,
  PANEL_NETWORK_DEVICE,
  PANEL_NEXT_STEPS,
  PANEL_UNKNOWN,
  LOCAL_STORAGE_KEY_APP,
  LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
} from "./util/constants";
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

const ApplicationContext = createContext({
  state: null,
  dispatch: null,
});

const App = () => {
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(reducer, createInitialState());
  const [downloadParamFileState, downloadParamFileDispatch] = useReducer(
    downloadParamFileReducer,
    createInitialDownloadParamFileState(),
  );
  const [hintState, hintDispatch] = useReducer(
    hintReducer,
    createInitialHintState(),
  );
  const [informationState, informationDispatch] = useReducer(
    informationReducer,
    createInitialInformationState(),
  );
  const [inputFileSelectionState, inputFileSelectionDispatch] = useReducer(
    inputFileSelectionReducer,
    createInitialInputFileSelectionState(),
  );
  const [installationParameterState, installationParameterDispatch] =
    useReducer(
      installationParameterReducer,
      createInitialInstallationParameterState(),
    );
  const [networkAddressState, networkAddressDispatch] = useReducer(
    networkAddressReducer,
    createInitialNetworkAddressState(),
  );
  const [networkDeviceState, networkDeviceDispatch] = useReducer(
    networkDeviceReducer,
    createInitialNetworkDeviceState(),
  );
  const [nextStepsState, nextStepsDispatch] = useReducer(
    nextStepsReducer,
    createInitialNetxtStepsState(),
  );

  const resetToInitialState = () => {
    downloadParamFileDispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialDownloadParamFileState(),
    });
    hintDispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialHintState(),
    });
    informationDispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialInformationState(),
    });
    inputFileSelectionDispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialInputFileSelectionState(),
    });
    installationParameterDispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialInstallationParameterState(),
    });
    networkAddressDispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialNetworkAddressState(),
    });
    networkDeviceDispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialNetworkDeviceState(),
    });
    nextStepsDispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialNetxtStepsState(),
    });
  };

  const getHelpPanelConfig = ({ step }) => {
    let config;

    switch (step) {
      case 0:
        config = {
          forPanel: PANEL_INPUT_FILE_SELECTION,
        };
        break;
      case 1:
        config = {
          forPanel: PANEL_INFORMATION,
        };
        break;
      case 2:
        config = {
          forPanel: PANEL_HINT,
        };
        break;
      case 3:
        config = {
          forPanel: PANEL_NETWORK_DEVICE,
        };
        break;
      case 4:
        config = {
          forPanel: PANEL_NETWORK_ADDRESS,
        };
        break;
      case 5:
        config = {
          forPanel: PANEL_INSTALLATION_PARAMETERS,
        };
        break;
      case 6:
        config = {
          forPanel: PANEL_DOWNLOAD_PARAM_FILE,
        };
        break;
      case 7:
        config = {
          forPanel: PANEL_NEXT_STEPS,
        };
        break;
      default:
        config = <div>Help content not yet implemented.</div>;
    }

    return config;
  };

  const getPanelConfig = ({ step, setStep }) => {
    let config;

    switch (step) {
      case 0:
        config = {
          panel: PANEL_INPUT_FILE_SELECTION,
          state: inputFileSelectionState,
          dispatch: inputFileSelectionDispatch,
        };
        break;
      case 1:
        config = {
          panel: PANEL_INFORMATION,
          dispatch: informationDispatch,
          state: informationState,
          params: {
            systemRequirements: {
              disk: state.steps.inputFileSelection.diskSize,
              memory: state.steps.inputFileSelection.memorySize,
              level: state.steps.inputFileSelection.machineLevel,
            },
            distribution: {
              name: state.steps.inputFileSelection.distributionName,
              version: state.steps.inputFileSelection.distributionVersion,
            },
            docLink: state.steps.inputFileSelection.docLink,
          },
        };
        break;
      case 2:
        config = {
          panel: PANEL_HINT,
          dispatch: hintDispatch,
          state: hintState,
        };
        break;
      case 3:
        config = {
          panel: PANEL_NETWORK_DEVICE,
          dispatch: networkDeviceDispatch,
          state: networkDeviceState,
        };
        break;
      case 4:
        config = {
          panel: PANEL_NETWORK_ADDRESS,
          dispatch: networkAddressDispatch,
          state: networkAddressState,
        };
        break;
      case 5:
        config = {
          panel: PANEL_INSTALLATION_PARAMETERS,
          state: installationParameterState,
          params: {
            ipAddressVersion:
              state?.steps?.networkAddress?.addressType ?? ADDRESS_TYPE_IPV4,
          },
          dispatch: installationParameterDispatch,
        };
        break;
      case 6:
        config = {
          panel: PANEL_DOWNLOAD_PARAM_FILE,
          params: {
            setStep,
            stateToParamFile,
          },
          dispatch: downloadParamFileDispatch,
          state: downloadParamFileState,
        };
        break;
      case 7:
        config = {
          panel: PANEL_NEXT_STEPS,
          state: nextStepsState,
          params: {
            useSsh: state.steps.installationParameters.ssh.enabled,
            useVnc: state.steps.installationParameters.vnc.enabled,
            networkAddress:
              state.steps.networkAddress.addressType === ADDRESS_TYPE_IPV4
                ? state.steps.networkAddress.ipv4.address
                : state.steps.networkAddress.ipv6.address,
            vncPassword: state.steps.installationParameters.vnc.password,
          },
          dispatch: nextStepsDispatch,
        };
        break;
      default:
        config = {
          panel: PANEL_UNKNOWN,
          dispatch: null,
          state: null,
        };
    }

    return config;
  };

  const updateShowNotification = (showNotification) => {
    dispatch({
      type: ACTION_UPDATE_APP_SHOW_NOTIFICATION,
      nextShowNotification: showNotification,
    });
  };
  const updateIsHelpPanelExpanded = (isHelpPanelExpanded) => {
    dispatch({
      type: ACTION_UPDATE_APP_HELP_PANEL_EXPANDED,
      nextIsHelpPanelExpanded: isHelpPanelExpanded,
    });
  };
  const updateShowConfirmationModal = (showConfirmationModal) => {
    dispatch({
      type: ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL,
      nextShowConfirmationModal: showConfirmationModal,
    });
  };
  const updateShowUseExistingSettingsModal = (showUseExistingSettingsModal) => {
    dispatch({
      type: ACTION_UPDATE_APP_SHOW_USE_EXISTING_SETTINGS_MODAL,
      nextShowUseExistingSettingsModal: showUseExistingSettingsModal,
    });
  };
  const updateUseExistingSettingsModalOpened = (
    useExistingSettingsModalOpened,
  ) => {
    dispatch({
      type: ACTION_UPDATE_APP_USE_EXISTING_SETTINGS_MODAL_OPENED,
      nextUseExistingSettingsModalOpened: useExistingSettingsModalOpened,
    });
  };
  const updateShowDiscardModifiedParamFileContentsModal = (
    showDiscardModifiedParamFileContentsModal,
  ) => {
    dispatch({
      type: ACTION_UPDATE_APP_SHOW_DISCARD_MODIFIED_PARAM_FILE_CONTENTS_MODAL,
      nextShowDiscardModifiedParamFileContentsModal:
        showDiscardModifiedParamFileContentsModal,
    });
  };
  const updateCanRenderStep = (canRenderStep) => {
    dispatch({
      type: ACTION_UPDATE_APP_CAN_RENDER_STEP,
      nextCanRenderStep: canRenderStep,
    });
  };
  const updateNextStep = (nextStep) => {
    dispatch({
      type: ACTION_UPDATE_APP_NEXT_STEP,
      nextNextStep: nextStep,
    });
  };
  const updateStep = (step, paramFileHasBeenModified, canRenderStep) => {
    const paramsOriginateFromFrunction =
      typeof paramFileHasBeenModified === "boolean" &&
      typeof canRenderStep === "boolean";

    const paramFileHasBeenModifiedFromState =
      state?.steps.downloadParamFile?.modified ?? false;
    const canRenderStepFromState = state?.canRenderStep ?? false;
    const currentStep = state?.step;

    if (step >= currentStep) {
      dispatch({
        type: ACTION_UPDATE_APP_STEP,
        nextStep: step,
      });
    } else if (paramsOriginateFromFrunction && paramFileHasBeenModified) {
      updateShowDiscardModifiedParamFileContentsModal(true);
      updateNextStep(step);
    } else if (paramsOriginateFromFrunction && canRenderStep) {
      dispatch({
        type: ACTION_UPDATE_APP_STEP,
        nextStep: step,
      });
    } else if (
      !paramsOriginateFromFrunction &&
      paramFileHasBeenModifiedFromState
    ) {
      updateShowDiscardModifiedParamFileContentsModal(true);
      updateNextStep(step);
    } else if (!paramsOriginateFromFrunction && canRenderStepFromState) {
      dispatch({
        type: ACTION_UPDATE_APP_STEP,
        nextStep: step,
      });
    }
  };
  const updateParamFileContent = (paramFileContent) => {
    downloadParamFileDispatch({
      type: ACTION_UPDATE_PARAM_FILE_CONTENT,
      nextParamFileContent: paramFileContent,
    });
    dispatch({
      type: ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
      nextParamFileContent: paramFileContent,
    });
  };
  const updateModified = (updateModified) => {
    dispatch({
      type: ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
      paramFileContentModified: updateModified,
    });
    downloadParamFileDispatch({
      type: ACTION_UPDATE_PARAM_FILE_MODIFIED,
      paramFileContentModified: updateModified,
    });
  };
  const resetParamFileTextAreaData = () => {
    const localParamFileContentValue = stateToParamFile(state);

    updateParamFileContent(localParamFileContentValue.data);
    updateModified(false);
  };
  const updateState = (state) => {
    dispatch({
      type: ACTION_UPDATE_APP_STATE,
      nextState: state,
    });
  };
  const helpPanelConfig = getHelpPanelConfig({ step: state.step });
  const panelConfig = getPanelConfig({
    step: state.step,
    setStep: updateStep,
  });
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
      localStorage.getItem(LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION),
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
      LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
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

  const modalMarkup = (
    <>
      <ComposedModal
        preventCloseOnClickOutside
        open={state.showConfirmationModal}
      >
        <ModalHeader
          label={t("modalLabel.manageSettings")}
          title={t("modalHeading.localStorageHasBeenPrunedConfirmation")}
        />
        <ModalBody>
          <p>{t("modalBody.localStorageHasBeenPrunedConfirmation")}</p>
        </ModalBody>
        <ModalFooter
          onRequestClose={() => {
            updateShowConfirmationModal(false);
          }}
          onRequestSubmit={() => {
            updateShowConfirmationModal(false);
          }}
          primaryButtonText={t("btnLabel.OK", { ns: "common" })}
        />
      </ComposedModal>
      <Modal
        preventCloseOnClickOutside
        open={state.showUseExistingSettingsModal}
        modalHeading={t("modalHeading.useExistingSettingsPrompt")}
        modalLabel={t("modalLabel.manageSettings")}
        primaryButtonText={t("btnLabel.Yes", { ns: "common" })}
        secondaryButtonText={t("btnLabel.No", { ns: "common" })}
        onRequestSubmit={() => {
          updateState(createInitialState(true));
          updateShowUseExistingSettingsModal(false);
          updateUseExistingSettingsModalOpened(true);
        }}
        onSecondarySubmit={() => {
          const localStorageKeys = getLocalStorageKeys();
          let i;
          for (i = 0; i < localStorageKeys.length; i++) {
            localStorage.removeItem(localStorageKeys[i]);
          }
          localStorage.removeItem(LOCAL_STORAGE_KEY_APP);
          resetToInitialState();
          updateShowUseExistingSettingsModal(false);
          updateUseExistingSettingsModalOpened(true);
        }}
        onRequestClose={() => {
          updateShowUseExistingSettingsModal(false);
          updateUseExistingSettingsModalOpened(true);
        }}
      >
        <p>{t("modalBody.useExistingSettingsPrompt")}</p>
      </Modal>
      <Modal
        preventCloseOnClickOutside
        open={state.showDiscardModifiedParamFileContentsModal}
        modalHeading={t("modalHeading.discardParamFileModificationsPrompt")}
        modalLabel={t("modalLabel.discardParamFileModificationsPrompt")}
        primaryButtonText={t("btnLabel.Yes", { ns: "common" })}
        secondaryButtonText={t("btnLabel.No", { ns: "common" })}
        onRequestSubmit={() => {
          updateShowDiscardModifiedParamFileContentsModal(false);
          resetParamFileTextAreaData();
          updateCanRenderStep(true);
          updateStep(state.nextStep, false, true);
        }}
        onSecondarySubmit={() => {
          updateShowDiscardModifiedParamFileContentsModal(false);
          updateCanRenderStep(false);
        }}
        onRequestClose={() => {
          updateShowDiscardModifiedParamFileContentsModal(false);
          updateCanRenderStep(true);
        }}
      >
        <p>{t("modalBody.discardParamFileModificationsPrompt")}</p>
      </Modal>
    </>
  );

  return (
    <>
      <InstallerHeader
        showNotification={state.showNotification}
        onShowNotification={showNotification}
        onShowHelpPanel={showHelpPanel}
        onProgress={updateStep}
        progressStep={state.step}
        progressStepComplete={progressStepComplete}
        progressStepInvalid={progressStepInvalid}
        progressStepDisabled={progressStepDisabled}
        helpPanelConfig={helpPanelConfig}
      />
      {modalMarkup}
      <Content className={contentClassName}>
        <Routes>
          <Route
            exact={true}
            path={import.meta.env.VITE_URL_PATH_PREFIX}
            element={
              <ApplicationContext.Provider value={{ state, dispatch }}>
                <LandingPage
                  panelConfig={panelConfig}
                  inlineNotification={getInlineNotification()}
                  showNotification={state.showNotification || false}
                  closeNotification={closeNotification}
                  localStorageKeys={getLocalStorageKeys()}
                />
              </ApplicationContext.Provider>
            }
          />
        </Routes>
      </Content>
    </>
  );
};

export default App;
export { ApplicationContext };
