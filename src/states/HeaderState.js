/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import {
  LOCAL_STORAGE_KEY_APP_HEADER,
  STATE_ORIGIN_DEFAULT,
} from "../util/local-storage-constants";

const createInitialState = () => {
  const initialState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_APP_HEADER),
  );
  const defaultState = {
    isHelpPanelExpanded: true,
    showNotification: false,
    showConfirmationModal: false,
    origin: STATE_ORIGIN_DEFAULT,
  };

  if (initialState) {
    return initialState;
  }

  return defaultState;
};

export { createInitialState };
