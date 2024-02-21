/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
  STATE_ORIGIN_DEFAULT,
  DEFAULT_STRING_OBJECT,
} from "../util/constants";

const createInitialState = () => {
  const initialState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS),
  );
  const defaultState = {
    useSsh: false,
    useVnc: true,
    installationAddress: {
      value: "",
      computed: "",
      valid: true,
    },
    userName: DEFAULT_STRING_OBJECT,
    password: DEFAULT_STRING_OBJECT,
    userAndPwdAreDisabled: true,
    vncPassword: "",
    origin: STATE_ORIGIN_DEFAULT,
  };

  if (initialState) {
    return initialState;
  }

  return defaultState;
};

export { createInitialState };
