/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  ACTION_UPDATE_APP_STATE,
  ACTION_UPDATE_APP_STEP,
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_SHOW_NOTIFICATION,
  ACTION_UPDATE_APP_HELP_PANEL_EXPANDED,
  ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL,
  ACTION_UPDATE_APP_SHOW_USE_EXISTING_SETTINGS_MODAL,
  ACTION_UPDATE_APP_USE_EXISTING_SETTINGS_MODAL_OPENED,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_DISABLED,
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
    case ACTION_UPDATE_APP_SHOW_NOTIFICATION:
      updatedState = {
        ...state,
        showNotification: action.nextShowNotification,
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
