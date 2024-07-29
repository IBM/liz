/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import downloadParamFileReducer from "../reducers/DownloadParamFileReducer";
import { createInitialState as createInitialDownloadParamFileState } from "../states/DownloadParamFileState";
import {
    ACTION_UPDATE_PARAM_FILE_COPIED,
    ACTION_UPDATE_PARAM_FILE_MODIFIED,
    ACTION_UPDATE_PARAM_FILE_CONTENT,
    ACTION_RESET_TO_INITIAL_STATE,
    ACTION_UPDATE_INSTALLATION_PARAM_SHOW_PASSWORDS,
    ACTION_UPDATE_INSTALLATION_PARAM_IS_EDITING,
} from "../util/reducer-action-constants";
import { DownloadParamFileContext } from "./index";

const DownloadParamFileContextProvider = ({ value, children }) => {
    const [state, dispatch] = useReducer(
        downloadParamFileReducer,
        createInitialDownloadParamFileState()
    );

    const updateResetToInitialState = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_RESET_TO_INITIAL_STATE,
                nextInitialState: createInitialDownloadParamFileState(true),
            });
        },
        [state, dispatch]
    );

    const updateShowPasswords = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_INSTALLATION_PARAM_SHOW_PASSWORDS,
                nextShowPasswords: updates,
            });
        },
        [state, dispatch]
    );

    const updateIsEditing = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_INSTALLATION_PARAM_IS_EDITING,
                nextIsEditing: updates,
            });
        },
        [state, dispatch]
    );

    const updatParamFileCopied = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_PARAM_FILE_COPIED,
                nextParamFileContentCopied: updates,
            });
        },
        [state, dispatch]
    );

    const updateModified = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_PARAM_FILE_MODIFIED,
                nextParamFileContentModified: updates,
            });
        },
        [state, dispatch]
    );

    const updateParamFileContent = useCallback((updates) => {
        dispatch({
            type: ACTION_UPDATE_PARAM_FILE_CONTENT,
            nextParamFileContent: updates,
        });
    });

    const resetToInitialState = useCallback(() => {
        updateResetToInitialState();
    }, [state, updateResetToInitialState]);

    const getContextValue = useCallback(
        () => ({
            ...value,
            state,
            updateShowPasswords,
            updateIsEditing,
            updatParamFileCopied,
            updateModified,
            updateParamFileContent,
            resetToInitialState,
        }),
        [
            value,
            state,
            updateShowPasswords,
            updateIsEditing,
            updatParamFileCopied,
            updateModified,
            updateParamFileContent,
            resetToInitialState,
        ]
    );

    return (
        <DownloadParamFileContext.Provider value={getContextValue()}>
            {children}
        </DownloadParamFileContext.Provider>
    );
};

DownloadParamFileContextProvider.propTypes = {
    value: PropTypes.object,
    children: PropTypes.node,
};

export default DownloadParamFileContextProvider;
