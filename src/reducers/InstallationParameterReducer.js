/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  ACTION_UPDATE_INSTALLATION_PARAM_USE_SSH,
  ACTION_UPDATE_INSTALLATION_PARAM_USE_VNC,
  ACTION_UPDATE_INSTALLATION_PARAM_ADDRESS,
  ACTION_UPDATE_INSTALLATION_PARAM_USERNAME,
  ACTION_UPDATE_INSTALLATION_PARAM_PASSWORD,
  ACTION_UPDATE_INSTALLATION_PARAM_VNC_PASSWORD,
  ACTION_RESET_TO_INITIAL_STATE,
} from "../util/constants";

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_RESET_TO_INITIAL_STATE:
      return action.nextInitialState;
    case ACTION_UPDATE_INSTALLATION_PARAM_USE_SSH:
      return {
        useSsh: action.nextUseSsh,
        useVnc: state.useVnc,
        installationAddress: state.installationAddress,
        userName: state.userName,
        password: state.password,
        userAndPwdAreDisabled: state.userAndPwdAreDisabled,
        vncPassword: state.vncPassword,
      };
    case ACTION_UPDATE_INSTALLATION_PARAM_USE_VNC:
      return {
        useSsh: state.useSsh,
        useVnc: action.nextUseVnc,
        installationAddress: state.installationAddress,
        userName: state.userName,
        password: state.password,
        userAndPwdAreDisabled: state.userAndPwdAreDisabled,
        vncPassword: state.vncPassword,
      };
    case ACTION_UPDATE_INSTALLATION_PARAM_ADDRESS:
      return {
        useSsh: state.useSsh,
        useVnc: state.useVnc,
        installationAddress: action.nextInstallationAddress,
        userName: state.userName || action.nextUserName,
        password: state.password || action.nextPassword,
        userAndPwdAreDisabled: action.nextUserAndPwdAreDisabled,
        vncPassword: state.vncPassword,
      };
    case ACTION_UPDATE_INSTALLATION_PARAM_USERNAME:
      return {
        useSsh: state.useSsh,
        useVnc: state.useVnc,
        installationAddress: state.installationAddress,
        userName: action.nextUserName,
        password: state.password,
        userAndPwdAreDisabled: state.userAndPwdAreDisabled,
        vncPassword: state.vncPassword,
      };
    case ACTION_UPDATE_INSTALLATION_PARAM_PASSWORD:
      return {
        useSsh: state.useSsh,
        useVnc: state.useVnc,
        installationAddress: state.installationAddress,
        userName: state.userName,
        password: action.nextPassword,
        userAndPwdAreDisabled: state.userAndPwdAreDisabled,
        vncPassword: state.vncPassword,
      };
    case ACTION_UPDATE_INSTALLATION_PARAM_VNC_PASSWORD:
      return {
        useSsh: state.useSsh,
        useVnc: state.useVnc,
        installationAddress: state.installationAddress,
        userName: state.userName,
        password: state.password,
        userAndPwdAreDisabled: state.userAndPwdAreDisabled,
        vncPassword: action.nextVncPassword,
      };
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
