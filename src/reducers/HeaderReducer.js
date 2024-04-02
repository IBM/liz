/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  ACTION_UPDATE_NOP,
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_APP_HELP_PANEL_EXPANDED,
  ACTION_UPDATE_APP_SHOW_NOTIFICATION,
  ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL,
  ACTION_UPDATE_NEEDS_MANUAL_NAVIGATION_CONFIRMATION,
} from "../util/reducer-action-constants";
import { LOCAL_STORAGE_KEY_APP_HEADER } from "../util/local-storage-constants";
import { persistToLocalStorage } from "../util/local-storage-util";

const reducer = (state, action) => {
  let updatedState = {};

  switch (action.type) {
    case ACTION_UPDATE_APP_HELP_PANEL_EXPANDED:
      updatedState = {
        ...state,
        isHelpPanelExpanded: action.nextIsHelpPanelExpanded,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP_HEADER, updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_SHOW_NOTIFICATION:
      updatedState = {
        ...state,
        showNotification: action.nextShowNotification,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP_HEADER, updatedState);
      return updatedState;
    case ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL:
      updatedState = {
        ...state,
        showConfirmationModal: action.nextShowConfirmationModal,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP_HEADER, updatedState);
      return updatedState;
    case ACTION_RESET_TO_INITIAL_STATE:
      // for combined states the state is prefixed by the reducer name
      updatedState =
        action.nextInitialState.headerReducer || action.nextInitialState;
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP_HEADER, updatedState);
      return updatedState;
    case ACTION_UPDATE_NEEDS_MANUAL_NAVIGATION_CONFIRMATION:
      updatedState = {
        ...state,
        needsManualNavigationConfirmation:
          action.nextNeedsManualNavigationConfirmation,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP_HEADER, updatedState);
      return updatedState;
    case ACTION_UPDATE_NOP:
      return {};
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
