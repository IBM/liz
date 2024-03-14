/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  LOCAL_STORAGE_KEY_APP,
  STATE_ORIGIN_DEFAULT,
  DEFAULT_STEPS,
} from "../util/constants";
import { hasLocalStorageState } from "../util/local-storage-util";

const createInitialState = (skipLocalStorageUsage = false) => {
  const initialState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_APP));
  const defaultState = {
    step: 0,
    helpStep: 0,
    nextStep: 0,
    steps: DEFAULT_STEPS,
    showNotification: false,
    showLegalNotification: true,
    isDirty: false,
    isEditing: false,
    canRenderStep: true,
    isHelpPanelExpanded: true,
    showConfirmationModal: false,
    showDiscardModifiedParamFileContentsModal: false,
    showSystemRequirementInformationModal: false,
    showNextStepsInformationModal: false,
    useStateFromLocalStorage: hasLocalStorageState(),
    origin: STATE_ORIGIN_DEFAULT,
  };

  if (initialState && !skipLocalStorageUsage) {
    return {
      ...initialState,
      useStateFromLocalStorage: hasLocalStorageState(),
    };
  }

  return defaultState;
};

export default createInitialState;
