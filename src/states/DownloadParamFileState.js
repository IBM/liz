/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
  STATE_ORIGIN_DEFAULT,
} from "../util/local-storage-constants";

const createInitialState = () => {
  const initialState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE),
  );
  const defaultState = {
    paramFileContentCopied: false,
    paramFileContentModified: false,
    paramFileContent: "",
    origin: STATE_ORIGIN_DEFAULT,
  };

  if (initialState) {
    return initialState;
  }

  return defaultState;
};

export { createInitialState };
