/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  ACTION_UPDATE_APP_STATE,
  ACTION_UPDATE_APP_STEP,
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_NEXT_STEP,
  ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
  ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
  ACTION_UPDATE_APP_SHOW_NOTIFICATION,
  ACTION_UPDATE_APP_HELP_PANEL_EXPANDED,
  ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL,
  ACTION_UPDATE_APP_SHOW_USE_EXISTING_SETTINGS_MODAL,
  ACTION_UPDATE_APP_SHOW_DISCARD_MODIFIED_PARAM_FILE_CONTENTS_MODAL,
  ACTION_UPDATE_APP_USE_EXISTING_SETTINGS_MODAL_OPENED,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_DISABLED,
  ACTION_UPDATE_APP_CAN_RENDER_STEP,
  LOCAL_STORAGE_KEY_APP,
  STATE_ORIGIN_STORAGE,
} from "../util/constants";

const persistToLocalStorage = (state) => {
  localStorage.setItem(
    LOCAL_STORAGE_KEY_APP,
    JSON.stringify({
      ...state,
      origin: STATE_ORIGIN_STORAGE,
    }),
  );
};

const reducer = (state, action) => {
  let updatedState = {};

  switch (action.type) {
    case ACTION_UPDATE_APP_STATE:
      persistToLocalStorage(action.nextState);
      return action.nextState;
    case ACTION_UPDATE_APP_STEP:
      updatedState = {
        ...state,
        step: action.nextStep,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_NEXT_STEP:
      updatedState = {
        ...state,
        nextStep: action.nextNextStep,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_PARAM_FILE_CONTENT:
      updatedState = {
        ...state,
        steps: {
          ...state.steps,
          downloadParamFile: {
            ...state.steps.downloadParamFile,
            contents: action.nextParamFileContent,
          },
        },
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_PARAM_FILE_MODIFIED:
      updatedState = {
        ...state,
        steps: {
          ...state.steps,
          downloadParamFile: {
            ...state.steps.downloadParamFile,
            modified: action.nextParamFileContentModified,
          },
        },
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_SHOW_NOTIFICATION:
      updatedState = {
        ...state,
        showNotification: action.nextShowNotification,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_CAN_RENDER_STEP:
      updatedState = {
        ...state,
        canRenderStep: action.nextCanRenderStep,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_HELP_PANEL_EXPANDED:
      updatedState = {
        ...state,
        isHelpPanelExpanded: action.nextIsHelpPanelExpanded,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL:
      updatedState = {
        ...state,
        showConfirmationModal: action.nextShowConfirmationModal,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_SHOW_USE_EXISTING_SETTINGS_MODAL:
      updatedState = {
        ...state,
        showUseExistingSettingsModal: action.nextShowUseExistingSettingsModal,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_SHOW_DISCARD_MODIFIED_PARAM_FILE_CONTENTS_MODAL:
      updatedState = {
        ...state,
        showDiscardModifiedParamFileContentsModal:
          action.nextShowDiscardModifiedParamFileContentsModal,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_USE_EXISTING_SETTINGS_MODAL_OPENED:
      updatedState = {
        ...state,
        useExistingSettingsModalOpened:
          action.nextUseExistingSettingsModalOpened,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_IS_DIRTY:
      updatedState = {
        ...state,
        isDirty: action.nextIsDirty,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_STEPS:
    case ACTION_UPDATE_APP_IS_DISABLED:
      updatedState = {
        ...state,
        steps: action.nextSteps,
      };
      persistToLocalStorage(updatedState);
      console.log(updatedState);
      return updatedState;
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
