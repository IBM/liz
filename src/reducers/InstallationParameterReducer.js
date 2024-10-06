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
    ACTION_UPDATE_INSTALLATION_PARAM_SSH_PASSWORD,
    ACTION_RESET_TO_INITIAL_STATE,
} from "../util/reducer-action-constants";

const reducer = (state, action) => {
    switch (action.type) {
        case ACTION_RESET_TO_INITIAL_STATE:
            // for combined states the state is prefixed by the reducer name
            return (
                action.nextInitialState.installationParameterReducer ||
                action.nextInitialState
            );
        case ACTION_UPDATE_INSTALLATION_PARAM_USE_SSH:
            return {
                ...state,
                useSsh: action.nextUseSsh,
            };

        case ACTION_UPDATE_INSTALLATION_PARAM_USE_VNC:
            return {
                ...state,
                useVnc: action.nextUseVnc,
            };
        case ACTION_UPDATE_INSTALLATION_PARAM_ADDRESS:
            return {
                ...state,
                installationAddress: action.nextInstallationAddress,
                userName: state.userName || action.nextUserName,
                password: state.password || action.nextPassword,
                userAndPwdAreDisabled: action.nextUserAndPwdAreDisabled,
            };
        case ACTION_UPDATE_INSTALLATION_PARAM_USERNAME:
            return {
                ...state,
                userName: action.nextUserName,
            };
        case ACTION_UPDATE_INSTALLATION_PARAM_PASSWORD:
            return {
                ...state,
                password: action.nextPassword,
            };
        case ACTION_UPDATE_INSTALLATION_PARAM_VNC_PASSWORD:
            return {
                ...state,
                vncPassword: action.nextVncPassword,
            };
        case ACTION_UPDATE_INSTALLATION_PARAM_SSH_PASSWORD:
            return {
                ...state,
                sshPassword: action.nextSshPassword,
            };
    }

    throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
