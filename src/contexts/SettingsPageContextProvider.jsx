/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import settingsPageReducer from "../reducers/SettingsPageReducer";
import { createInitialState as createInitialSettingsPageState } from "../states/SettingsPageState";
import {
    ACTION_RESET_TO_INITIAL_STATE,
    ACTION_UPDATE_APP_THEME,
    ACTION_UPDATE_APP_USE_OS_THEME,
    ACTION_UPDATE_APP_SHOW_PASSWORDS,
    ACTION_UPDATE_APP_IS_DIRTY,
} from "../util/reducer-action-constants";
import { SettingsPageContext } from "./index";

const SettingsPageContextProvider = ({ value, children }) => {
    const [state, dispatch] = useReducer(
        settingsPageReducer,
        createInitialSettingsPageState()
    );

    const updateResetToInitialState = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_RESET_TO_INITIAL_STATE,
                nextInitialState: createInitialSettingsPageState(true),
            });
        },
        [state, dispatch]
    );

    const updateIsDirty = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_IS_DIRTY,
                nextIsDirty: updates,
            });
        },
        [state, dispatch]
    );

    const updateShowPasswords = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_SHOW_PASSWORDS,
                nextShowPasswords: updates,
            });
        },
        [state, dispatch]
    );

    const updateUseOperatingSystemTheme = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_USE_OS_THEME,
                nextUseOperatingSystemTheme: updates,
            });
        },
        [state, dispatch]
    );

    const updateTheme = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_THEME,
                nextTheme: updates,
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
            updateShowPasswords,
            updateUseOperatingSystemTheme,
            updateTheme,
            updateIsDirty,
            resetToInitialState,
        }),
        [
            value,
            state,
            updateShowPasswords,
            updateUseOperatingSystemTheme,
            updateTheme,
            updateIsDirty,
            resetToInitialState,
        ]
    );

    return (
        <SettingsPageContext.Provider value={getContextValue()}>
            {children}
        </SettingsPageContext.Provider>
    );
};

SettingsPageContextProvider.propTypes = {
    value: PropTypes.object,
    children: PropTypes.node,
};

export default SettingsPageContextProvider;
