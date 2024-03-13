/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023, 2024
 */

import React, { useReducer, createContext } from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  Accordion,
  AccordionItem,
  Modal,
  Content,
  ComposedModal,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Layer,
  UnorderedList,
  ListItem,
  InlineNotification,
} from "@carbon/react";
import { Routes, Route } from "react-router-dom";
import InstallerHeader from "./components/InstallerHeader";
import { stateToParamFile } from "./util/param-file-util";
import { getLabel, getContent } from "./uiUtil/help-util";
import { getLocalStorageKeys } from "./util/local-storage-util";

import reducer from "./reducers/AppReducer";
import downloadParamFileReducer from "./reducers/DownloadParamFileReducer";
import hintReducer from "./reducers/HintReducer";
import informationReducer from "./reducers/InformationReducer";
import inputFileSelectionReducer from "./reducers/InputFileSelectionReducer";
import installationParameterReducer from "./reducers/InstallationParameterReducer";
import networkAddressReducer from "./reducers/NetworkAddressReducer";
import networkDeviceReducer from "./reducers/NetworkDeviceReducer";
import nextStepsReducer from "./reducers/NextStepsReducer";
import summaryReducer from "./reducers/SummaryReducer";
import introReducer from "./reducers/IntroReducer";

import createInitialState from "./states/AppState";
import { createInitialState as createInitialDownloadParamFileState } from "./states/DownloadParamFileState";
import { createInitialState as createInitialHintState } from "./states/HintState";
import { createInitialState as createInitialInformationState } from "./states/InformationState";
import { createInitialState as createInitialInputFileSelectionState } from "./states/InputFileSelectionState";
import { createInitialState as createInitialInstallationParameterState } from "./states/InstallationParameterState";
import { createInitialState as createInitialNetworkAddressState } from "./states/NetworkAddressState";
import { createInitialState as createInitialNetworkDeviceState } from "./states/NetworkDeviceState";
import { createInitialState as createInitialNextStepsState } from "./states/NextStepsState";
import { createInitialState as createInitialSummaryState } from "./states/SummaryState";
import { createInitialState as createInitialIntroState } from "./states/IntroState";

import {
  ADDRESS_TYPE_IPV4,
  ACTION_UPDATE_APP_STEP,
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_NEXT_STEP,
  ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
  ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
  ACTION_UPDATE_APP_SHOW_NOTIFICATION,
  ACTION_UPDATE_APP_HELP_PANEL_EXPANDED,
  ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL,
  ACTION_UPDATE_APP_SHOW_NEXT_STEP_INFORMATION_MODAL,
  ACTION_UPDATE_APP_SHOW_SYSTEM_REQUIREMENT_INFORMATION_MODAL,
  ACTION_UPDATE_APP_SHOW_DISCARD_MODIFIED_PARAM_FILE_CONTENTS_MODAL,
  ACTION_UPDATE_APP_USE_STATE_FROM_LOCAL_STORAGE,
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
  PANEL_SUMMARY,
  PANEL_INTRO,
  PANEL_LANDING_PAGE,
  PANEL_UNKNOWN,
  DEFAULT_STEPS,
} from "./util/constants";
import LandingPage from "./content/LandingPage";
import EditPage from "./content/EditPage";
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
      summary: state.steps.summary[forProgressStepState],
      intro: state.steps.intro[forProgressStepState],
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
    createInitialNextStepsState(),
  );
  const [summaryState, summaryDispatch] = useReducer(
    summaryReducer,
    createInitialSummaryState(),
  );
  const [introState, introDispatch] = useReducer(
    introReducer,
    createInitialIntroState(),
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
      nextInitialState: createInitialNextStepsState(),
    });
    summaryDispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialSummaryState(),
    });
    dispatch({
      type: ACTION_UPDATE_APP_STEPS,
      nextSteps: DEFAULT_STEPS,
    });
    dispatch({
      type: ACTION_UPDATE_APP_USE_STATE_FROM_LOCAL_STORAGE,
      nextUseStateFromLocalStorage: false,
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
      case 8:
        config = {
          forPanel: PANEL_SUMMARY,
        };
        break;
      case 9:
        config = {
          forPanel: PANEL_LANDING_PAGE,
        };
        break;
      case 10:
        config = {
          forPanel: PANEL_INTRO,
        };
        break;
      default:
        config = <div>Help content not yet implemented.</div>;
    }

    return config;
  };

  const getPanelConfig = ({ step }) => {
    let config;

    switch (step) {
      case 0:
        config = {
          panel: PANEL_INPUT_FILE_SELECTION,
          state: inputFileSelectionState,
          dispatch: inputFileSelectionDispatch,
          params: {
            disableSubmit: !state.steps.inputFileSelection.complete,
            invalid: state.steps.inputFileSelection.invalid,
            title: t("leftNavigation.progressStep.inputFileSelection.label"),
            subtitle: t(
              "leftNavigation.progressStep.inputFileSelection.secondaryLabel",
            ),
            index: state.steps.inputFileSelection.index,
            includeStep: true,
            introStep: false,
          },
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
            disableSubmit: !state.steps.information.complete,
            invalid: state.steps.information.invalid,
            title: t("leftNavigation.progressStep.information.label"),
            subtitle: t(
              "leftNavigation.progressStep.information.secondaryLabel",
            ),
            index: state.steps.information.index,
            includeStep: true,
            introStep: false,
          },
        };
        break;
      case 2:
        config = {
          panel: PANEL_HINT,
          dispatch: hintDispatch,
          state: hintState,
          params: {
            disableSubmit: !state.steps.hint.complete,
            invalid: state.steps.hint.invalid,
            title: t("leftNavigation.progressStep.hint.label"),
            subtitle: t("leftNavigation.progressStep.hint.secondaryLabel"),
            index: state.steps.hint.index,
            includeStep: false,
            introStep: false,
          },
        };
        break;
      case 3:
        config = {
          panel: PANEL_NETWORK_DEVICE,
          dispatch: networkDeviceDispatch,
          state: networkDeviceState,
          params: {
            disableSubmit: !state.steps.networkDevice.complete,
            invalid: state.steps.networkDevice.invalid,
            title: t("leftNavigation.progressStep.networkDevice.label"),
            subtitle: t(
              "leftNavigation.progressStep.networkDevice.secondaryLabel",
            ),
            index: state.steps.networkDevice.index,
            includeStep: true,
            introStep: false,
          },
        };
        break;
      case 4:
        config = {
          panel: PANEL_NETWORK_ADDRESS,
          dispatch: networkAddressDispatch,
          state: networkAddressState,
          params: {
            disableSubmit: !state.steps.networkAddress.complete,
            invalid: state.steps.networkAddress.invalid,
            title: t("leftNavigation.progressStep.networkAddress.label"),
            subtitle: t(
              "leftNavigation.progressStep.networkAddress.secondaryLabel",
            ),
            index: state.steps.networkAddress.index,
            includeStep: true,
            introStep: false,
          },
        };
        break;
      case 5:
        config = {
          panel: PANEL_INSTALLATION_PARAMETERS,
          state: installationParameterState,
          params: {
            ipAddressVersion:
              state?.steps?.networkAddress?.addressType ?? ADDRESS_TYPE_IPV4,
            disableSubmit: !state.steps.installationParameters.complete,
            invalid: state.steps.installationParameters.invalid,
            title: t(
              "leftNavigation.progressStep.installationParameters.label",
            ),
            subtitle: t(
              "leftNavigation.progressStep.installationParameters.secondaryLabel",
            ),
            index: state.steps.installationParameters.index,
            includeStep: true,
            introStep: false,
          },
          dispatch: installationParameterDispatch,
        };
        break;
      case 6:
        config = {
          panel: PANEL_DOWNLOAD_PARAM_FILE,
          params: {
            stateToParamFile,
            disableSubmit: !state.steps.downloadParamFile.complete,
            invalid: state.steps.downloadParamFile.invalid,
            title: t("leftNavigation.progressStep.downloadParamFile.label"),
            subtitle: t(
              "leftNavigation.progressStep.downloadParamFile.secondaryLabel",
            ),
            index: state.steps.downloadParamFile.index,
            includeStep: true,
            introStep: false,
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
            disableSubmit: !state.steps.nextSteps.complete,
            invalid: state.steps.nextSteps.invalid,
            title: t("leftNavigation.progressStep.nextSteps.label"),
            subtitle: t("leftNavigation.progressStep.nextSteps.secondaryLabel"),
            index: state.steps.nextSteps.index,
            includeStep: false,
            introStep: false,
          },
          dispatch: nextStepsDispatch,
        };
        break;
      case 8:
        config = {
          panel: PANEL_SUMMARY,
          state: summaryState,
          params: {
            disableSubmit: !state.steps.summary.complete,
            invalid: state.steps.summary.invalid,
            title: t("leftNavigation.progressStep.summary.label"),
            subtitle: t("leftNavigation.progressStep.summary.secondaryLabel"),
            index: state.steps.summary.index,
            includeStep: true,
            introStep: false,
          },
          dispatch: summaryDispatch,
        };
        break;
      case 10:
        config = {
          panel: PANEL_INTRO,
          state: introState,
          params: {
            disableSubmit: !state.steps.intro.complete,
            invalid: state.steps.intro.invalid,
            title: t("modalHeading.useExistingSettingsPrompt"),
            subtitle: t("modalBody.useExistingSettingsPrompt"),
            index: state.steps.intro.index,
            includeStep: state.isEditing && state.useStateFromLocalStorage,
            introStep: true,
            resetToInitialState,
            localStorageKeys: getLocalStorageKeys(state),
          },
          dispatch: introDispatch,
        };
        break;
      default:
        config = {
          panel: PANEL_UNKNOWN,
          dispatch: null,
          state: null,
          params: null,
        };
    }

    return config;
  };

  const getPanelConfigArray = () => {
    return [
      getPanelConfig({ step: state.steps.intro.index }),
      getPanelConfig({ step: state.steps.inputFileSelection.index }),
      getPanelConfig({ step: state.steps.information.index }),
      getPanelConfig({ step: state.steps.hint.index }),
      getPanelConfig({ step: state.steps.networkDevice.index }),
      getPanelConfig({ step: state.steps.networkAddress.index }),
      getPanelConfig({
        step: state.steps.installationParameters.index,
      }),
      getPanelConfig({ step: state.steps.downloadParamFile.index }),
      getPanelConfig({ step: state.steps.nextSteps.index }),
      getPanelConfig({ step: state.steps.summary.index }),
    ];
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
  const updateShowDiscardModifiedParamFileContentsModal = (
    showDiscardModifiedParamFileContentsModal,
  ) => {
    dispatch({
      type: ACTION_UPDATE_APP_SHOW_DISCARD_MODIFIED_PARAM_FILE_CONTENTS_MODAL,
      nextShowDiscardModifiedParamFileContentsModal:
        showDiscardModifiedParamFileContentsModal,
    });
  };
  const updateShowSystemRequirementInformationModal = (
    showSystemRequirementInformationModal,
  ) => {
    dispatch({
      type: ACTION_UPDATE_APP_SHOW_SYSTEM_REQUIREMENT_INFORMATION_MODAL,
      nextShowSystemRequirementInformationModal:
        showSystemRequirementInformationModal,
    });
  };
  const updateShowNextStepsInformationModal = (
    showNextStepsInformationModal,
  ) => {
    dispatch({
      type: ACTION_UPDATE_APP_SHOW_NEXT_STEP_INFORMATION_MODAL,
      nextShowNextStepsInformationModal: showNextStepsInformationModal,
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
  const helpPanelConfig = getHelpPanelConfig({ step: state.step });
  const panelConfigArray = getPanelConfigArray();
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
  const contentClassName = state.isHelpPanelExpanded
    ? "app__full-height"
    : "app__full-height__collapsed";

  const systemRequirementInformation = (
    <>
      <div className="hint_intro">
        {t("panel.hint.explanation", { ns: "panels" })}
      </div>
      <UnorderedList>
        <ListItem>{t("panel.hint.listItem1", { ns: "panels" })}</ListItem>
        <UnorderedList>
          <ListItem>{t("panel.hint.listItem2", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem3", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem4", { ns: "panels" })}</ListItem>
        </UnorderedList>
        <ListItem>{t("panel.hint.listItem5", { ns: "panels" })}</ListItem>
        <UnorderedList>
          <ListItem>{t("panel.hint.listItem6", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem7", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem8", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem9", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem10", { ns: "panels" })}</ListItem>
        </UnorderedList>
        <ListItem>{t("panel.hint.listItem11", { ns: "panels" })}</ListItem>
        <UnorderedList>
          <ListItem>{t("panel.hint.listItem12", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem13", { ns: "panels" })}</ListItem>
        </UnorderedList>
      </UnorderedList>
    </>
  );

  const useSsh = state.steps.installationParameters.ssh.enabled;
  const useVnc = state.steps.installationParameters.vnc.enabled;
  const networkAddress =
    state.steps.networkAddress.addressType === ADDRESS_TYPE_IPV4
      ? state.steps.networkAddress.ipv4.address
      : state.steps.networkAddress.ipv6.address;
  const vncPassword = state.steps.installationParameters.vnc.password;
  const networkAddressForListItem = networkAddress || "[host-IP-address]";
  const remoteAccessConfigIsMissing = !useSsh && !useVnc;

  const vncInstructionsMarkup = (
    <>
      <div className="next-steps_para">
        {t("panel.nextSteps.explanation2", { ns: "panels" })}
      </div>
      <UnorderedList>
        <ListItem>
          <Trans i18nKey="panel.nextSteps.listItem11" ns="panels">
            VNC host:&nbsp;
            <code className="next-steps__formatted-code">
              {{ networkAddressForListItem }}
            </code>
          </Trans>
          {!networkAddress &&
            getLabel(
              "",
              t("showInformationLabel", { ns: "common" }),
              getContent("The network address was not yet provided."),
            )}
        </ListItem>
        {vncPassword && (
          <ListItem>
            <Trans i18nKey="panel.nextSteps.listItem12" ns="panels">
              VNC password:&nbsp;
              <code className="next-steps__formatted-code">
                {{ vncPassword }}
              </code>
            </Trans>
          </ListItem>
        )}
      </UnorderedList>
    </>
  );

  const sshInstructionsMarkup = (
    <>
      <div className="next-steps_para">
        {t("panel.nextSteps.explanation3", { ns: "panels" })}
      </div>
      <UnorderedList>
        <ListItem>
          <Trans i18nKey="panel.nextSteps.listItem13" ns="panels">
            SSH host:&nbsp;
            <code className="next-steps__formatted-code">
              installer@{{ networkAddressForListItem }}
            </code>
          </Trans>
          {!networkAddress &&
            getLabel(
              "",
              t("showInformationLabel", { ns: "common" }),
              getContent("The network address was not yet provided."),
            )}
        </ListItem>
      </UnorderedList>
    </>
  );

  const missingRemoteAccessNotification = (
    <InlineNotification
      hideCloseButton
      statusIconDescription="notification"
      subtitle={t("panel.nextSteps.missingRemoteAccessNotificationSubtitle", {
        ns: "panels",
      })}
      title={t("panel.nextSteps.missingRemoteAccessNotificationTitle", {
        ns: "panels",
      })}
      kind="warning"
      className="next-steps_missing-remote-access-banner"
    />
  );

  const nextStepsInformation = (
    <>
      <div className="next-steps_para_bottom">
        {t("panel.nextSteps.explanation1", { ns: "panels" })}
      </div>
      <UnorderedList>
        <ListItem>{t("panel.nextSteps.listItem1", { ns: "panels" })}</ListItem>
        <UnorderedList>
          <ListItem>
            <Trans i18nKey="panel.nextSteps.listItem2" ns="panels">
              The&nbsp;
              <code className="next-steps__formatted-code">generic.ins</code>
              &nbsp;File
            </Trans>
          </ListItem>
          <ListItem>
            <Trans i18nKey="panel.nextSteps.listItem3" ns="panels">
              The&nbsp;
              <code className="next-steps__formatted-code">images</code>
              &nbsp;directory
            </Trans>
          </ListItem>
        </UnorderedList>
        <ListItem>
          <Trans i18nKey="panel.nextSteps.listItem4" ns="panels">
            Replace the file named&nbsp;
            <code className="next-steps__formatted-code">genericdvd.prm</code>
            &nbsp;with the parmfile contents downloaded from this application.
          </Trans>
        </ListItem>
        <ListItem>{t("panel.nextSteps.listItem5", { ns: "panels" })}</ListItem>
        <ListItem>
          <Trans i18nKey="panel.nextSteps.listItem6" ns="panels">
            Go to the&nbsp;
            <code className="next-steps__formatted-code">
              Systems Management
            </code>
            &nbsp;view for the mainframe containing the LPAR or DPM partition.
          </Trans>
        </ListItem>
        <Accordion className="next-steps__accordion">
          <AccordionItem
            title={t("panel.nextSteps.listItem14", { ns: "panels" })}
          >
            <UnorderedList>
              <ListItem>
                <Trans i18nKey="panel.nextSteps.listItem8" ns="panels">
                  Select the task&nbsp;
                  <code className="next-steps__formatted-code">
                    Recovery -&gt; Load from Removable Media or Server
                  </code>
                  .
                </Trans>
              </ListItem>
              <ListItem>
                {t("panel.nextSteps.listItem16", { ns: "panels" })}
              </ListItem>
              <ListItem>
                {t("panel.nextSteps.listItem17", { ns: "panels" })}
              </ListItem>
            </UnorderedList>
          </AccordionItem>
          <AccordionItem
            title={t("panel.nextSteps.listItem18", { ns: "panels" })}
          >
            <UnorderedList>
              <ListItem>
                {t("panel.nextSteps.listItem19", { ns: "panels" })}
              </ListItem>
              <ListItem>
                {t("panel.nextSteps.listItem20", { ns: "panels" })}
              </ListItem>
              <ListItem>
                {t("panel.nextSteps.listItem21", { ns: "panels" })}
              </ListItem>
              <ListItem>
                {t("panel.nextSteps.listItem22", { ns: "panels" })}
              </ListItem>
            </UnorderedList>
          </AccordionItem>
        </Accordion>
      </UnorderedList>
      {useVnc && vncInstructionsMarkup}
      {useSsh && sshInstructionsMarkup}
      {remoteAccessConfigIsMissing && missingRemoteAccessNotification}
    </>
  );

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
          <div>{t("modalBody.localStorageHasBeenPrunedConfirmation")}</div>
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
        <div>{t("modalBody.discardParamFileModificationsPrompt")}</div>
      </Modal>
      <Modal
        preventCloseOnClickOutside
        open={state.showSystemRequirementInformationModal}
        modalHeading={t("modalHeading.showSystemRequirementInformation")}
        modalLabel={t("modalLabel.showSystemRequirementInformation")}
        primaryButtonText={t("btnLabel.OK", { ns: "common" })}
        onRequestClose={() => {
          updateShowSystemRequirementInformationModal(false);
        }}
        onRequestSubmit={() => {
          updateShowSystemRequirementInformationModal(false);
        }}
      >
        <div>{systemRequirementInformation}</div>
      </Modal>
      <Modal
        preventCloseOnClickOutside
        open={state.showNextStepsInformationModal}
        modalHeading={t("modalHeading.showNextStepsInformation")}
        modalLabel={t("modalLabel.showNextStepsInformation")}
        primaryButtonText={t("btnLabel.OK", { ns: "common" })}
        onRequestClose={() => {
          updateShowNextStepsInformationModal(false);
        }}
        onRequestSubmit={() => {
          updateShowNextStepsInformationModal(false);
        }}
      >
        <div>{nextStepsInformation}</div>
      </Modal>
    </>
  );

  return (
    <>
      <Layer className="app__layer">
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
              exact
              path="/"
              element={
                <ApplicationContext.Provider
                  value={{ state, dispatch, downloadParamFileDispatch }}
                >
                  <LandingPage
                    showNotification={state.showNotification || false}
                    closeNotification={closeNotification}
                    resetToInitialState={resetToInitialState}
                  />
                </ApplicationContext.Provider>
              }
            />
            <Route
              path="/edit"
              element={
                <ApplicationContext.Provider
                  value={{ state, dispatch, downloadParamFileDispatch }}
                >
                  <EditPage
                    panelConfig={panelConfigArray}
                    showNotification={state.showNotification || false}
                    closeNotification={closeNotification}
                    resetToInitialState={resetToInitialState}
                  />
                </ApplicationContext.Provider>
              }
            />
          </Routes>
        </Content>
      </Layer>
    </>
  );
};

export default App;
export { ApplicationContext };
