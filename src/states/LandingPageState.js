/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  LOCAL_STORAGE_KEY_APP_LANDING_PAGE,
  STATE_ORIGIN_DEFAULT,
} from "../util/local-storage-constants";
import { getItem } from "../util/local-storage-util";

const createInitialState = (skipLocalStorageUsage = false) => {
  const initialState = getItem(LOCAL_STORAGE_KEY_APP_LANDING_PAGE);
  const defaultState = {
    requirementsCardIsExpanded: false,
    requirementsCardHasBeenReviewed: false,
    nextStepsCardIsExpanded: false,
    nextStepsCardHasBeenReviewed: false,
    parmfileCardIsExpanded: false,
    origin: STATE_ORIGIN_DEFAULT,
  };

  if (initialState && !skipLocalStorageUsage) {
    return initialState;
  }

  return defaultState;
};

export { createInitialState };
