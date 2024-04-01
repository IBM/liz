/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import { DEFAULT_STEPS } from "../util/constants";
import {
  LOCAL_STORAGE_KEY_APP,
  STATE_ORIGIN_DEFAULT,
} from "../util/local-storage-constants";
import { hasLocalStorageState } from "../util/local-storage-util";

const createInitialState = (skipLocalStorageUsage = false) => {
  const initialState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_APP));
  const defaultState = {
    step: 0,
    helpStep: 0,
    nextStep: 0,
    steps: DEFAULT_STEPS,
    showLegalNotification: true,
    isDirty: false,
    isEditing: false,
    canRenderStep: true,
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
