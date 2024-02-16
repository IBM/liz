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
        step: action.nextStep,
        steps: state.steps,
        showNotification: action.nextShowNotification,
        isDirty: state.isDirty,
        isHelpPanelExpanded: state.isHelpPanelExpanded,
        showConfirmationModal: state.showConfirmationModal,
        showUseExistingSettingsModal: state.showUseExistingSettingsModal,
        useExistingSettingsModalOpened: state.useExistingSettingsModalOpened,
        useStateFromLocalStorage: state.useStateFromLocalStorage,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_SHOW_NOTIFICATION:
      updatedState = {
        step: state.step,
        steps: state.steps,
        showNotification: action.nextShowNotification,
        isDirty: state.isDirty,
        isHelpPanelExpanded: state.isHelpPanelExpanded,
        showConfirmationModal: state.showConfirmationModal,
        showUseExistingSettingsModal: state.showUseExistingSettingsModal,
        useExistingSettingsModalOpened: state.useExistingSettingsModalOpened,
        useStateFromLocalStorage: state.useStateFromLocalStorage,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_HELP_PANEL_EXPANDED:
      updatedState = {
        step: state.step,
        steps: state.steps,
        showNotification: state.showNotification,
        isDirty: state.isDirty,
        isHelpPanelExpanded: action.nextIsHelpPanelExpanded,
        showConfirmationModal: state.showConfirmationModal,
        showUseExistingSettingsModal: state.showUseExistingSettingsModal,
        useExistingSettingsModalOpened: state.useExistingSettingsModalOpened,
        useStateFromLocalStorage: state.useStateFromLocalStorage,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL:
      updatedState = {
        step: state.step,
        steps: state.steps,
        showNotification: state.showNotification,
        isDirty: state.isDirty,
        isHelpPanelExpanded: state.isHelpPanelExpanded,
        showConfirmationModal: action.nextShowConfirmationModal,
        showUseExistingSettingsModal: state.showUseExistingSettingsModal,
        useExistingSettingsModalOpened: state.useExistingSettingsModalOpened,
        useStateFromLocalStorage: state.useStateFromLocalStorage,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_SHOW_USE_EXISTING_SETTINGS_MODAL:
      updatedState = {
        step: state.step,
        steps: state.steps,
        showNotification: state.showNotification,
        isDirty: state.isDirty,
        isHelpPanelExpanded: state.isHelpPanelExpanded,
        showConfirmationModal: state.showConfirmationModal,
        showUseExistingSettingsModal: action.nextShowUseExistingSettingsModal,
        useExistingSettingsModalOpened: state.useExistingSettingsModalOpened,
        useStateFromLocalStorage: state.useStateFromLocalStorage,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_USE_EXISTING_SETTINGS_MODAL_OPENED:
      updatedState = {
        step: state.step,
        steps: state.steps,
        showNotification: state.showNotification,
        isDirty: state.isDirty,
        isHelpPanelExpanded: state.isHelpPanelExpanded,
        showConfirmationModal: state.showConfirmationModal,
        showUseExistingSettingsModal: state.showUseExistingSettingsModal,
        useExistingSettingsModalOpened:
          action.nextUseExistingSettingsModalOpened,
        useStateFromLocalStorage: state.useStateFromLocalStorage,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_IS_DIRTY:
      updatedState = {
        step: state.step,
        steps: state.steps,
        showNotification: state.showNotification,
        isDirty: action.nextIsDirty,
        isHelpPanelExpanded: state.isHelpPanelExpanded,
        showConfirmationModal: state.showConfirmationModal,
        showUseExistingSettingsModal: state.showUseExistingSettingsModal,
        useExistingSettingsModalOpened: state.useExistingSettingsModalOpened,
        useStateFromLocalStorage: state.useStateFromLocalStorage,
      };
      persistToLocalStorage(updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_STEPS:
    case ACTION_UPDATE_APP_IS_DISABLED:
      updatedState = {
        step: state.step,
        steps: action.nextSteps,
        showNotification: state.showNotification,
        isDirty: state.isDirty,
        isHelpPanelExpanded: state.isHelpPanelExpanded,
        showConfirmationModal: state.showConfirmationModal,
        showUseExistingSettingsModal: state.showUseExistingSettingsModal,
        useExistingSettingsModalOpened: state.useExistingSettingsModalOpened,
        useStateFromLocalStorage: state.useStateFromLocalStorage,
      };
      persistToLocalStorage(updatedState);
      console.log(updatedState);
      return updatedState;
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
