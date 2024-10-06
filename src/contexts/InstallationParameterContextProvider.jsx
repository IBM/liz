/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
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
        createInitialInstallationParameterState()
    );

    const updateResetToInitialState = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_RESET_TO_INITIAL_STATE,
                nextInitialState: createInitialInstallationParameterState(true),
            });
        },
        [state, dispatch]
    );

    const updateUseSsh = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_INSTALLATION_PARAM_USE_SSH,
                nextUseSsh: updates,
            });
        },
        [state, dispatch]
    );

    const updateUseVnc = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_INSTALLATION_PARAM_USE_VNC,
                nextUseVnc: updates,
            });
        },
        [state, dispatch]
    );

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

    const updateInstallationAddress = useCallback(
        (updates) => {
            const {
                address,
                computedAddress,
                computedWithPasswordsRemovedAddress,
                valid,
            } = updates;
            dispatch({
                type: ACTION_UPDATE_INSTALLATION_PARAM_ADDRESS,
                nextInstallationAddress: {
                    value: address,
                    computed: computedAddress,
                    computedWithPasswordsRemoved:
                        computedWithPasswordsRemovedAddress,
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
        },
        [state, dispatch, installationAddressContainsUidOrPwd]
    );

    const updateUserName = useCallback(
        (updates) => {
            const { userName, valid } = updates;
            dispatch({
                type: ACTION_UPDATE_INSTALLATION_PARAM_USERNAME,
                nextUserName: {
                    value: userName,
                    valid,
                },
            });
        },
        [state, dispatch]
    );

    const updatePassword = useCallback(
        (updates) => {
            const { password, valid } = updates;
            dispatch({
                type: ACTION_UPDATE_INSTALLATION_PARAM_PASSWORD,
                nextPassword: {
                    value: password,
                    valid,
                },
            });
        },
        [state, dispatch]
    );

    const updateVncPassword = useCallback(
        (updates) => {
            const { password, valid } = updates;
            dispatch({
                type: ACTION_UPDATE_INSTALLATION_PARAM_VNC_PASSWORD,
                nextVncPassword: {
                    value: password,
                    valid,
                },
            });
        },
        [state, dispatch]
    );

    const updateSshPassword = useCallback(
        (updates) => {
            const { password, valid } = updates;
            dispatch({
                type: ACTION_UPDATE_INSTALLATION_PARAM_SSH_PASSWORD,
                nextSshPassword: {
                    value: password,
                    valid,
                },
            });
        },
        [state, dispatch]
    );

    const resetToInitialState = useCallback(() => {
        updateResetToInitialState();
    }, [state, updateResetToInitialState]);

    const getContextValue = useCallback(
        () => ({
            ...value,
            state,
            updateUseSsh,
            updateUseVnc,
            updateInstallationAddress,
            updateUserName,
            updatePassword,
            updateVncPassword,
            updateSshPassword,
            resetToInitialState,
        }),
        [
            value,
            state,
            updateUseSsh,
            updateUseVnc,
            updateInstallationAddress,
            updateUserName,
            updatePassword,
            updateVncPassword,
            updateSshPassword,
            resetToInitialState,
        ]
    );

    return (
        <InstallationParameterContext.Provider value={getContextValue()}>
            {children}
        </InstallationParameterContext.Provider>
    );
};

InstallationParameterContextProvider.propTypes = {
    value: PropTypes.object,
    children: PropTypes.node,
};

export default InstallationParameterContextProvider;
