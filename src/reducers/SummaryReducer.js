/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  ACTION_UPDATE_NOP,
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE,
  ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE_NAME,
} from "../util/constants";

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE:
      return {
        ...state,
        downloadParmfile: action.nextDownloadParmfile,
        origin: action.nextOrigin,
      };
    case ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE_NAME:
      return {
        ...state,
        downloadParmfileName: action.nextDownloadParmfileName,
        origin: action.nextOrigin,
      };
    case ACTION_RESET_TO_INITIAL_STATE:
      return action.nextInitialState;
    case ACTION_UPDATE_NOP:
      return {};
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
