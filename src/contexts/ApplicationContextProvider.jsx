/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  PANEL_DOWNLOAD_PARAM_FILE,
  PANEL_INFORMATION,
  PANEL_INPUT_FILE_SELECTION,
  PANEL_INSTALLATION_PARAMETERS,
  PANEL_NETWORK_ADDRESS,
  PANEL_NETWORK_DEVICE,
  PANEL_SUMMARY,
  PANEL_INTRO,
  PANEL_LANDING_PAGE,
  PANEL_UNKNOWN,
} from "../util/panel-constants";
import {
  ACTION_UPDATE_APP_STATE,
  ACTION_UPDATE_APP_STEP,
  ACTION_UPDATE_APP_HELP_STEP,
  ACTION_UPDATE_APP_NEXT_STEP,
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
  ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
  ACTION_UPDATE_APP_SHOW_LEGAL_NOTIFICATION,
  ACTION_UPDATE_APP_CAN_RENDER_STEP,
  ACTION_UPDATE_APP_USE_STATE_FROM_LOCAL_STORAGE,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_EDITING,
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_IS_DISABLED,
} from "../util/reducer-action-constants";
import { ADDRESS_TYPE_IPV4, DEFAULT_STEPS } from "../util/constants";
import { getLocalStorageKeys, pruneSettings } from "../util/local-storage-util";
import { ApplicationContext } from ".";

import reducer from "../reducers/AppReducer";
import createInitialState from "../states/AppState";

const ApplicationContextProvider = ({ value, children }) => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, createInitialState());

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialState(true),
    });
  };

  const updateState = (state) => {
    dispatch({
      type: ACTION_UPDATE_APP_STATE,
      nextState: state,
    });
  };

  const updateStep = (step) => {
    dispatch({
      type: ACTION_UPDATE_APP_STEP,
      nextStep: step,
    });
  };

  const updateCurrentHelpStep = (step) => {
    dispatch({
      type: ACTION_UPDATE_APP_HELP_STEP,
      nextHelpStep: step,
    });
  };

  const updateNextStep = (nextStep) => {
    dispatch({
      type: ACTION_UPDATE_APP_NEXT_STEP,
      nextNextStep: nextStep,
    });
  };

  const updateParamFileContent = (paramFileContent) => {
    dispatch({
      type: ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
      nextParamFileContent: paramFileContent,
    });
  };

  const updateModified = (updateModified) => {
    dispatch({
      type: ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
      nextParamFileContentModified: updateModified,
    });
  };

  const updateShowLegalNotification = (showLegalNotification) => {
    dispatch({
      type: ACTION_UPDATE_APP_SHOW_LEGAL_NOTIFICATION,
      nextShowLegalNotification: showLegalNotification,
    });
  };

  const updateCanRenderStep = (canRenderStep) => {
    dispatch({
      type: ACTION_UPDATE_APP_CAN_RENDER_STEP,
      nextCanRenderStep: canRenderStep,
    });
  };

  const updateUseStateFromLocalStorage = (flag) => {
    dispatch({
      type: ACTION_UPDATE_APP_USE_STATE_FROM_LOCAL_STORAGE,
      nextUseStateFromLocalStorage: flag,
    });
  };

  const updateIsDirty = (flag) => {
    dispatch({
      type: ACTION_UPDATE_APP_IS_DIRTY,
      nextIsDirty: flag,
    });
  };

  const updateIsEditing = (flag) => {
    dispatch({
      type: ACTION_UPDATE_APP_IS_EDITING,
      nextIsEditing: false,
    });
  };

  const updateSteps = (steps) => {
    dispatch({
      type: ACTION_UPDATE_APP_STEPS,
      nextSteps: steps,
    });
  };

  const updateIsDisabled = (steps) => {
    dispatch({
      type: ACTION_UPDATE_APP_IS_DISABLED,
      nextSteps: steps,
    });
  };

  const getHelpPanelConfig = ({ step }) => {
    let config;

    switch (step) {
      case 0:
        config = {
          forPanel: PANEL_INPUT_FILE_SELECTION,
          params: {
            hasMultipleSteps: false,
            currentHelpStep: state.helpStep,
            updateCurrentHelpStep,
          },
        };
        break;
      case 1:
        config = {
          forPanel: PANEL_INFORMATION,
          params: {
            hasMultipleSteps: false,
            currentHelpStep: state.helpStep,
            updateCurrentHelpStep,
          },
        };
        break;
      case 3:
        config = {
          forPanel: PANEL_NETWORK_DEVICE,
          params: {
            hasMultipleSteps: false,
            currentHelpStep: state.helpStep,
            updateCurrentHelpStep,
          },
        };
        break;
      case 4:
        config = {
          forPanel: PANEL_NETWORK_ADDRESS,
          params: {
            hasMultipleSteps: false,
            currentHelpStep: state.helpStep,
            updateCurrentHelpStep,
          },
        };
        break;
      case 5:
        config = {
          forPanel: PANEL_INSTALLATION_PARAMETERS,
          params: {
            hasMultipleSteps: false,
            currentHelpStep: state.helpStep,
            updateCurrentHelpStep,
          },
        };
        break;
      case 6:
        config = {
          forPanel: PANEL_DOWNLOAD_PARAM_FILE,
          params: {
            hasMultipleSteps: false,
            currentHelpStep: state.helpStep,
            updateCurrentHelpStep,
          },
        };
        break;
      case 8:
        config = {
          forPanel: PANEL_SUMMARY,
          params: {
            hasMultipleSteps: false,
            currentHelpStep: state.helpStep,
            updateCurrentHelpStep,
          },
        };
        break;
      case 9:
        config = {
          forPanel: PANEL_LANDING_PAGE,
          params: {
            hasMultipleSteps: false,
            currentHelpStep: state.helpStep,
            updateCurrentHelpStep,
          },
        };
        break;
      case 10:
        config = {
          forPanel: PANEL_INTRO,
          params: {
            hasMultipleSteps: false,
            currentHelpStep: state.helpStep,
            updateCurrentHelpStep,
          },
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
          params: {
            systemRequirements: state.steps.inputFileSelection.distributionName
              ? state.steps.inputFileSelection.systemRequirements[
                  state.steps.inputFileSelection.distributionName
                ]
              : {},
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
      case 3:
        config = {
          panel: PANEL_NETWORK_DEVICE,
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
        };
        break;
      case 6:
        config = {
          panel: PANEL_DOWNLOAD_PARAM_FILE,
          params: {
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
        };
        break;
      case 8:
        config = {
          panel: PANEL_SUMMARY,
          params: {
            disableSubmit: !state.steps.summary.complete,
            invalid: state.steps.summary.invalid,
            title: t("leftNavigation.progressStep.summary.label"),
            subtitle: t("leftNavigation.progressStep.summary.secondaryLabel"),
            index: state.steps.summary.index,
            includeStep: true,
            introStep: false,
          },
        };
        break;
      case 10:
        config = {
          panel: PANEL_INTRO,
          params: {
            disableSubmit: !state.steps.intro.complete,
            invalid: state.steps.intro.invalid,
            title: t("modalHeading.useExistingSettingsPrompt"),
            subtitle: t("modalBody.useExistingSettingsPrompt"),
            index: state.steps.intro.index,
            includeStep: state.useStateFromLocalStorage,
            introStep: true,
          },
        };
        break;
      default:
        config = {
          panel: PANEL_UNKNOWN,
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
      getPanelConfig({ step: state.steps.networkDevice.index }),
      getPanelConfig({ step: state.steps.networkAddress.index }),
      getPanelConfig({
        step: state.steps.installationParameters.index,
      }),
      getPanelConfig({ step: state.steps.downloadParamFile.index }),
      getPanelConfig({ step: state.steps.summary.index }),
    ];
  };

  const panelConfigArray = getPanelConfigArray();

  const resetToInitialState = useCallback(() => {
    pruneSettings(getLocalStorageKeys(state));

    updateResetToInitialState();

    updateSteps(DEFAULT_STEPS);
    if (!state.isEditing) {
      updateUseStateFromLocalStorage(false);
    }
  }, [
    state,
    pruneSettings,
    getLocalStorageKeys,
    updateResetToInitialState,
    updateSteps,
    updateUseStateFromLocalStorage,
  ]);

  const getContextValue = useCallback(
    () => ({
      ...value,
      state,
      updateState,
      updateStep,
      updateNextStep,
      updateCurrentHelpStep,
      updateParamFileContent,
      updateModified,
      updateShowLegalNotification,
      updateCanRenderStep,
      updateUseStateFromLocalStorage,
      updateIsDirty,
      updateIsEditing,
      updateSteps,
      updateIsDisabled,
      resetToInitialState,
      config: {
        panelConfig: panelConfigArray,
        helpPanelConfig: getHelpPanelConfig({ step: state.step }),
      },
    }),
    [
      value,
      state,
      updateState,
      updateStep,
      updateNextStep,
      updateCurrentHelpStep,
      updateParamFileContent,
      updateModified,
      updateShowLegalNotification,
      updateCanRenderStep,
      updateUseStateFromLocalStorage,
      updateIsDirty,
      updateIsEditing,
      updateSteps,
      updateIsDisabled,
      resetToInitialState,
      panelConfigArray,
      getHelpPanelConfig,
    ],
  );

  return (
    <ApplicationContext.Provider value={getContextValue()}>
      {children}
    </ApplicationContext.Provider>
  );
};

ApplicationContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default ApplicationContextProvider;
