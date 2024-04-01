/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  ACTION_UPDATE_DISTRIBUTION_NAME,
  ACTION_UPDATE_DISTRIBUTION_VERSION,
  ACTION_RESET_TO_INITIAL_STATE,
} from "../util/reducer-action-constants";

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_RESET_TO_INITIAL_STATE:
      // for combined states the state is prefixed by the reducer name
      return (
        action.nextInitialState.inputFileSelectionReducer ||
        action.nextInitialState
      );
    case ACTION_UPDATE_DISTRIBUTION_NAME:
      return {
        ...state,
        selectedDistributionName: action.nextSelectedDistributionName,
        origin: action.nextOrigin,
      };
    case ACTION_UPDATE_DISTRIBUTION_VERSION:
      return {
        ...state,
        selectedDistributionVersion: action.nextSelectedDistributionVersion,
        origin: action.nextOrigin,
      };
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
