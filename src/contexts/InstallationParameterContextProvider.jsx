/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer } from "react";
import PropTypes from "prop-types";
import installationParameterReducer from "../reducers/InstallationParameterReducer";
import { createInitialState as createInitialInstallationParameterState } from "../states/InstallationParameterState";
import { toUrl } from "../util/network-address-util";
import {
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_INSTALLATION_PARAM_USE_SSH,
  ACTION_UPDATE_INSTALLATION_PARAM_USE_VNC,
  ACTION_UPDATE_INSTALLATION_PARAM_ADDRESS,
  ACTION_UPDATE_INSTALLATION_PARAM_USERNAME,
  ACTION_UPDATE_INSTALLATION_PARAM_PASSWORD,
  ACTION_UPDATE_INSTALLATION_PARAM_VNC_PASSWORD,
  ACTION_UPDATE_INSTALLATION_PARAM_SSH_PASSWORD,
} from "../util/reducer-action-constants";
import { InstallationParameterContext } from "./index";

const InstallationParameterContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    installationParameterReducer,
    createInitialInstallationParameterState(),
  );

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialInstallationParameterState(),
    });
  };

  const updateUseSsh = (flag) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_USE_SSH,
      nextUseSsh: flag,
    });
  };

  const updateUseVnc = (flag) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_USE_VNC,
      nextUseVnc: flag,
    });
  };

  const updateInstallationAddress = (address, computedAddress, valid) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_ADDRESS,
      nextInstallationAddress: {
        value: address,
        computed: computedAddress,
        valid,
      },
      nextUserAndPwdAreDisabled:
        !address ||
        address.length === 0 ||
        installationAddressContainsUidOrPwd(address),
      nextUserName: {
        value: "",
        valid: true,
      },
      nextPassword: {
        value: "",
        valid: true,
      },
    });
  };

  const updateUserName = (userName, valid) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_USERNAME,
      nextUserName: {
        value: userName,
        valid,
      },
    });
  };

  const updatePassword = (password, valid) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_PASSWORD,
      nextPassword: {
        value: password,
        valid,
      },
    });
  };

  const updateVncPassword = (password) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_VNC_PASSWORD,
      nextVncPassword: password,
    });
  };

  const updateSshPassword = (password) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_SSH_PASSWORD,
      nextSshPassword: password,
    });
  };

  const installationAddressContainsUidOrPwd = (address) => {
    if (address && address.length > 0) {
      const installationAddressUrl = toUrl(address);
      const username = installationAddressUrl?.username ?? "";
      const password = installationAddressUrl?.password ?? "";
      if (
        (username && username.length > 0) ||
        (password && password.length > 0)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <InstallationParameterContext.Provider
      value={{
        ...value,
        state,
        updateResetToInitialState,
        updateUseSsh,
        updateUseVnc,
        updateInstallationAddress,
        updateUserName,
        updatePassword,
        updateVncPassword,
        updateSshPassword,
      }}
    >
      {children}
    </InstallationParameterContext.Provider>
  );
};

InstallationParameterContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default InstallationParameterContextProvider;
