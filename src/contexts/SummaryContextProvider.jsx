/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import summaryReducer from "../reducers/SummaryReducer";
import { createInitialState as createInitialSummaryState } from "../states/SummaryState";
import {
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE,
  ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE_NAME,
} from "../util/reducer-action-constants";
import { STATE_ORIGIN_USER } from "../util/local-storage-constants";
import { SummaryContext } from "./index";

const SummaryContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    summaryReducer,
    createInitialSummaryState(),
  );

  const updateResetToInitialState = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_RESET_TO_INITIAL_STATE,
        nextInitialState: createInitialSummaryState(true),
      });
    },
    [state, dispatch],
  );

  const updateDownloadParmfile = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE,
        nextOrigin: STATE_ORIGIN_USER,
        nextDownloadParmfile: updates,
      });
    },
    [state, dispatch],
  );

  const updateDownloadParmfileName = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE_NAME,
        nextOrigin: STATE_ORIGIN_USER,
        nextDownloadParmfileName: updates,
      });
    },
    [state, dispatch],
  );

  const resetToInitialState = useCallback(() => {
    updateResetToInitialState();
  }, [state, updateResetToInitialState]);

  const getContextValue = useCallback(
    () => ({
      ...value,
      state,
      updateDownloadParmfile,
      updateDownloadParmfileName,
      resetToInitialState,
    }),
    [
      value,
      state,
      updateDownloadParmfile,
      updateDownloadParmfileName,
      resetToInitialState,
    ],
  );

  return (
    <SummaryContext.Provider value={getContextValue()}>
      {children}
    </SummaryContext.Provider>
  );
};

SummaryContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default SummaryContextProvider;
