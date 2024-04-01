/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer } from "react";
import PropTypes from "prop-types";
import downloadParamFileReducer from "../reducers/DownloadParamFileReducer";
import { createInitialState as createInitialDownloadParamFileState } from "../states/DownloadParamFileState";
import {
  ACTION_UPDATE_PARAM_FILE_COPIED,
  ACTION_UPDATE_PARAM_FILE_MODIFIED,
  ACTION_UPDATE_PARAM_FILE_CONTENT,
  ACTION_RESET_TO_INITIAL_STATE,
} from "../util/reducer-action-constants";
import { DownloadParamFileContext } from "./index";

const DownloadParamFileContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    downloadParamFileReducer,
    createInitialDownloadParamFileState(),
  );

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialDownloadParamFileState(),
    });
  };

  const updatParamFileCopied = (flag) => {
    dispatch({
      type: ACTION_UPDATE_PARAM_FILE_COPIED,
      nextParamFileContentCopied: flag,
    });
  };

  const updateModified = (flag) => {
    dispatch({
      type: ACTION_UPDATE_PARAM_FILE_MODIFIED,
      nextParamFileContentModified: flag,
    });
  };

  const updateParamFileContent = (paramFileContent) => {
    dispatch({
      type: ACTION_UPDATE_PARAM_FILE_CONTENT,
      nextParamFileContent: paramFileContent,
    });
  };

  return (
    <DownloadParamFileContext.Provider
      value={{
        ...value,
        state,
        updatParamFileCopied,
        updateModified,
        updateParamFileContent,
        updateResetToInitialState,
      }}
    >
      {children}
    </DownloadParamFileContext.Provider>
  );
};

DownloadParamFileContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default DownloadParamFileContextProvider;
