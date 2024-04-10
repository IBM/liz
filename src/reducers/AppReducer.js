/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  ACTION_UPDATE_APP_STATE,
  ACTION_UPDATE_APP_STEP,
  ACTION_UPDATE_APP_HELP_STEP,
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_NEXT_STEP,
  ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
  ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
  ACTION_UPDATE_APP_SHOW_LEGAL_NOTIFICATION,
  ACTION_UPDATE_APP_USE_STATE_FROM_LOCAL_STORAGE,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_EDITING,
  ACTION_UPDATE_APP_IS_DISABLED,
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_APP_INCLUDE_INTRO_STEP,
} from "../util/reducer-action-constants";
import { LOCAL_STORAGE_KEY_APP } from "../util/local-storage-constants";
import { persistToLocalStorage } from "../util/local-storage-util";

const reducer = (state, action) => {
  let updatedState = {};

  switch (action.type) {
    case ACTION_RESET_TO_INITIAL_STATE:
      // for combined states the state is prefixed by the reducer name
      updatedState = action.nextInitialState.reducer || action.nextInitialState;
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, updatedState, true);
      return updatedState;
    case ACTION_UPDATE_APP_STATE:
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, action.nextState, true);
      return action.nextState;
    case ACTION_UPDATE_APP_STEP:
      updatedState = {
        ...state,
        step: action.nextStep,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, updatedState, true);
      return updatedState;
    case ACTION_UPDATE_APP_HELP_STEP:
      updatedState = {
        ...state,
        helpStep: action.nextHelpStep,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, updatedState, true);
      return updatedState;
    case ACTION_UPDATE_APP_NEXT_STEP:
      updatedState = {
        ...state,
        nextStep: action.nextNextStep,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, updatedState, true);
      return updatedState;
    case ACTION_UPDATE_APP_INCLUDE_INTRO_STEP:
      updatedState = {
        ...state,
        includeIntroStep: action.nextIncludeIntroStep,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, updatedState, true);
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
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, updatedState, true);
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
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, updatedState, true);
      return updatedState;
    case ACTION_UPDATE_APP_SHOW_LEGAL_NOTIFICATION:
      updatedState = {
        ...state,
        showLegalNotification: action.nextShowLegalNotification,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, updatedState, true);
      return updatedState;
    case ACTION_UPDATE_APP_USE_STATE_FROM_LOCAL_STORAGE:
      updatedState = {
        ...state,
        useStateFromLocalStorage: action.nextUseStateFromLocalStorage,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, updatedState, true);
      return updatedState;
    case ACTION_UPDATE_APP_IS_DIRTY:
      updatedState = {
        ...state,
        isDirty: action.nextIsDirty,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, updatedState, true);
      return updatedState;
    case ACTION_UPDATE_APP_IS_EDITING:
      updatedState = {
        ...state,
        isEditing: action.nextIsEditing,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, updatedState, true);
      return updatedState;
    case ACTION_UPDATE_APP_STEPS:
    case ACTION_UPDATE_APP_IS_DISABLED:
      updatedState = {
        ...state,
        steps: action.nextSteps,
      };
      persistToLocalStorage(LOCAL_STORAGE_KEY_APP, updatedState, true);
      return updatedState;
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
