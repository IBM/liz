/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer } from "react";
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

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialSummaryState(),
    });
  };

  const updateDownloadParmfile = (flag) => {
    dispatch({
      type: ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE,
      nextOrigin: STATE_ORIGIN_USER,
      nextDownloadParmfile: flag,
    });
  };

  const updateDownloadParmfileName = (name) => {
    dispatch({
      type: ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE_NAME,
      nextOrigin: STATE_ORIGIN_USER,
      nextDownloadParmfileName: name,
    });
  };

  return (
    <SummaryContext.Provider
      value={{
        ...value,
        state,
        updateResetToInitialState,
        updateDownloadParmfile,
        updateDownloadParmfileName,
      }}
    >
      {children}
    </SummaryContext.Provider>
  );
};

SummaryContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default SummaryContextProvider;
