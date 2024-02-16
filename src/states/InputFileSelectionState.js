/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
  STATE_ORIGIN_DEFAULT,
  DEFAULT_DISTRIBUTION_ID,
  DEFAULT_VERSION_ID,
  DISTRIBUTION_LIST,
  VERSION_LIST,
} from "../util/constants";

const createInitialState = () => {
  const initialState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION),
  );
  const defaultState = {
    selectedDistributionName: DISTRIBUTION_LIST.find(
      (x) => x.id === DEFAULT_DISTRIBUTION_ID,
    ),
    selectedDistributionVersion: VERSION_LIST.find(
      (x) => x.id === DEFAULT_VERSION_ID,
    ),
    origin: STATE_ORIGIN_DEFAULT,
  };

  if (initialState) {
    return initialState;
  }

  return defaultState;
};

export { createInitialState };
