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
} from "../util/constants";

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_RESET_TO_INITIAL_STATE:
      return action.nextInitialState;
    case ACTION_UPDATE_PARAM_FILE_COPIED:
      return {
        paramFileContentCopied: action.nextParamFileContentCopied,
        paramFileContentModified: state.paramFileContentModified,
        paramFileContent: state.paramFileContent,
      };
    case ACTION_UPDATE_PARAM_FILE_MODIFIED:
      return {
        paramFileContentCopied: state.nextParamFileContentCopied,
        paramFileContentModified: action.nextParamFileContentModified,
        paramFileContent: state.paramFileContent,
      };
    case ACTION_UPDATE_PARAM_FILE_CONTENT:
      return {
        paramFileContentCopied: state.nextParamFileContentCopied,
        paramFileContentModified: state.paramFileContentModified,
        paramFileContent: action.nextParamFileContent,
      };
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
