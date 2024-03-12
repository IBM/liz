/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import {
  LOCAL_STORAGE_KEY_APP_INTRO,
  STATE_ORIGIN_DEFAULT,
} from "../util/constants";

const createInitialState = () => {
  const initialState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_APP_INTRO),
  );
  const defaultState = {
    purgeParmfileSettings: false,
    origin: STATE_ORIGIN_DEFAULT,
  };

  if (initialState) {
    return initialState;
  }

  return defaultState;
};

export { createInitialState };
