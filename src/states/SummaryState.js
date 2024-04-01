/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  LOCAL_STORAGE_KEY_APP_SUMMARY,
  STATE_ORIGIN_DEFAULT,
} from "../util/local-storage-constants";

const createInitialState = (skipLocalStorageUsage = false) => {
  const initialState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_APP_SUMMARY),
  );
  const defaultState = {
    downloadParmfile: false,
    downloadParmfileName: "",
    origin: STATE_ORIGIN_DEFAULT,
  };

  if (initialState && !skipLocalStorageUsage) {
    return initialState;
  }

  return defaultState;
};

export { createInitialState };
