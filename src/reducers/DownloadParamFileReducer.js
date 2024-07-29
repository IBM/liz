/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
    ACTION_UPDATE_PARAM_FILE_COPIED,
    ACTION_UPDATE_PARAM_FILE_MODIFIED,
    ACTION_UPDATE_PARAM_FILE_CONTENT,
    ACTION_RESET_TO_INITIAL_STATE,
    ACTION_UPDATE_INSTALLATION_PARAM_SHOW_PASSWORDS,
    ACTION_UPDATE_INSTALLATION_PARAM_IS_EDITING,
} from "../util/reducer-action-constants";

const reducer = (state, action) => {
    switch (action.type) {
        case ACTION_RESET_TO_INITIAL_STATE:
            // for combined states the state is prefixed by the reducer name
            return (
                action.nextInitialState.downloadParamFileReducer ||
                action.nextInitialState
            );
        case ACTION_UPDATE_INSTALLATION_PARAM_SHOW_PASSWORDS:
            return {
                ...state,
                showPasswords: action.nextShowPasswords,
            };
        case ACTION_UPDATE_INSTALLATION_PARAM_IS_EDITING:
            return {
                ...state,
                isEditing: action.nextIsEditing,
            };
        case ACTION_UPDATE_PARAM_FILE_COPIED:
            return {
                ...state,
                paramFileContentCopied: action.nextParamFileContentCopied,
            };
        case ACTION_UPDATE_PARAM_FILE_MODIFIED:
            return {
                ...state,
                paramFileContentModified: action.nextParamFileContentModified,
            };
        case ACTION_UPDATE_PARAM_FILE_CONTENT:
            return {
                ...state,
                paramFileContent: action.nextParamFileContent,
            };
    }

    throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
