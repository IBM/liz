/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
    ACTION_UPDATE_NOP,
    ACTION_RESET_TO_INITIAL_STATE,
    ACTION_UPDATE_APP_THEME,
    ACTION_UPDATE_APP_USE_OS_THEME,
    ACTION_UPDATE_APP_SHOW_PASSWORDS,
    ACTION_UPDATE_APP_IS_DIRTY,
} from "../util/reducer-action-constants";

const reducer = (state, action) => {
    switch (action.type) {
        case ACTION_UPDATE_APP_SHOW_PASSWORDS:
            return {
                ...state,
                showPasswords: action.nextShowPasswords,
            };
        case ACTION_UPDATE_APP_IS_DIRTY:
            return {
                ...state,
                isDirty: action.nextIsDirty,
            };
        case ACTION_UPDATE_APP_THEME:
            return {
                ...state,
                theme: action.nextTheme,
            };
        case ACTION_UPDATE_APP_USE_OS_THEME:
            return {
                ...state,
                useOperatingSystemTheme: action.nextUseOperatingSystemTheme,
            };
        case ACTION_RESET_TO_INITIAL_STATE:
            // for combined states the state is prefixed by the reducer name
            return (
                action.nextInitialState.editPageReducer ||
                action.nextInitialState
            );
        case ACTION_UPDATE_NOP:
            return {};
    }

    throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
